import { render, screen } from '@testing-library/react'
import SeverityBadge from '@/components/SeverityBadge'

describe('SeverityBadge', () => {
	it('renders CRITICAL badge', () => {
		render(<SeverityBadge severity='CRITICAL' />)
		expect(screen.getByText('CRITICAL')).toBeInTheDocument()
	})

	it('renders HIGH badge', () => {
		render(<SeverityBadge severity='HIGH' />)
		expect(screen.getByText('HIGH')).toBeInTheDocument()
	})

	it('renders with correct color class for CRITICAL', () => {
		const { container } = render(<SeverityBadge severity='CRITICAL' />)
		expect(container.firstChild).toHaveClass('bg-red-500')
	})

	it('renders with sm size', () => {
		const { container } = render(<SeverityBadge severity='LOW' size='sm' />)
		expect(container.firstChild).toHaveClass('px-2')
	})
})
