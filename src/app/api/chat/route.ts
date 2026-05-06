import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildChatPrompt } from '@/lib/prompts'
import { AuditReport, ChatMessage } from '@/types/audit'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const MODELS = [
	'gemini-3-flash-preview',
	'gemini-3.1-flash-lite-preview',
	'gemini-2.5-flash-lite',
]

async function generateChatResponse(prompt: string): Promise<string> {
	let lastError: Error | null = null

	for (const modelName of MODELS) {
		try {
			const model = genAI.getGenerativeModel({
				model: modelName,
				generationConfig: {
					temperature: 0.1,
				},
			})

			const result = await model.generateContent(prompt)
			return result.response.text()
		} catch (error) {
			lastError = error as Error
			const is503 =
				lastError.message.includes('503') ||
				lastError.message.includes('Service Unavailable')
			if (!is503) throw lastError
		}
	}

	throw lastError || new Error('All models failed')
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const {
			contractCode,
			auditReport,
			message,
			history,
		}: {
			contractCode: string
			auditReport: AuditReport
			message: string
			history: ChatMessage[]
		} = body

		if (!message?.trim()) {
			return NextResponse.json(
				{ success: false, error: 'Message is required' },
				{ status: 400 },
			)
		}

		if (!contractCode || !auditReport) {
			return NextResponse.json(
				{
					success: false,
					error: 'Contract code and audit report are required',
				},
				{ status: 400 },
			)
		}

		const auditSummary = `
Contract: ${auditReport.contractName}
Score: ${auditReport.score}/100 (Grade: ${auditReport.grade})
Summary: ${auditReport.summary}
Vulnerabilities found: ${auditReport.vulnerabilities.length}
${auditReport.vulnerabilities
	.map(v => `- [${v.severity}] ${v.title}: ${v.description}`)
	.join('\n')}
Gas optimizations: ${auditReport.gasOptimizations.length}
Overall recommendation: ${auditReport.overallRecommendation}
    `.trim()

		const prompt = buildChatPrompt(
			contractCode,
			auditSummary,
			message,
			history.map(m => ({ role: m.role, content: m.content })),
		)

		const response = await generateChatResponse(prompt)

		return NextResponse.json({
			success: true,
			message: response,
		})
	} catch (error) {
		console.error('Chat API error:', error)
		return NextResponse.json(
			{ success: false, error: 'Failed to get response' },
			{ status: 500 },
		)
	}
}
