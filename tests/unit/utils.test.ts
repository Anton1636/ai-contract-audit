import {
	getSeverityColor,
	getScoreColor,
	getGrade,
	countBySeverity,
} from '@/lib/utils'
import { Vulnerability } from '@/types/audit'

describe('getSeverityColor', () => {
	it('returns red for CRITICAL', () => {
		expect(getSeverityColor('CRITICAL')).toContain('red')
	})

	it('returns orange for HIGH', () => {
		expect(getSeverityColor('HIGH')).toContain('orange')
	})

	it('returns yellow for MEDIUM', () => {
		expect(getSeverityColor('MEDIUM')).toContain('yellow')
	})

	it('returns blue for LOW', () => {
		expect(getSeverityColor('LOW')).toContain('blue')
	})

	it('returns gray for INFO', () => {
		expect(getSeverityColor('INFO')).toContain('gray')
	})
})

describe('getScoreColor', () => {
	it('returns green for score >= 80', () => {
		expect(getScoreColor(80)).toContain('green')
		expect(getScoreColor(100)).toContain('green')
	})

	it('returns yellow for score 60-79', () => {
		expect(getScoreColor(60)).toContain('yellow')
		expect(getScoreColor(79)).toContain('yellow')
	})

	it('returns orange for score 40-59', () => {
		expect(getScoreColor(40)).toContain('orange')
		expect(getScoreColor(59)).toContain('orange')
	})

	it('returns red for score < 40', () => {
		expect(getScoreColor(0)).toContain('red')
		expect(getScoreColor(39)).toContain('red')
	})
})

describe('getGrade', () => {
	it('returns A for score >= 90', () => {
		expect(getGrade(90)).toBe('A')
		expect(getGrade(100)).toBe('A')
	})

	it('returns B for score 75-89', () => {
		expect(getGrade(75)).toBe('B')
		expect(getGrade(89)).toBe('B')
	})

	it('returns C for score 60-74', () => {
		expect(getGrade(60)).toBe('C')
		expect(getGrade(74)).toBe('C')
	})

	it('returns D for score 40-59', () => {
		expect(getGrade(40)).toBe('D')
		expect(getGrade(59)).toBe('D')
	})

	it('returns F for score < 40', () => {
		expect(getGrade(0)).toBe('F')
		expect(getGrade(39)).toBe('F')
	})
})

describe('countBySeverity', () => {
	const mockVulnerabilities: Partial<Vulnerability>[] = [
		{ severity: 'CRITICAL' },
		{ severity: 'CRITICAL' },
		{ severity: 'HIGH' },
		{ severity: 'LOW' },
	]

	it('counts vulnerabilities by severity correctly', () => {
		const counts = countBySeverity(mockVulnerabilities as Vulnerability[])
		expect(counts.CRITICAL).toBe(2)
		expect(counts.HIGH).toBe(1)
		expect(counts.LOW).toBe(1)
		expect(counts.MEDIUM).toBeUndefined()
	})

	it('returns empty object for no vulnerabilities', () => {
		const counts = countBySeverity([])
		expect(Object.keys(counts).length).toBe(0)
	})
})
