import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildAuditPrompt } from '@/lib/prompts'
import { AuditResponse, AuditReport } from '@/types/audit'
import { MAX_CONTRACT_LENGTH, MIN_CONTRACT_LENGTH } from '@/lib/constants'
import { getGrade } from '@/lib/utils'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Models in priority order
const MODELS = [
	'gemini-3-flash-preview',
	'gemini-3.1-flash-lite-preview',
	'gemini-2.5-flash-lite',
]

// In-memory cache
const auditCache = new Map<string, AuditReport>()

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const MAX_REQUESTS_PER_HOUR = 10

function checkRateLimit(ip: string): boolean {
	const now = Date.now()
	const record = requestCounts.get(ip)

	if (!record || now > record.resetTime) {
		requestCounts.set(ip, {
			count: 1,
			resetTime: now + 60 * 60 * 1000,
		})
		return true
	}

	if (record.count >= MAX_REQUESTS_PER_HOUR) {
		return false
	}

	record.count++
	return true
}

async function generateWithFallback(prompt: string): Promise<string> {
	let lastError: Error | null = null

	for (const modelName of MODELS) {
		try {
			console.log(`Trying model: ${modelName}`)

			const model = genAI.getGenerativeModel({
				model: modelName,
				generationConfig: {
					responseMimeType: 'application/json',
					temperature: 0, // max determinism
				},
			})

			const result = await model.generateContent(prompt)
			console.log(`Success with model: ${modelName}`)
			return result.response.text()
		} catch (error) {
			console.error(`Model ${modelName} failed:`, error)
			lastError = error as Error

			const is503 =
				lastError.message.includes('503') ||
				lastError.message.includes('Service Unavailable') ||
				lastError.message.includes('high demand')

			if (!is503) throw lastError

			console.log(`Model ${modelName} is overloaded, trying next...`)
		}
	}

	throw lastError || new Error('All models failed')
}

export async function POST(
	request: NextRequest,
): Promise<NextResponse<AuditResponse>> {
	try {
		// Rate limiting
		const ip =
			request.headers.get('x-forwarded-for') ||
			request.headers.get('x-real-ip') ||
			'anonymous'

		if (!checkRateLimit(ip)) {
			return NextResponse.json(
				{
					success: false,
					error: `Rate limit exceeded. Maximum ${MAX_REQUESTS_PER_HOUR} audits per hour.`,
				},
				{ status: 429 },
			)
		}

		// Parse body
		const body = await request.json()
		const { code } = body

		// Validation
		if (!code || typeof code !== 'string') {
			return NextResponse.json(
				{ success: false, error: 'No contract code provided' },
				{ status: 400 },
			)
		}

		if (code.trim().length < MIN_CONTRACT_LENGTH) {
			return NextResponse.json(
				{ success: false, error: 'Contract code is too short' },
				{ status: 400 },
			)
		}

		if (code.length > MAX_CONTRACT_LENGTH) {
			return NextResponse.json(
				{
					success: false,
					error: 'Contract code is too long (max 50,000 characters)',
				},
				{ status: 400 },
			)
		}

		// Check cache
		const codeHash = Buffer.from(code).toString('base64').slice(0, 64)

		if (auditCache.has(codeHash)) {
			console.log('Cache hit — returning cached result')
			const cached = auditCache.get(codeHash)!
			return NextResponse.json({ success: true, data: cached })
		}

		// Generate with fallback
		const responseText = await generateWithFallback(buildAuditPrompt(code))

		// parse response
		let auditData: AuditReport

		try {
			const cleanJson = responseText
				.replace(/```json\n?/g, '')
				.replace(/```\n?/g, '')
				.trim()

			auditData = JSON.parse(cleanJson)
		} catch {
			console.error('Failed to parse Gemini response:', responseText)
			return NextResponse.json(
				{
					success: false,
					error: 'Failed to parse audit results. Please try again.',
				},
				{ status: 500 },
			)
		}

		// Add fields
		auditData.grade = getGrade(auditData.score)
		auditData.auditedAt = new Date().toISOString()

		// Save to cache
		auditCache.set(codeHash, auditData)
		console.log(`Cached result for hash: ${codeHash}`)

		//  Return response
		return NextResponse.json({
			success: true,
			data: auditData,
		})
	} catch (error: unknown) {
		console.error('Audit API error:', error)

		if (error instanceof Error) {
			if (
				error.message.includes('429') ||
				error.message.includes('RESOURCE_EXHAUSTED')
			) {
				return NextResponse.json(
					{
						success: false,
						error: 'Rate limit reached. Please wait a moment.',
					},
					{ status: 429 },
				)
			}
			if (error.message.includes('API_KEY_INVALID')) {
				return NextResponse.json(
					{ success: false, error: 'Invalid API key' },
					{ status: 500 },
				)
			}
			if (
				error.message.includes('503') ||
				error.message.includes('Service Unavailable')
			) {
				return NextResponse.json(
					{
						success: false,
						error:
							'AI service is currently overloaded. Please try again in a few minutes.',
					},
					{ status: 503 },
				)
			}
		}

		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

export async function GET(): Promise<NextResponse> {
	return NextResponse.json(
		{ success: false, error: 'Method not allowed' },
		{ status: 405 },
	)
}
