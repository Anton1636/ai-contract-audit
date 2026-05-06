import { AuditReport } from '@/types/audit'

const STORAGE_KEY = 'audit_history'
const MAX_HISTORY = 20

export interface HistoryEntry {
	id: string
	contractCode: string
	report: AuditReport
	savedAt: string
}

export function saveToHistory(
	contractCode: string,
	report: AuditReport,
): HistoryEntry {
	const entry: HistoryEntry = {
		id: `audit_${Date.now()}`,
		contractCode,
		report,
		savedAt: new Date().toISOString(),
	}

	const history = getHistory()
	const updated = [entry, ...history].slice(0, MAX_HISTORY)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
	return entry
}

export function getHistory(): HistoryEntry[] {
	if (typeof window === 'undefined') return []
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		return raw ? JSON.parse(raw) : []
	} catch {
		return []
	}
}

export function deleteFromHistory(id: string): void {
	const history = getHistory().filter(e => e.id !== id)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function clearHistory(): void {
	localStorage.removeItem(STORAGE_KEY)
}
