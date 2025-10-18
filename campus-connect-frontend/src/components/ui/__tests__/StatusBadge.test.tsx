import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test/utils'
import StatusBadge from '../StatusBadge'

describe('StatusBadge', () => {
  describe('rendering', () => {
    it('renders pending status correctly', () => {
      render(<StatusBadge status="pending" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveTextContent('Pending')
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800', 'border-yellow-200')
      expect(badge).toHaveAttribute('aria-label', 'Issue status: Pending')
    })

    it('renders in-progress status correctly', () => {
      render(<StatusBadge status="in-progress" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toHaveTextContent('In Progress')
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'border-blue-200')
      expect(badge).toHaveAttribute('aria-label', 'Issue status: In Progress')
    })

    it('renders resolved status correctly', () => {
      render(<StatusBadge status="resolved" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toHaveTextContent('Resolved')
      expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'border-green-200')
      expect(badge).toHaveAttribute('aria-label', 'Issue status: Resolved')
    })
  })

  describe('size variants', () => {
    it('renders small size correctly', () => {
      render(<StatusBadge status="pending" size="sm" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toHaveClass('px-2', 'py-1', 'text-xs')
    })

    it('renders medium size correctly (default)', () => {
      render(<StatusBadge status="pending" size="md" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toHaveClass('px-3', 'py-1', 'text-sm')
    })

    it('renders large size correctly', () => {
      render(<StatusBadge status="pending" size="lg" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toHaveClass('px-4', 'py-2', 'text-base')
    })

    it('defaults to medium size when no size prop provided', () => {
      render(<StatusBadge status="pending" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toHaveClass('px-3', 'py-1', 'text-sm')
    })
  })

  describe('custom styling', () => {
    it('applies custom className', () => {
      render(<StatusBadge status="pending" className="custom-class" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toHaveClass('custom-class')
    })

    it('maintains base classes with custom className', () => {
      render(<StatusBadge status="resolved" className="custom-class" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toHaveClass('custom-class', 'bg-green-100', 'text-green-800')
    })
  })

  describe('accessibility', () => {
    it('has proper role attribute', () => {
      render(<StatusBadge status="pending" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toBeInTheDocument()
    })

    it('has descriptive aria-label', () => {
      render(<StatusBadge status="in-progress" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toHaveAttribute('aria-label', 'Issue status: In Progress')
    })

    it('includes screen reader text', () => {
      render(<StatusBadge status="resolved" />)
      
      expect(screen.getByText('Status:', { exact: false })).toHaveClass('sr-only')
    })
  })

  describe('edge cases', () => {
    it('handles invalid status gracefully', () => {
      // @ts-expect-error Testing invalid status
      render(<StatusBadge status="invalid" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-800', 'border-gray-200')
      expect(badge).toHaveTextContent('invalid')
    })

    it('handles invalid size gracefully', () => {
      // @ts-expect-error Testing invalid size
      render(<StatusBadge status="pending" size="invalid" />)
      
      const badge = screen.getByRole('status')
      expect(badge).toHaveClass('px-3', 'py-1', 'text-sm') // defaults to medium
    })
  })
})