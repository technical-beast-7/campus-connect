import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test/utils'
import Loader from '../Loader'

describe('Loader', () => {
  describe('rendering', () => {
    it('renders basic loader correctly', () => {
      render(<Loader />)
      
      const loader = screen.getByRole('status')
      expect(loader).toBeInTheDocument()
      expect(loader).toHaveAttribute('aria-label', 'Loading')
    })

    it('renders with custom text', () => {
      render(<Loader text="Loading data..." />)
      
      expect(screen.getByText('Loading data...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('renders without text when not provided', () => {
      render(<Loader />)
      
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
  })

  describe('size variants', () => {
    it('renders small size correctly', () => {
      render(<Loader size="sm" />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveClass('w-4', 'h-4')
    })

    it('renders medium size correctly (default)', () => {
      render(<Loader size="md" />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveClass('w-8', 'h-8')
    })

    it('renders large size correctly', () => {
      render(<Loader size="lg" />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveClass('w-12', 'h-12')
    })

    it('defaults to medium size when no size prop provided', () => {
      render(<Loader />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveClass('w-8', 'h-8')
    })
  })

  describe('text sizing', () => {
    it('applies correct text size for small loader', () => {
      render(<Loader size="sm" text="Loading..." />)
      
      const text = screen.getByText('Loading...')
      expect(text).toHaveClass('text-sm')
    })

    it('applies correct text size for medium loader', () => {
      render(<Loader size="md" text="Loading..." />)
      
      const text = screen.getByText('Loading...')
      expect(text).toHaveClass('text-base')
    })

    it('applies correct text size for large loader', () => {
      render(<Loader size="lg" text="Loading..." />)
      
      const text = screen.getByText('Loading...')
      expect(text).toHaveClass('text-lg')
    })
  })

  describe('fullScreen mode', () => {
    it('renders fullscreen overlay when fullScreen is true', () => {
      render(<Loader fullScreen text="Loading application..." />)
      
      const overlay = screen.getByText('Loading application...').closest('div')?.parentElement
      expect(overlay).toHaveClass('fixed', 'inset-0', 'bg-white', 'bg-opacity-90', 'z-50')
    })

    it('does not render overlay when fullScreen is false', () => {
      render(<Loader fullScreen={false} text="Loading..." />)
      
      const container = screen.getByText('Loading...').closest('div')?.parentElement
      expect(container).not.toHaveClass('fixed', 'inset-0')
    })

    it('defaults to non-fullscreen mode', () => {
      render(<Loader text="Loading..." />)
      
      const container = screen.getByText('Loading...').closest('div')?.parentElement
      expect(container).not.toHaveClass('fixed', 'inset-0')
    })
  })

  describe('custom styling', () => {
    it('applies custom className', () => {
      render(<Loader className="custom-loader" />)
      
      const container = screen.getByRole('status').closest('div')?.parentElement
      expect(container).toHaveClass('custom-loader')
    })

    it('maintains base classes with custom className', () => {
      render(<Loader className="custom-loader" />)
      
      const container = screen.getByRole('status').closest('div')?.parentElement
      expect(container).toHaveClass('custom-loader', 'flex', 'flex-col', 'items-center', 'justify-center')
    })
  })

  describe('spinner structure', () => {
    it('has proper spinner structure with inner dot', () => {
      render(<Loader />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveClass('border-4', 'border-gray-200', 'border-t-primary-600', 'rounded-full', 'animate-spin')
      
      // Check for inner dot (Campus Connect branding)
      const innerDot = spinner.nextElementSibling
      expect(innerDot).toHaveClass('bg-primary-600', 'rounded-full')
    })

    it('adjusts inner dot size based on loader size', () => {
      const { rerender } = render(<Loader size="sm" />)
      let spinner = screen.getByRole('status')
      let innerDot = spinner.nextElementSibling
      expect(innerDot).toHaveClass('w-1', 'h-1')

      rerender(<Loader size="md" />)
      spinner = screen.getByRole('status')
      innerDot = spinner.nextElementSibling
      expect(innerDot).toHaveClass('w-2', 'h-2')

      rerender(<Loader size="lg" />)
      spinner = screen.getByRole('status')
      innerDot = spinner.nextElementSibling
      expect(innerDot).toHaveClass('w-3', 'h-3')
    })
  })

  describe('accessibility', () => {
    it('has proper role and aria-label', () => {
      render(<Loader />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveAttribute('aria-label', 'Loading')
    })

    it('maintains accessibility in fullscreen mode', () => {
      render(<Loader fullScreen text="Loading application..." />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveAttribute('aria-label', 'Loading')
      expect(screen.getByText('Loading application...')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles invalid size gracefully', () => {
      // @ts-expect-error Testing invalid size
      render(<Loader size="invalid" />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveClass('w-8', 'h-8') // defaults to medium
    })

    it('handles empty text string', () => {
      render(<Loader text="" />)
      
      expect(screen.getByRole('status')).toBeInTheDocument()
      // Empty text should not render a paragraph element
      expect(screen.queryByText('', { selector: 'p' })).not.toBeInTheDocument()
    })

    it('handles whitespace-only text', () => {
      render(<Loader text="   " />)
      
      expect(screen.getByRole('status')).toBeInTheDocument()
      // Should render the whitespace text as provided
      const textElement = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' && content === '   '
      })
      expect(textElement).toBeInTheDocument()
    })
  })
})