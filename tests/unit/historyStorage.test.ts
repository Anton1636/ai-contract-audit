import {
	saveToHistory,
	getHistory,
	deleteFromHistory,
	clearHistory,
} from '@/lib/historyStorage'
import { AuditReport } from '@/types/audit'

const mockReport: AuditReport = {
	score: 75,
	grade: 'B',
	summary: 'Test summary',
	contractName: 'TestContract',
	vulnerabilities: [],
	gasOptimizations: [],
	overallRecommendation: 'Test recommendation',
	auditedAt: new Date().toISOString(),
}

const mockCode = 'pragma solidity ^0.8.0; contract Test {}'

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {}
	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value
		},
		removeItem: (key: string) => {
			delete store[key]
		},
		clear: () => {
			store = {}
		},
	}
})()

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
})

beforeEach(() => {
	localStorageMock.clear()
})

describe('historyStorage', () => {
	it('saves and retrieves audit from history', () => {
		saveToHistory(mockCode, mockReport)
		const history = getHistory()
		expect(history.length).toBe(1)
		expect(history[0].report.contractName).toBe('TestContract')
		expect(history[0].contractCode).toBe(mockCode)
	})

	it('adds new entries at the beginning', () => {
		saveToHistory(mockCode, { ...mockReport, contractName: 'First' })
		saveToHistory(mockCode, { ...mockReport, contractName: 'Second' })
		const history = getHistory()
		expect(history[0].report.contractName).toBe('Second')
		expect(history[1].report.contractName).toBe('First')
	})

	it('deletes entry by id', () => {
		const entry = saveToHistory(mockCode, mockReport)
		deleteFromHistory(entry.id)
		const history = getHistory()
		expect(history.length).toBe(0)
	})

	it('clears all history', () => {
		saveToHistory(mockCode, mockReport)
		saveToHistory(mockCode, mockReport)
		clearHistory()
		const history = getHistory()
		expect(history.length).toBe(0)
	})

	it('limits history to 20 entries', () => {
		for (let i = 0; i < 25; i++) {
			saveToHistory(mockCode, { ...mockReport, contractName: `Contract${i}` })
		}
		const history = getHistory()
		expect(history.length).toBe(20)
	})
})
