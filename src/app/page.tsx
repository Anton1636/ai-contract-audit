'use client'

import { useState } from 'react'
import CodeEditor from '@/components/CodeEditor'
import AuditButton from '@/components/AuditButton'
import AuditReport from '@/components/AuditReport'
import HistoryPanel from '@/components/HistoryPanel'
import ChatPanel from '@/components/ChatPanel'
import LoadingOverlay from '@/components/LoadingOverlay'
import { saveToHistory } from '@/lib/historyStorage'
import type { HistoryEntry } from '@/lib/historyStorage'
import {
	AuditStatus,
	AuditReport as AuditReportType,
	AuditResponse,
} from '@/types/audit'

const STATS = [
	{ label: 'Vulnerability Categories', value: '9+' },
	{ label: 'Real-World References', value: '50+' },
	{ label: 'Audit Speed', value: '~45s' },
]

export default function Home() {
	const [code, setCode] = useState('')
	const [status, setStatus] = useState<AuditStatus>('idle')
	const [report, setReport] = useState<AuditReportType | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<'audit' | 'history'>('audit')

	async function handleAudit() {
		if (!code.trim()) return
		setStatus('loading')
		setError(null)
		setReport(null)

		try {
			const response = await fetch('/api/audit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code }),
			})

			const data: AuditResponse = await response.json()

			if (data.success && data.data) {
				setReport(data.data)
				setStatus('success')
				saveToHistory(code, data.data)
			} else {
				setError(data.error || 'Unknown error occurred')
				setStatus('error')
			}
		} catch {
			setError('Failed to connect to server')
			setStatus('error')
		}
	}

	function handleLoadFromHistory(entry: HistoryEntry) {
		setCode(entry.contractCode)
		setReport(entry.report)
		setStatus('success')
		setActiveTab('audit')
	}

	return (
		<main className='min-h-screen bg-gray-950 text-gray-100 bg-grid'>
			<LoadingOverlay isVisible={status === 'loading'} />

			{/* Header */}
			<header
				className='border-b border-gray-800/80 bg-gray-950/80
                         backdrop-blur-md sticky top-0 z-40'
			>
				<div
					className='max-w-6xl mx-auto px-6 py-4
                        flex items-center justify-between'
				>
					<div className='flex items-center gap-3'>
						<div
							className='w-9 h-9 rounded-xl bg-emerald-500
                            flex items-center justify-center
                            shadow-lg shadow-emerald-500/30'
						>
							<svg
								className='w-5 h-5 text-gray-950'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={2.5}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'
								/>
							</svg>
						</div>
						<div>
							<h1 className='text-lg font-bold text-white tracking-tight'>
								AI Contract Auditor
							</h1>
							<p className='text-xs text-gray-500'>Powered by Gemini</p>
						</div>
					</div>
					<div className='flex items-center gap-4'>
						<div
							className='hidden md:flex items-center gap-2 text-xs
                            text-gray-500 bg-gray-900 px-3 py-1.5
                            rounded-full border border-gray-800'
						>
							<div className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
							System Online
						</div>
						<a
							href='https://github.com/Anton1636/ai-contract-audit'
							target='_blank'
							rel='noopener noreferrer'
							className='flex items-center gap-2 text-sm text-gray-400
                         hover:text-white transition-colors duration-200
                         bg-gray-900 px-3 py-1.5 rounded-full
                         border border-gray-800 hover:border-gray-600'
						>
							<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
								<path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z' />
							</svg>
							GitHub
						</a>
					</div>
				</div>
			</header>

			<div className='max-w-6xl mx-auto px-6 py-12'>
				{/* Hero */}
				<div className='text-center mb-12'>
					<div
						className='inline-flex items-center gap-2 bg-emerald-500/10
                          border border-emerald-500/20 rounded-full
                          px-4 py-1.5 mb-6'
					>
						<div className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
						<span className='text-emerald-400 text-xs font-medium tracking-wide'>
							Powered by Gemini and Hobermac
						</span>
					</div>

					<h2
						className='text-5xl font-black text-white mb-4
                         tracking-tight leading-tight'
					>
						Smart Contract <span className='gradient-text'>Security Audit</span>
					</h2>
					<p className='text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed'>
						AI-powered vulnerability detection combining the methodologies of
						the world’s top smart contract auditors.
					</p>

					<div className='flex justify-center gap-8 mt-8'>
						{STATS.map(stat => (
							<div key={stat.label} className='text-center'>
								<p className='text-2xl font-bold text-emerald-400'>
									{stat.value}
								</p>
								<p className='text-xs text-gray-500 mt-0.5'>{stat.label}</p>
							</div>
						))}
					</div>
				</div>

				{/* Tabs */}
				<div
					className='flex gap-1 mb-6 bg-gray-900/80 p-1 rounded-xl
                        border border-gray-800 w-fit backdrop-blur-sm'
				>
					{(['audit', 'history'] as const).map(tab => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-6 py-2 rounded-lg text-sm font-medium
                          transition-all duration-200 capitalize
                          ${
														activeTab === tab
															? 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/20'
															: 'text-gray-400 hover:text-white'
													}`}
						>
							{tab}
						</button>
					))}
				</div>

				{/* Audit Tab */}
				{activeTab === 'audit' && (
					<div>
						<div
							className='bg-gray-900/80 backdrop-blur-sm rounded-2xl
                            border border-gray-800 p-6 mb-4 shadow-2xl
                            glow-emerald'
						>
							<CodeEditor
								value={code}
								onChange={setCode}
								disabled={status === 'loading'}
							/>
						</div>

						<AuditButton
							onClick={handleAudit}
							status={status}
							disabled={!code.trim()}
						/>

						{status === 'error' && error && (
							<div
								className='mt-6 p-4 rounded-xl bg-red-500/10
                              border border-red-500/30 text-red-400
                              flex items-center gap-3'
							>
								<svg
									className='w-5 h-5 shrink-0'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
									strokeWidth={2}
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
									/>
								</svg>
								<p className='font-medium'>{error}</p>
							</div>
						)}

						{status === 'success' && report && <AuditReport report={report} />}
					</div>
				)}

				{/* History Tab */}
				{activeTab === 'history' && (
					<div
						className='bg-gray-900/80 backdrop-blur-sm rounded-2xl
                          border border-gray-800 p-6'
					>
						<HistoryPanel onLoad={handleLoadFromHistory} />
					</div>
				)}
			</div>

			{/* Floating AI Chat */}
			<ChatPanel
				contractCode={code || undefined}
				auditReport={report || undefined}
			/>
		</main>
	)
}
