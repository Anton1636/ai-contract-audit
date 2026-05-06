'use client'

import { useState, useRef, useEffect } from 'react'
import { AuditReport, ChatMessage } from '@/types/audit'

interface ChatPanelProps {
	contractCode: string
	auditReport: AuditReport
}

const SUGGESTED_QUESTIONS = [
	'Explain the reentrancy vulnerability in simple terms',
	'Show me the fully fixed contract',
	'How severe is this contract overall?',
	'What should I fix first?',
]

export default function ChatPanel({
	contractCode,
	auditReport,
}: ChatPanelProps) {
	const [messages, setMessages] = useState<ChatMessage[]>(() => [
		{
			id: 'welcome',
			role: 'assistant',
			content: `I've analyzed **${auditReport.contractName}** and found ${auditReport.vulnerabilities.length} vulnerabilities (Score: ${auditReport.score}/100). Ask me anything about the security issues, how to fix them, or request the corrected code.`,
			timestamp: new Date().toISOString(),
		},
	])

	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	async function handleSend(text?: string) {
		const messageText = text || input.trim()
		if (!messageText || isLoading) return

		const now = new Date()

		const userMessage: ChatMessage = {
			id: crypto.randomUUID(),
			role: 'user',
			content: messageText,
			timestamp: now.toISOString(),
		}

		setMessages(prev => [...prev, userMessage])
		setInput('')
		setIsLoading(true)

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contractCode,
					auditReport,
					message: messageText,
					history: messages.filter(m => m.id !== 'welcome'),
				}),
			})

			const data = await response.json()

			const assistantMessage: ChatMessage = {
				id: crypto.randomUUID(),
				role: 'assistant',
				content: data.success
					? data.message
					: 'Sorry, I encountered an error. Please try again.',
				timestamp: new Date().toISOString(),
			}

			setMessages(prev => [...prev, assistantMessage])
		} catch {
			setMessages(prev => [
				...prev,
				{
					id: crypto.randomUUID(),
					role: 'assistant',
					content: 'Connection error. Please try again.',
					timestamp: new Date().toISOString(),
				},
			])
		} finally {
			setIsLoading(false)
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	return (
		<div className='mt-8 bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-xl'>
			{/* Header */}
			<div className='flex items-center gap-3 px-5 py-4 border-b border-gray-800 bg-gray-900/80'>
				<div className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
				<div>
					<p className='text-white font-semibold text-sm'>
						AI Security Assistant
					</p>
					<p className='text-gray-500 text-xs'>
						Knows your contract and audit results
					</p>
				</div>
			</div>

			{/* Messages */}
			<div className='h-96 overflow-y-auto p-5 space-y-4'>
				{messages.map(msg => (
					<div
						key={msg.id}
						className={`flex ${
							msg.role === 'user' ? 'justify-end' : 'justify-start'
						}`}
					>
						<div
							className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
								msg.role === 'user'
									? 'bg-emerald-500 text-gray-950 rounded-br-sm'
									: 'bg-gray-800 text-gray-200 rounded-bl-sm'
							}`}
						>
							{msg.content.split('```').map((part, i) =>
								i % 2 === 1 ? (
									<pre
										key={i}
										className='bg-gray-950 rounded-lg p-3 mt-2 mb-2 text-xs font-mono text-emerald-300 overflow-x-auto'
									>
										{part.replace(/^[a-z]+\n/, '')}
									</pre>
								) : (
									<span key={i} className='whitespace-pre-wrap'>
										{part}
									</span>
								),
							)}
						</div>
					</div>
				))}

				{isLoading && (
					<div className='flex justify-start'>
						<div className='bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3'>
							<div className='flex gap-1 items-center'>
								<div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' />
								<div
									className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
									style={{ animationDelay: '150ms' }}
								/>
								<div
									className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
									style={{ animationDelay: '300ms' }}
								/>
							</div>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Suggested questions */}
			{messages.length === 1 && (
				<div className='px-5 pb-3 flex flex-wrap gap-2'>
					{SUGGESTED_QUESTIONS.map(q => (
						<button
							key={q}
							onClick={() => handleSend(q)}
							className='text-xs px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:border-gray-600 transition-all duration-200'
						>
							{q}
						</button>
					))}
				</div>
			)}

			{/* Input */}
			<div className='px-5 py-4 border-t border-gray-800'>
				<div className='flex gap-3 items-end'>
					<textarea
						ref={inputRef}
						value={input}
						onChange={e => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder='Ask about vulnerabilities, request fixes, or get explanations...'
						rows={1}
						disabled={isLoading}
						className='flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 disabled:opacity-50 resize-none transition-colors duration-200'
						style={{ minHeight: '44px', maxHeight: '120px' }}
					/>
					<button
						onClick={() => handleSend()}
						disabled={!input.trim() || isLoading}
						className='p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shrink-0'
					>
						<svg
							className='w-4 h-4 text-gray-950'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2.5}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5'
							/>
						</svg>
					</button>
				</div>
				<p className='text-xs text-gray-600 mt-2'>
					Enter to send · Shift+Enter for new line
				</p>
			</div>
		</div>
	)
}
