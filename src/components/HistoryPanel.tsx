'use client'

import { useState } from 'react'
import {
	getHistory,
	deleteFromHistory,
	clearHistory,
	HistoryEntry,
} from '@/lib/historyStorage'
import { getScoreColor } from '@/lib/utils'

interface HistoryPanelProps {
	onLoad: (entry: HistoryEntry) => void
}

export default function HistoryPanel({ onLoad }: HistoryPanelProps) {
	const [confirmClear, setConfirmClear] = useState(false)
	const [history, setHistory] = useState<HistoryEntry[]>(() => getHistory())

	function handleDelete(id: string) {
		deleteFromHistory(id)
		setHistory(getHistory())
	}

	function handleClear() {
		if (confirmClear) {
			clearHistory()
			setHistory([])
			setConfirmClear(false)
		} else {
			setConfirmClear(true)
			setTimeout(() => setConfirmClear(false), 3000)
		}
	}

	if (history.length === 0) {
		return (
			<div className='text-center py-16'>
				<div className='text-4xl mb-3'>📭</div>
				<p className='text-gray-400 font-medium'>No audit history yet</p>
				<p className='text-gray-600 text-sm mt-1'>
					Your past audits will appear here
				</p>
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<p className='text-gray-400 text-sm'>
					{history.length} audit{history.length !== 1 ? 's' : ''} saved
				</p>
				<button
					onClick={handleClear}
					className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200
                      ${
												confirmClear
													? 'bg-red-500 text-white'
													: 'text-gray-500 hover:text-red-400 border border-gray-700 hover:border-red-500/50'
											}`}
				>
					{confirmClear ? 'Click again to confirm' : 'Clear All'}
				</button>
			</div>

			{/* List */}
			{history.map(entry => (
				<div
					key={entry.id}
					className='bg-gray-900 rounded-xl border border-gray-800 p-4
                     hover:border-gray-700 transition-all duration-200'
				>
					<div className='flex items-start justify-between gap-4'>
						{/* Info */}
						<div className='flex-1 min-w-0'>
							<div className='flex items-center gap-3 mb-1'>
								<span
									className={`text-2xl font-bold ${getScoreColor(entry.report.score)}`}
								>
									{entry.report.score}
								</span>
								<span
									className={`text-lg font-bold ${getScoreColor(entry.report.score)}`}
								>
									{entry.report.grade}
								</span>
								<span className='text-white font-semibold truncate'>
									{entry.report.contractName || 'Unknown Contract'}
								</span>
							</div>

							{/* Vulnerability counts */}
							<div className='flex flex-wrap gap-1.5 mb-2'>
								{entry.report.vulnerabilities.length === 0 ? (
									<span className='text-xs text-emerald-400'>
										No vulnerabilities found
									</span>
								) : (
									(() => {
										const counts: Record<string, number> = {}
										entry.report.vulnerabilities.forEach(v => {
											counts[v.severity] = (counts[v.severity] || 0) + 1
										})
										return Object.entries(counts).map(([sev, count]) => (
											<span
												key={sev}
												className='text-xs px-2 py-0.5 rounded-full bg-gray-800 
                                   text-gray-400 font-mono'
											>
												{sev} ×{count}
											</span>
										))
									})()
								)}
							</div>

							<p className='text-xs text-gray-600'>
								{new Date(entry.savedAt).toLocaleString('en-GB', {
									dateStyle: 'medium',
									timeStyle: 'short',
								})}
							</p>
						</div>

						{/* Actions */}
						<div className='flex items-center gap-2 shrink-0'>
							<button
								onClick={() => onLoad(entry)}
								className='text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 
                           hover:bg-emerald-500/20 border border-emerald-500/30 
                           text-emerald-400 transition-all duration-200'
							>
								Load
							</button>
							<button
								onClick={() => handleDelete(entry.id)}
								className='text-xs px-3 py-1.5 rounded-lg bg-red-500/10 
                           hover:bg-red-500/20 border border-red-500/30 
                           text-red-400 transition-all duration-200'
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
