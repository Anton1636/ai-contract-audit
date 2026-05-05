import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildAuditPrompt } from '@/lib/prompts'
import { AuditResponse, AuditReport } from '@/types/audit'
import { MAX_CONTRACT_LENGTH, MIN_CONTRACT_LENGTH } from '@/lib/constants'
import { getGrade } from '@/lib/utils'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(
	request: NextRequest,
): Promise<NextResponse<AuditResponse>> {
	try {
		const body = await request.json()
		const { code } = body

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

		const model = genAI.getGenerativeModel({
			model: 'gemini-2.5-flash',
			generationConfig: {
				responseMimeType: 'application/json', // Gemini returns JSON
				temperature: 0.1, // Keep it low for more deterministic output, important for structured JSON responses
			},
		})

		const result = await model.generateContent(buildAuditPrompt(code))
		const responseText = result.response.text()

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

		auditData.grade = getGrade(auditData.score)
		auditData.auditedAt = new Date().toISOString()

		return NextResponse.json({
			success: true,
			data: auditData,
		})
	} catch (error: unknown) {
		console.error('Audit API error:', error)

		// rate limit Gemini
		if (error instanceof Error) {
			if (error.message.includes('429')) {
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
		}

		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

// Block GET requests
export async function GET(): Promise<NextResponse> {
	return NextResponse.json(
		{ success: false, error: 'Method not allowed' },
		{ status: 405 },
	)
}
