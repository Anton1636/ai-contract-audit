import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { AuditReport } from '@/types/audit'

const styles = StyleSheet.create({
	page: {
		backgroundColor: '#111827',
		padding: 30,
		fontFamily: 'Helvetica',
	},
	// Header
	header: {
		backgroundColor: '#10b981',
		borderRadius: 6,
		padding: '10 14',
		marginBottom: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 13,
		fontFamily: 'Helvetica-Bold',
		color: '#111827',
	},
	headerSub: {
		fontSize: 8,
		color: '#064e3b',
	},
	// Meta
	metaText: {
		fontSize: 8,
		color: '#9ca3af',
		marginBottom: 3,
	},
	contractName: {
		fontSize: 13,
		fontFamily: 'Helvetica-Bold',
		color: '#ffffff',
		marginBottom: 4,
	},
	// Score box
	scoreBox: {
		backgroundColor: '#1f2937',
		borderRadius: 6,
		padding: 14,
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 12,
		marginBottom: 16,
		gap: 20,
	},
	scoreNumber: {
		fontSize: 36,
		fontFamily: 'Helvetica-Bold',
	},
	scoreLabel: {
		fontSize: 8,
		color: '#9ca3af',
		marginTop: 2,
	},
	grade: {
		fontSize: 42,
		fontFamily: 'Helvetica-Bold',
	},
	// Badges
	badgesRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
		marginLeft: 'auto',
	},
	badge: {
		borderRadius: 10,
		padding: '3 8',
	},
	badgeText: {
		fontSize: 7,
		fontFamily: 'Helvetica-Bold',
		color: '#ffffff',
	},
	// Section
	sectionTitle: {
		fontSize: 10,
		fontFamily: 'Helvetica-Bold',
		marginBottom: 4,
		marginTop: 14,
		paddingBottom: 3,
		borderBottomWidth: 1,
	},
	// Summary
	summaryText: {
		fontSize: 9,
		color: '#d1d5db',
		lineHeight: 1.6,
	},
	// Vuln card
	vulnCard: {
		borderRadius: 5,
		borderWidth: 1,
		marginBottom: 10,
		overflow: 'hidden',
	},
	vulnHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: '7 10',
		gap: 8,
	},
	vulnSeverityBadge: {
		borderRadius: 3,
		padding: '2 6',
	},
	vulnSeverityText: {
		fontSize: 7,
		fontFamily: 'Helvetica-Bold',
		color: '#ffffff',
	},
	vulnTitle: {
		fontSize: 9,
		fontFamily: 'Helvetica-Bold',
		color: '#ffffff',
		flex: 1,
	},
	vulnLine: {
		fontSize: 7,
		color: '#6b7280',
	},
	vulnBody: {
		padding: '8 10',
		borderTopWidth: 1,
		borderTopColor: '#374151',
	},
	vulnLabel: {
		fontSize: 7,
		fontFamily: 'Helvetica-Bold',
		color: '#6b7280',
		marginBottom: 2,
		letterSpacing: 0.5,
	},
	vulnText: {
		fontSize: 8,
		color: '#d1d5db',
		lineHeight: 1.5,
		marginBottom: 8,
	},
	vulnImpact: {
		fontSize: 8,
		color: '#fdba74',
		lineHeight: 1.5,
		marginBottom: 8,
	},
	codeBlock: {
		backgroundColor: '#030712',
		borderRadius: 4,
		padding: 8,
		marginBottom: 8,
		borderWidth: 1,
	},
	codeText: {
		fontSize: 7,
		fontFamily: 'Courier',
		lineHeight: 1.4,
	},
	realWorldBox: {
		backgroundColor: '#422006',
		borderRadius: 4,
		padding: '6 8',
		borderWidth: 1,
		borderColor: '#92400e',
	},
	realWorldText: {
		fontSize: 7,
		color: '#fde68a',
		lineHeight: 1.4,
	},
	// Gas
	gasCard: {
		backgroundColor: '#1f2937',
		borderRadius: 5,
		padding: 10,
		marginBottom: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	gasTitle: {
		fontSize: 9,
		fontFamily: 'Helvetica-Bold',
		color: '#ffffff',
		marginBottom: 3,
	},
	gasSaving: {
		fontSize: 7,
		color: '#34d399',
		fontFamily: 'Helvetica-Bold',
	},
	gasText: {
		fontSize: 8,
		color: '#9ca3af',
		lineHeight: 1.4,
	},
	// Overall rec
	recBox: {
		backgroundColor: '#1e3a5f',
		borderRadius: 5,
		padding: 12,
		marginTop: 14,
		borderWidth: 1,
		borderColor: '#1d4ed8',
	},
	recTitle: {
		fontSize: 10,
		fontFamily: 'Helvetica-Bold',
		color: '#93c5fd',
		marginBottom: 5,
	},
	recText: {
		fontSize: 8,
		color: '#d1d5db',
		lineHeight: 1.6,
	},
	// Footer
	footer: {
		position: 'absolute',
		bottom: 20,
		left: 30,
		right: 30,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	footerText: {
		fontSize: 7,
		color: '#4b5563',
	},
})

const severityColors = {
	CRITICAL: { bg: '#ef4444', border: '#b91c1c', cardBg: '#1a0505' },
	HIGH: { bg: '#f97316', border: '#c2410c', cardBg: '#1a0a05' },
	MEDIUM: { bg: '#eab308', border: '#a16207', cardBg: '#1a1505' },
	LOW: { bg: '#3b82f6', border: '#1d4ed8', cardBg: '#05101a' },
	INFO: { bg: '#6b7280', border: '#4b5563', cardBg: '#111827' },
}

const scoreColor = (score: number) =>
	score >= 80
		? '#10b981'
		: score >= 60
			? '#f59e0b'
			: score >= 40
				? '#f97316'
				: '#ef4444'

interface AuditPdfDocumentProps {
	report: AuditReport
}

export default function AuditPdfDocument({ report }: AuditPdfDocumentProps) {
	const counts: Record<string, number> = {}
	report.vulnerabilities.forEach(v => {
		counts[v.severity] = (counts[v.severity] || 0) + 1
	})

	return (
		<Document
			title={`Audit Report — ${report.contractName}`}
			author='AI Contract Auditor'
			subject='Smart Contract Security Report'
		>
			<Page size='A4' style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.headerTitle}>
						AI CONTRACT AUDITOR — SECURITY REPORT
					</Text>
					<Text style={styles.headerSub}>
						github.com/Anton1636/ai-contract-audit
					</Text>
				</View>

				{/* Contract meta */}
				<Text style={styles.contractName}>
					{report.contractName || 'Unknown Contract'}
				</Text>
				<Text style={styles.metaText}>
					Audited:{' '}
					{new Date(report.auditedAt).toLocaleString('en-GB', {
						dateStyle: 'long',
						timeStyle: 'short',
					})}
				</Text>
				{report.scope && (
					<Text style={styles.metaText}>Scope: {report.scope}</Text>
				)}

				{/* Score Box */}
				<View style={styles.scoreBox}>
					<View>
						<Text
							style={[styles.scoreNumber, { color: scoreColor(report.score) }]}
						>
							{report.score}
						</Text>
						<Text style={styles.scoreLabel}>/ 100</Text>
					</View>
					<View>
						<Text style={[styles.grade, { color: scoreColor(report.score) }]}>
							{report.grade}
						</Text>
						<Text style={styles.scoreLabel}>Security Grade</Text>
					</View>
					<View style={styles.badgesRow}>
						{Object.entries(counts).map(([sev, count]) => {
							const col = severityColors[sev as keyof typeof severityColors]
							return (
								<View
									key={sev}
									style={[
										styles.badge,
										{ backgroundColor: col?.bg || '#6b7280' },
									]}
								>
									<Text style={styles.badgeText}>
										{sev} x{count}
									</Text>
								</View>
							)
						})}
					</View>
				</View>

				{/* Summary */}
				<Text
					style={[
						styles.sectionTitle,
						{ color: '#10b981', borderBottomColor: '#10b981' },
					]}
				>
					EXECUTIVE SUMMARY
				</Text>
				<Text style={styles.summaryText}>{report.summary}</Text>

				{/* Vulnerabilities */}
				{report.vulnerabilities.length > 0 && (
					<>
						<Text
							style={[
								styles.sectionTitle,
								{ color: '#ef4444', borderBottomColor: '#ef4444' },
							]}
						>
							VULNERABILITIES ({report.vulnerabilities.length})
						</Text>
						{report.vulnerabilities.map((vuln, i) => {
							const col = severityColors[vuln.severity] || severityColors.INFO
							return (
								<View
									key={vuln.id}
									style={[
										styles.vulnCard,
										{
											borderColor: col.border,
											backgroundColor: col.cardBg,
										},
									]}
								>
									{/* Vuln Header */}
									<View style={styles.vulnHeader}>
										<View
											style={[
												styles.vulnSeverityBadge,
												{ backgroundColor: col.bg },
											]}
										>
											<Text style={styles.vulnSeverityText}>
												{vuln.severity}
											</Text>
										</View>
										<Text style={styles.vulnTitle}>
											#{String(i + 1).padStart(2, '0')} {vuln.title}
										</Text>
										{vuln.lineNumber && (
											<Text style={styles.vulnLine}>
												Line {vuln.lineNumber}
											</Text>
										)}
									</View>

									{/* Vuln Body */}
									<View style={styles.vulnBody}>
										<Text style={styles.vulnLabel}>DESCRIPTION</Text>
										<Text style={styles.vulnText}>{vuln.description}</Text>

										{vuln.impact && vuln.impact !== 'N/A' && (
											<>
												<Text style={styles.vulnLabel}>IMPACT</Text>
												<Text style={styles.vulnImpact}>{vuln.impact}</Text>
											</>
										)}

										{vuln.codeSnippet && vuln.codeSnippet !== 'N/A' && (
											<>
												<Text style={styles.vulnLabel}>VULNERABLE CODE</Text>
												<View
													style={[styles.codeBlock, { borderColor: '#b91c1c' }]}
												>
													<Text style={[styles.codeText, { color: '#fca5a5' }]}>
														{vuln.codeSnippet}
													</Text>
												</View>
											</>
										)}

										{vuln.fixedCode && vuln.fixedCode !== 'N/A' && (
											<>
												<Text style={styles.vulnLabel}>FIXED CODE</Text>
												<View
													style={[styles.codeBlock, { borderColor: '#065f46' }]}
												>
													<Text style={[styles.codeText, { color: '#6ee7b7' }]}>
														{vuln.fixedCode}
													</Text>
												</View>
											</>
										)}

										<Text style={styles.vulnLabel}>RECOMMENDATION</Text>
										<Text style={styles.vulnText}>{vuln.recommendation}</Text>

										{vuln.realWorldExample &&
											vuln.realWorldExample !== 'N/A' && (
												<View style={styles.realWorldBox}>
													<Text style={styles.realWorldText}>
														Real World: {vuln.realWorldExample}
													</Text>
												</View>
											)}
									</View>
								</View>
							)
						})}
					</>
				)}

				{/* Gas Optimizations */}
				{report.gasOptimizations.length > 0 && (
					<>
						<Text
							style={[
								styles.sectionTitle,
								{ color: '#34d399', borderBottomColor: '#34d399' },
							]}
						>
							GAS OPTIMIZATIONS ({report.gasOptimizations.length})
						</Text>
						{report.gasOptimizations.map(opt => (
							<View key={opt.id} style={styles.gasCard}>
								<View style={{ flex: 1 }}>
									<Text style={styles.gasTitle}>{opt.title}</Text>
									<Text style={styles.gasText}>{opt.description}</Text>
								</View>
								<Text style={styles.gasSaving}>{opt.estimatedSaving}</Text>
							</View>
						))}
					</>
				)}

				{/* Overall Recommendation */}
				<View style={styles.recBox}>
					<Text style={styles.recTitle}>OVERALL RECOMMENDATION</Text>
					<Text style={styles.recText}>{report.overallRecommendation}</Text>
				</View>

				{/* Footer */}
				<View style={styles.footer}>
					<Text style={styles.footerText}>
						Generated by AI Contract Auditor
					</Text>
					<Text style={styles.footerText}>
						{new Date(report.auditedAt).toLocaleDateString('en-GB')}
					</Text>
				</View>
			</Page>
		</Document>
	)
}
