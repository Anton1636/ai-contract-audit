import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Severity, AuditReport } from '@/types/audit'

//Combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Colors severity
export function getSeverityColor(severity: Severity): string {
	const colors = {
		CRITICAL: 'bg-red-500 text-white',
		HIGH: 'bg-orange-500 text-white',
		MEDIUM: 'bg-yellow-500 text-black',
		LOW: 'bg-blue-500 text-white',
		INFO: 'bg-gray-500 text-white',
	}
	return colors[severity]
}

// Colors score
export function getScoreColor(score: number): string {
	if (score >= 80) return 'text-green-500'
	if (score >= 60) return 'text-yellow-500'
	if (score >= 40) return 'text-orange-500'
	return 'text-red-500'
}

// Grade by score
export function getGrade(score: number): AuditReport['grade'] {
	if (score >= 90) return 'A'
	if (score >= 75) return 'B'
	if (score >= 60) return 'C'
	if (score >= 40) return 'D'
	return 'F'
}

// Count vulnerabilities by severity
export function countBySeverity(
	vulnerabilities: AuditReport['vulnerabilities'],
) {
	return vulnerabilities.reduce(
		(acc, v) => {
			acc[v.severity] = (acc[v.severity] || 0) + 1
			return acc
		},
		{} as Record<Severity, number>,
	)
}
