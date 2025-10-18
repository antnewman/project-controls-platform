import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '@/components/common/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders spinner', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders with default text', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Taking our time to get this right...')).toBeInTheDocument()
  })

  describe('size prop', () => {
    it('applies medium size by default', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner?.className).toContain('h-8')
      expect(spinner?.className).toContain('w-8')
    })

    it('applies small size', () => {
      const { container } = render(<LoadingSpinner size="sm" />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner?.className).toContain('h-4')
      expect(spinner?.className).toContain('w-4')
    })

    it('applies medium size explicitly', () => {
      const { container } = render(<LoadingSpinner size="md" />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner?.className).toContain('h-8')
      expect(spinner?.className).toContain('w-8')
    })

    it('applies large size', () => {
      const { container } = render(<LoadingSpinner size="lg" />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner?.className).toContain('h-12')
      expect(spinner?.className).toContain('w-12')
    })
  })

  describe('text prop', () => {
    it('shows custom text', () => {
      render(<LoadingSpinner text="Custom loading message" />)
      expect(screen.getByText('Custom loading message')).toBeInTheDocument()
    })

    it('shows different custom text', () => {
      render(<LoadingSpinner text="Please wait..." />)
      expect(screen.getByText('Please wait...')).toBeInTheDocument()
    })

    it('hides text when text prop is empty string', () => {
      render(<LoadingSpinner text="" />)
      expect(screen.queryByText('Taking our time to get this right...')).not.toBeInTheDocument()
    })

    it('hides text when text prop is undefined', () => {
      render(<LoadingSpinner text={undefined} />)
      const { container } = render(<LoadingSpinner text={undefined} />)
      const textElement = container.querySelector('.text-sm')
      expect(textElement).not.toBeInTheDocument()
    })

    it('renders text with correct styling', () => {
      const { container } = render(<LoadingSpinner text="Test" />)
      const textElement = screen.getByText('Test')
      expect(textElement.className).toContain('text-sm')
      expect(textElement.className).toContain('text-slate-600')
    })

    it('supports long text', () => {
      const longText = 'This is a very long loading message that explains what is happening in detail'
      render(<LoadingSpinner text={longText} />)
      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })

  describe('custom className', () => {
    it('applies custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('custom-class')
    })

    it('preserves base classes with custom className', () => {
      const { container } = render(<LoadingSpinner className="extra-padding" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('extra-padding')
      expect(wrapper.className).toContain('flex')
      expect(wrapper.className).toContain('flex-col')
    })

    it('works without custom className', () => {
      const { container } = render(<LoadingSpinner />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toBeInTheDocument()
      expect(wrapper.className).not.toContain('undefined')
    })

    it('handles multiple custom classes', () => {
      const { container } = render(<LoadingSpinner className="class-1 class-2" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('class-1')
      expect(wrapper.className).toContain('class-2')
    })
  })

  describe('layout and styling', () => {
    it('has flex column layout', () => {
      const { container } = render(<LoadingSpinner />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('flex')
      expect(wrapper.className).toContain('flex-col')
      expect(wrapper.className).toContain('items-center')
      expect(wrapper.className).toContain('justify-center')
    })

    it('has gap between spinner and text', () => {
      const { container } = render(<LoadingSpinner text="Test" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('gap-3')
    })

    it('spinner has primary color', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner?.className).toContain('text-primary-500')
    })

    it('spinner has spin animation', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner?.className).toContain('animate-spin')
    })
  })

  describe('combination of props', () => {
    it('works with all props together', () => {
      const { container } = render(
        <LoadingSpinner size="lg" text="Loading data..." className="my-loader" />
      )

      const wrapper = container.firstChild as HTMLElement
      const spinner = container.querySelector('.animate-spin')

      expect(wrapper.className).toContain('my-loader')
      expect(spinner?.className).toContain('h-12')
      expect(spinner?.className).toContain('w-12')
      expect(screen.getByText('Loading data...')).toBeInTheDocument()
    })

    it('small spinner with custom text', () => {
      const { container } = render(
        <LoadingSpinner size="sm" text="Processing..." />
      )

      const spinner = container.querySelector('.animate-spin')
      expect(spinner?.className).toContain('h-4')
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })

    it('large spinner with no text', () => {
      const { container } = render(
        <LoadingSpinner size="lg" text="" />
      )

      const spinner = container.querySelector('.animate-spin')
      expect(spinner?.className).toContain('h-12')
      expect(screen.queryByText('Taking our time to get this right...')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('is visible to screen readers', () => {
      render(<LoadingSpinner />)
      expect(screen.getByText('Taking our time to get this right...')).toBeInTheDocument()
    })

    it('provides loading context via text', () => {
      render(<LoadingSpinner text="Loading your dashboard" />)
      expect(screen.getByText('Loading your dashboard')).toBeInTheDocument()
    })

    it('renders semantic div structure', () => {
      const { container } = render(<LoadingSpinner />)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })
  })

  describe('real-world usage scenarios', () => {
    it('works as page loader', () => {
      const { container } = render(
        <LoadingSpinner size="lg" text="Loading application..." />
      )

      expect(container.querySelector('.animate-spin')).toBeInTheDocument()
      expect(screen.getByText('Loading application...')).toBeInTheDocument()
    })

    it('works as button loader', () => {
      const { container } = render(
        <LoadingSpinner size="sm" text="" />
      )

      const spinner = container.querySelector('.animate-spin')
      expect(spinner?.className).toContain('h-4')
    })

    it('works as content loader', () => {
      render(<LoadingSpinner text="Fetching data..." />)
      expect(screen.getByText('Fetching data...')).toBeInTheDocument()
    })

    it('works in centered layout', () => {
      const { container } = render(
        <LoadingSpinner className="min-h-screen" text="Initializing..." />
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('min-h-screen')
      expect(wrapper.className).toContain('justify-center')
    })
  })

  describe('visual consistency', () => {
    it('maintains consistent spacing', () => {
      const { container } = render(<LoadingSpinner text="Test" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('gap-3')
    })

    it('text has consistent styling across instances', () => {
      render(<LoadingSpinner text="First" />)
      render(<LoadingSpinner text="Second" />)

      const textElements = screen.getAllByText(/First|Second/)
      textElements.forEach(element => {
        expect(element.className).toContain('text-sm')
        expect(element.className).toContain('text-slate-600')
      })
    })
  })

  describe('edge cases', () => {
    it('handles very long text', () => {
      const longText = 'This is an extremely long loading message that goes on and on and provides excessive detail about what is happening behind the scenes during the loading process'
      render(<LoadingSpinner text={longText} />)
      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('handles special characters in text', () => {
      render(<LoadingSpinner text="Loading... 100% @#$" />)
      expect(screen.getByText('Loading... 100% @#$')).toBeInTheDocument()
    })

    it('handles Unicode characters in text', () => {
      render(<LoadingSpinner text="読み込み中... 🚀" />)
      expect(screen.getByText(/読み込み中/)).toBeInTheDocument()
    })

    it('handles null text gracefully', () => {
      const { container } = render(<LoadingSpinner text={null as any} />)
      expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    })
  })
})
