'use client'

import { useState } from 'react'
import CodeEditor from '@/components/CodeEditor'
import AuditButton from '@/components/AuditButton'
import { AuditStatus, AuditReport as AuditReportType, AuditResponse } from "@/types/audit";
import AuditReport from '@/components/AuditReport'

export default function Home() {
	const [code, setCode] = useState('')
	const [status, setStatus] = useState<AuditStatus>('idle')
	const [report, setReport] = useState<AuditReportType | null>(null);
	const [error, setError] = useState<string | null>(null)

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
			} else {
				setError(data.error || 'Unknown error occurred')
				setStatus('error')
			}
		} catch {
			setError('Failed to connect to server')
			setStatus('error')
		}
	}

	return (
		<main className='min-h-screen bg-gray-950 text-gray-100'>
			{/* Header */}
			<header className='border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10'>
				<div className='max-w-6xl mx-auto px-6 py-4 flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center'>
							<svg
								className='w-5 h-5 text-gray-950'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={2}
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
							<p className='text-xs text-gray-400'>Powered by Gemini 3 Flash</p>
						</div>
					</div>
					<a
						href='https://github.com/Anton1636/ai-contract-audit'
						target='_blank'
						rel='noopener noreferrer'
						className='flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200'
					>
						<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
							<path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z' />
						</svg>
						GitHub
					</a>
				</div>
			</header>

			{/* Main Content */}
			<div className='max-w-6xl mx-auto px-6 py-10'>
				{/* Hero */}
				<div className='text-center mb-10'>
					<h2 className='text-4xl font-bold text-white mb-3 tracking-tight'>
						Smart Contract Security Audit
					</h2>
					<p className='text-gray-400 text-lg max-w-2xl mx-auto'>
						Paste your Solidity code and get an instant AI-powered security
						analysis with vulnerability detection and gas optimizations.
					</p>
				</div>

				{/* Editor Section */}
				<div className='bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-4 shadow-xl'>
					<CodeEditor
						value={code}
						onChange={setCode}
						disabled={status === 'loading'}
					/>
				</div>

				{/* Audit Button */}
				<AuditButton
					onClick={handleAudit}
					status={status}
					disabled={!code.trim()}
				/>

				{/* Error */}
				{status === 'error' && error && (
					<div className='mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400'>
						<p className='font-medium'>⚠️ {error}</p>
					</div>
				)}

				{/* Audit Report */}
				{status === 'success' && report && <AuditReport report={report} />}
			</div>
		</main>
	)
}
