'use client'

import { useState, useEffect } from 'react'

interface LoadingOverlayProps {
	isVisible: boolean
}

const CAT_GIFS = [
	'https://media0.giphy.com/media/qDOI1FqYEyTxkW0MEI/giphy.gif',
	'https://media2.giphy.com/media/3uAB3yMvKnCyYyOx9F/giphy.gif',
]

const LOADING_MESSAGES = [
	'Initializing security scanner...',
	'Analyzing access control patterns...',
	'Detecting reentrancy vulnerabilities...',
	'Checking mathematical operations...',
	'Scanning for logic errors...',
	'Running gas optimization analysis...',
	'Cross-referencing known exploits...',
	'Generating audit report...',
]

export default function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
	const [progress, setProgress] = useState(0)
	const [currentGif, setCurrentGif] = useState(0)
	const [messageIndex, setMessageIndex] = useState(0)
	const [opacity, setOpacity] = useState(1)

	// Reset progress when hidden
	useEffect(() => {
		if (!isVisible) {
			const timer = setTimeout(() => {
				setProgress(0)
				setMessageIndex(0)
				setCurrentGif(0)
				setOpacity(1)
			}, 300)
			return () => clearTimeout(timer)
		}
	}, [isVisible])

	// Progress bar
	useEffect(() => {
		if (!isVisible) return

		const interval = setInterval(() => {
			setProgress(prev => {
				if (prev < 30) return prev + 2
				if (prev < 60) return prev + 1
				if (prev < 80) return prev + 0.5
				if (prev < 90) return prev + 0.2
				return prev
			})
		}, 400)

		return () => clearInterval(interval)
	}, [isVisible])

	// Change messages
	useEffect(() => {
		if (!isVisible) return

		const interval = setInterval(() => {
			setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length)
		}, 4000)

		return () => clearInterval(interval)
	}, [isVisible])

	// Change GIFs every 7 seconds
	useEffect(() => {
		if (!isVisible) return

		const interval = setInterval(() => {
			setOpacity(0)
			setTimeout(() => {
				setCurrentGif(prev => (prev + 1) % CAT_GIFS.length)
				setOpacity(1)
			}, 500)
		}, 7000)

		return () => clearInterval(interval)
	}, [isVisible])

	if (!isVisible) return null

	return (
		<div
			className='fixed inset-0 z-50 flex flex-col items-center
                    justify-center bg-gray-950/95 backdrop-blur-sm'
		>
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div
					className='absolute top-1/2 left-1/2 -translate-x-1/2
                        -translate-y-1/2 w-150 h-150 rounded-full
                        bg-emerald-500/5 blur-3xl'
				/>
			</div>

			<div className='relative flex flex-col items-center gap-8 px-6 max-w-lg w-full'>
				<div className='text-center'>
					<p
						className='text-emerald-400 text-sm font-mono tracking-widest
                        uppercase mb-2'
					>
						AI Security Analysis
					</p>
					<h2 className='text-2xl font-bold text-white'>
						Auditing Your Contract
					</h2>
				</div>

				{/* GIF */}
				<div
					className='relative rounded-2xl overflow-hidden border
                      border-emerald-500/20 shadow-2xl shadow-emerald-500/10'
					style={{ transition: 'opacity 0.5s ease-in-out', opacity }}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={CAT_GIFS[currentGif]}
						alt='Analyzing...'
						className='w-72 h-52 object-cover'
					/>
					<div
						className='absolute bottom-0 left-0 right-0 px-3 py-2
                          bg-linear-to-t from-gray-950 to-transparent'
					>
						<p className='text-emerald-400 text-xs font-mono text-center'>
							{LOADING_MESSAGES[messageIndex]}
						</p>
					</div>
				</div>

				{/*Progress bar */}
				<div className='w-full space-y-2'>
					<div className='flex justify-between items-center'>
						<span className='text-gray-400 text-xs font-mono truncate max-w-50'>
							{LOADING_MESSAGES[messageIndex]}
						</span>
						<span className='text-emerald-400 text-sm font-bold font-mono'>
							{Math.round(progress)}%
						</span>
					</div>

					<div
						className='h-2 bg-gray-800 rounded-full overflow-hidden
                          border border-gray-700/50'
					>
						<div
							className='h-full rounded-full relative overflow-hidden'
							style={{
								width: `${progress}%`,
								background: 'linear-gradient(90deg, #059669, #10b981, #34d399)',
								transition: 'width 0.4s ease-out',
							}}
						>
							<div
								className='absolute inset-0 opacity-60'
								style={{
									background:
										'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
									animation: 'shimmer 1.5s infinite',
								}}
							/>
						</div>
					</div>

					<div className='flex justify-center gap-2 pt-1'>
						{CAT_GIFS.map((_, i) => (
							<div
								key={i}
								className='w-1.5 h-1.5 rounded-full transition-all duration-500'
								style={{
									backgroundColor: i === currentGif ? '#10b981' : '#374151',
									transform: i === currentGif ? 'scale(1.3)' : 'scale(1)',
								}}
							/>
						))}
					</div>
				</div>

				<p className='text-gray-600 text-xs text-center'>
					Analysis takes 30–60 seconds for thorough results
				</p>
			</div>
		</div>
	)
}
