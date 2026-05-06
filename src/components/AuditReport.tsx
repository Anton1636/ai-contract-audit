import { AuditReport as AuditReportType } from '@/types/audit'
import { countBySeverity } from '@/lib/utils'
import ScoreRing from './ScoreRing'
import VulnerabilityCard from './VulnerabilityCard'
import SeverityBadge from './SeverityBadge'
import { exportAuditToPdf } from '@/lib/exportPdf'
import { useState } from 'react'
interface AuditReportProps {
	report: AuditReportType
}

export default function AuditReport({ report }: AuditReportProps) {
	const counts = countBySeverity(report.vulnerabilities)
	const [exporting, setExporting] = useState(false)

	async function handleExport() {
		setExporting(true)
		try {
			await exportAuditToPdf(report)
		} finally {
			setExporting(false)
		}
	}

	return (
		<div className='mt-8 space-y-6'>
			{/* Score Section */}
			<div className='bg-gray-900 rounded-2xl border border-gray-800 p-6'>
				<div className='flex flex-col md:flex-row items-center gap-8'>
					{/* Score Ring */}
					<ScoreRing score={report.score} grade={report.grade} />

					{/* Summary */}
					<div className='flex-1 space-y-4'>
						<div>
							<h3 className='text-white font-bold text-xl mb-1'>
								{report.contractName}
							</h3>
							<p className='text-gray-400 text-sm leading-relaxed'>
								{report.summary}
							</p>
						</div>

						{/* Severity counts */}
						<div className='flex flex-wrap gap-2'>
							{(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const).map(
								sev =>
									counts[sev] ? (
										<div key={sev} className='flex items-center gap-1.5'>
											<SeverityBadge severity={sev} size='sm' />
											<span className='text-gray-400 text-xs'>
												×{counts[sev]}
											</span>
										</div>
									) : null,
							)}
						</div>

						{/* Meta */}
						<p className='text-xs text-gray-600'>
							Audited at{' '}
							{new Date(report.auditedAt).toLocaleString('en-GB', {
								dateStyle: 'medium',
								timeStyle: 'short',
							})}
						</p>

						{/* Export Button */}
						<button
							onClick={handleExport}
							disabled={exporting}
							className='flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-emerald-500/10 hover:bg-emerald-500/20
                         border border-emerald-500/30 text-emerald-400
                         text-sm font-medium transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{exporting ? (
								<>
									<svg
										className='animate-spin h-4 w-4'
										fill='none'
										viewBox='0 0 24 24'
									>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'
										/>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
										/>
									</svg>
									Exporting...
								</>
							) : (
								<>
									<svg
										className='h-4 w-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
										strokeWidth={2}
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
										/>
									</svg>
									Export PDF
								</>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Vulnerabilities */}
			{report.vulnerabilities.length > 0 && (
				<div>
					<h3 className='text-white font-bold text-lg mb-3 flex items-center gap-2'>
						<span className='text-red-400'>🔴</span>
						Vulnerabilities
						<span className='text-gray-500 font-normal text-sm'>
							({report.vulnerabilities.length})
						</span>
					</h3>
					<div className='space-y-3'>
						{report.vulnerabilities.map((vuln, index) => (
							<VulnerabilityCard
								key={vuln.id}
								vulnerability={vuln}
								index={index}
							/>
						))}
					</div>
				</div>
			)}

			{/* Gas Optimizations */}
			{report.gasOptimizations.length > 0 && (
				<div>
					<h3 className='text-white font-bold text-lg mb-3 flex items-center gap-2'>
						<span>⚡</span>
						Gas Optimizations
						<span className='text-gray-500 font-normal text-sm'>
							({report.gasOptimizations.length})
						</span>
					</h3>
					<div className='space-y-3'>
						{report.gasOptimizations.map(opt => (
							<div
								key={opt.id}
								className='rounded-xl border border-gray-700/50 bg-gray-800/30 p-4'
							>
								<div className='flex items-start justify-between gap-4 mb-2'>
									<p className='text-white font-semibold'>{opt.title}</p>
									<span
										className='text-xs text-emerald-400 bg-emerald-400/10 
                                   px-2 py-1 rounded-full shrink-0 font-mono'
									>
										{opt.estimatedSaving}
									</span>
								</div>
								<p className='text-gray-400 text-sm leading-relaxed mb-3'>
									{opt.description}
								</p>
								{opt.fixedCode && (
									<pre
										className='bg-gray-950 rounded-lg p-3 text-xs 
                                  text-emerald-300 font-mono overflow-x-auto 
                                  border border-emerald-500/20'
									>
										{opt.fixedCode}
									</pre>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Overall Recommendation */}
			<div className='bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5'>
				<h3 className='text-blue-300 font-bold mb-2 flex items-center gap-2'>
					<span>💡</span> Overall Recommendation
				</h3>
				<p className='text-gray-300 text-sm leading-relaxed'>
					{report.overallRecommendation}
				</p>
			</div>
		</div>
	)
}
