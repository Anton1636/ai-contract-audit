import { Severity } from '@/types/audit'
import { getSeverityColor } from '@/lib/utils'

interface SeverityBadgeProps {
	severity: Severity
	size?: 'sm' | 'md'
}

export default function SeverityBadge({
	severity,
	size = 'md',
}: SeverityBadgeProps) {
	const sizeClasses =
		size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1'

	return (
		<span
			className={`${getSeverityColor(severity)} ${sizeClasses} 
                      rounded-full font-semibold tracking-wide uppercase`}
		>
			{severity}
		</span>
	)
}
