import { getScoreColor } from '@/lib/utils'

interface ScoreRingProps {
	score: number
	grade: string
}

export default function ScoreRing({ score, grade }: ScoreRingProps) {
	const radius = 54
	const circumference = 2 * Math.PI * radius
	const progress = (score / 100) * circumference
	const strokeColor =
		score >= 80
			? '#10b981'
			: score >= 60
				? '#f59e0b'
				: score >= 40
					? '#f97316'
					: '#ef4444'

	return (
		<div className='flex flex-col items-center gap-2'>
			<div className='relative w-36 h-36'>
				<svg className='w-full h-full -rotate-90' viewBox='0 0 120 120'>
					{/* Фон */}
					<circle
						cx='60'
						cy='60'
						r={radius}
						fill='none'
						stroke='#1f2937'
						strokeWidth='10'
					/>
					{/* Progress */}
					<circle
						cx='60'
						cy='60'
						r={radius}
						fill='none'
						stroke={strokeColor}
						strokeWidth='10'
						strokeLinecap='round'
						strokeDasharray={circumference}
						strokeDashoffset={circumference - progress}
						className='transition-all duration-1000 ease-out'
					/>
				</svg>
				{/* Score inside */}
				<div className='absolute inset-0 flex flex-col items-center justify-center'>
					<span className={`text-3xl font-bold ${getScoreColor(score)}`}>
						{score}
					</span>
					<span className='text-xs text-gray-400'>/ 100</span>
				</div>
			</div>
			<div className={`text-5xl font-bold ${getScoreColor(score)}`}>
				{grade}
			</div>
			<span className='text-sm text-gray-400'>Security Grade</span>
		</div>
	)
}
