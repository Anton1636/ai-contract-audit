'use client'

import { useState, useRef, useEffect } from 'react'
import { AuditReport, ChatMessage } from '@/types/audit'

interface ChatPanelProps {
	contractCode?: string
	auditReport?: AuditReport
}

const SUGGESTED_QUESTIONS_AUDIT = [
	'Explain the reentrancy vulnerability',
	'Show me the fully fixed contract',
	'What should I fix first?',
	'How severe is this contract?',
]

const SUGGESTED_QUESTIONS_DEFAULT = [
	'What is a reentrancy attack?',
	'How do I write a secure ERC-20 token?',
	'What are common Solidity vulnerabilities?',
	'Explain access control in smart contracts',
]

export default function ChatPanel({
	contractCode,
	auditReport,
}: ChatPanelProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState<ChatMessage[]>(() => [
		{
			id: 'welcome',
			role: 'assistant',
			content: auditReport
				? `I've analyzed **${auditReport.contractName}** and found ${auditReport.vulnerabilities.length} vulnerabilities (Score: ${auditReport.score}/100). Ask me anything about the security issues or how to fix them.`
				: "Hi! I'm your AI security assistant. Paste a contract and run an audit, or ask me anything about smart contract security.",
			timestamp: new Date().toISOString(),
		},
	])

	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLTextAreaElement>(null)

	// Update welcome message when a new audit report is received
	const prevReportRef = useRef<AuditReport | undefined>(undefined)

	useEffect(() => {
		if (auditReport && auditReport !== prevReportRef.current) {
			prevReportRef.current = auditReport
			setMessages([
				{
					id: 'welcome',
					role: 'assistant',
					content: `Audit complete! **${auditReport.contractName}** scored **${auditReport.score}/100** (Grade: ${auditReport.grade}) with ${auditReport.vulnerabilities.length} vulnerabilities found. What would you like to know?`,
					timestamp: new Date().toISOString(),
				},
			])
		}
	}, [auditReport])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	async function handleSend(text?: string) {
		const messageText = text || input.trim()
		if (!messageText || isLoading) return

		const now = new Date()
		const userMessage: ChatMessage = {
			id: `user_${now.getTime()}`,
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
					contractCode: contractCode || '',
					auditReport: auditReport || null,
					message: messageText,
					history: messages.filter(m => m.id !== 'welcome'),
				}),
			})

			const data = await response.json()
			const assistantNow = new Date()

			setMessages(prev => [
				...prev,
				{
					id: `assistant_${assistantNow.getTime()}`,
					role: 'assistant',
					content: data.success
						? data.message
						: 'Sorry, I encountered an error. Please try again.',
					timestamp: assistantNow.toISOString(),
				},
			])
		} catch {
			const errorNow = new Date()
			setMessages(prev => [
				...prev,
				{
					id: `error_${errorNow.getTime()}`,
					role: 'assistant',
					content: 'Connection error. Please try again.',
					timestamp: errorNow.toISOString(),
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

	const suggestedQuestions = auditReport
		? SUGGESTED_QUESTIONS_AUDIT
		: SUGGESTED_QUESTIONS_DEFAULT

	return (
		<>
			{/* Floating Button */}
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className='fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                     bg-emerald-500 hover:bg-emerald-400 shadow-2xl
                     shadow-emerald-500/30 flex items-center justify-center
                     transition-all duration-300 hover:scale-110'
				>
					<svg
						className='w-6 h-6 text-gray-950'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
						/>
					</svg>
					{/* Notification dot if there is an audit report */}
					{auditReport && (
						<span
							className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 
                             rounded-full border-2 border-gray-950'
						/>
					)}
				</button>
			)}

			{/* Chat Window */}
			<div
				className={`fixed bottom-6 right-6 z-50 w-96 bg-gray-900 
                    rounded-2xl border border-gray-800 shadow-2xl
                    shadow-black/50 flex flex-col overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${
											isOpen
												? 'opacity-100 translate-y-0 pointer-events-auto'
												: 'opacity-0 translate-y-4 pointer-events-none'
										}`}
				style={{ height: '560px' }}
			>
				{/* Header */}
				<div
					className='flex items-center justify-between px-4 py-3
                        border-b border-gray-800 bg-gray-900/80 shrink-0'
				>
					<div className='flex items-center gap-2'>
						<div className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
						<div>
							<p className='text-white font-semibold text-sm'>
								AI Security Assistant
							</p>
							<p className='text-gray-500 text-xs'>
								{auditReport
									? `Analyzing ${auditReport.contractName}`
									: 'Ready to help'}
							</p>
						</div>
					</div>
					<button
						onClick={() => setIsOpen(false)}
						className='text-gray-400 hover:text-white transition-colors 
                       duration-200 p-1 rounded-lg hover:bg-gray-800'
					>
						<svg
							className='w-4 h-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={2}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M19 9l-7 7-7-7'
							/>
						</svg>
					</button>
				</div>

				{/* Messages */}
				<div className='flex-1 overflow-y-auto p-4 space-y-3'>
					{messages.map(msg => (
						<div
							key={msg.id}
							className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
						>
							<div
								className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm 
                            leading-relaxed
                            ${
															msg.role === 'user'
																? 'bg-emerald-500 text-gray-950 rounded-br-sm'
																: 'bg-gray-800 text-gray-200 rounded-bl-sm'
														}`}
							>
								{msg.content.split('```').map((part, i) =>
									i % 2 === 1 ? (
										<pre
											key={i}
											className='bg-gray-950 rounded-lg p-2 mt-2 mb-2
                                 text-xs font-mono text-emerald-300
                                 overflow-x-auto'
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

					{/* Loading */}
					{isLoading && (
						<div className='flex justify-start'>
							<div className='bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3'>
								<div className='flex gap-1 items-center'>
									{[0, 150, 300].map(delay => (
										<div
											key={delay}
											className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
											style={{ animationDelay: `${delay}ms` }}
										/>
									))}
								</div>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Suggested questions */}
				{messages.length === 1 && (
					<div className='px-4 pb-2 flex flex-wrap gap-1.5 shrink-0'>
						{suggestedQuestions.map(q => (
							<button
								key={q}
								onClick={() => handleSend(q)}
								className='text-xs px-2.5 py-1 rounded-full bg-gray-800
                           hover:bg-gray-700 text-gray-300 border border-gray-700
                           hover:border-gray-600 transition-all duration-200'
							>
								{q}
							</button>
						))}
					</div>
				)}

				{/* Input */}
				<div className='px-4 py-3 border-t border-gray-800 shrink-0'>
					<div className='flex gap-2 items-end'>
						<textarea
							ref={inputRef}
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder='Ask anything about smart contract security...'
							rows={1}
							disabled={isLoading}
							className='flex-1 bg-gray-800 border border-gray-700 rounded-xl
                         px-3 py-2 text-sm text-gray-100 placeholder-gray-500
                         focus:outline-none focus:border-emerald-500/50
                         disabled:opacity-50 resize-none
                         transition-colors duration-200'
							style={{ minHeight: '40px', maxHeight: '100px' }}
						/>
						<button
							onClick={() => handleSend()}
							disabled={!input.trim() || isLoading}
							className='p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shrink-0'
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
					<p className='text-xs text-gray-600 mt-1.5'>
						Enter to send · Shift+Enter for new line
					</p>
				</div>
			</div>
		</>
	)
}
