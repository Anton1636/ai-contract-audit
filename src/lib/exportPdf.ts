import { pdf } from '@react-pdf/renderer'
import { AuditReport } from '@/types/audit'
import { createElement } from 'react'
import AuditPdfDocument from '@/components/AuditPdfDocument'
import type { ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'

export async function exportAuditToPdf(report: AuditReport): Promise<void> {
	const element = createElement(AuditPdfDocument, {
		report,
	}) as ReactElement<DocumentProps>

	const blob = await pdf(element).toBlob()

	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = `audit-${report.contractName || 'contract'}-${Date.now()}.pdf`
	link.click()
	URL.revokeObjectURL(url)
}
