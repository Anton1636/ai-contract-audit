//  Vulnerability severity levels
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'

// Individual vulnerability
export interface Vulnerability {
	id: number
	severity: Severity
	title: string
	description: string
	lineNumber?: number
	codeSnippet?: string
	recommendation: string
	fixedCode?: string
	realWorldExample?: string // link to a real-world hack
}

// Gas optimization
export interface GasOptimization {
	id: number
	title: string
	description: string
	lineNumber?: number
	estimatedSaving: string // for example "~20000 gas per call"
	fixedCode?: string
}

// Full audit report
export interface AuditReport {
	score: number // 0-100
	grade: 'A' | 'B' | 'C' | 'D' | 'F'
	summary: string
	contractName?: string
	vulnerabilities: Vulnerability[]
	gasOptimizations: GasOptimization[]
	overallRecommendation: string
	auditedAt: string // ISO date
}

// Report status
export type AuditStatus = 'idle' | 'loading' | 'success' | 'error'

// Request to API
export interface AuditRequest {
	code: string
}

// Response from API
export interface AuditResponse {
	success: boolean
	data?: AuditReport
	error?: string
}
