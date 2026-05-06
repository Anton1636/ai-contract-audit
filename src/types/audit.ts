//  Vulnerability severity levels
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'

// Individual vulnerability
export interface Vulnerability {
	id: number
	severity: Severity
	category: VulnerabilityCategory
	title: string
	description: string
	impact: string
	proofOfConcept: string
	lineNumber?: number
	codeSnippet?: string
	recommendation: string
	fixedCode?: string
	realWorldExample?: string
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
	score: number
	grade: 'A' | 'B' | 'C' | 'D' | 'F'
	summary: string
	contractName?: string
	scope?: string
	vulnerabilities: Vulnerability[]
	gasOptimizations: GasOptimization[]
	overallRecommendation: string
	auditedAt: string
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

export type VulnerabilityCategory =
	| 'Access Control'
	| 'Reentrancy'
	| 'Math Error'
	| 'Logic Error'
	| 'State Issue'
	| 'Oracle'
	| 'Missing Events'
	| 'Integration Risk'
	| 'Code Quality'

export interface ChatMessage {
	id: string
	role: 'user' | 'assistant'
	content: string
	timestamp: string
}

export interface ChatState {
	messages: ChatMessage[]
	isLoading: boolean
}
