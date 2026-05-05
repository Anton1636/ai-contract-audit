'use client'

import { AuditStatus } from '@/types/audit'

interface AuditButtonProps {
	onClick: () => void
	status: AuditStatus
	disabled?: boolean
}

export default function AuditButton({
	onClick,
	status,
	disabled = false,
}: AuditButtonProps) {
	const isLoading = status === 'loading'

	return (
		<button
			onClick={onClick}
			disabled={disabled || isLoading}
			className='w-full py-4 px-6 rounded-xl font-semibold text-base
                 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
                 text-gray-950 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-200
                 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30
                 flex items-center justify-center gap-3'
		>
			{isLoading ? (
				<>
					{/* Spinner */}
					<svg
						className='animate-spin h-5 w-5'
						xmlns='http://www.w3.org/2000/svg'
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
					Analyzing Contract...
				</>
			) : (
				<>
					<svg
						className='h-5 w-5'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 
                 11.959 0 013.598 6 11.955 11.955 0 003 
                 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 
                 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 
                 0-6.1-1.248-8.25-3.285z'
						/>
					</svg>
					Audit Smart Contract
				</>
			)}
		</button>
	)
}
