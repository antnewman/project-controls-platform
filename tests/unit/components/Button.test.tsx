import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@/components/common/Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders as a button element', () => {
    render(<Button>Test</Button>)
    const button = screen.getByText('Test')
    expect(button.tagName).toBe('BUTTON')
  })

  describe('click events', () => {
    it('handles click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)

      fireEvent.click(screen.getByText('Click'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('calls onClick with event', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)

      fireEvent.click(screen.getByText('Click'))
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object))
    })

    it('handles multiple clicks', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)

      const button = screen.getByText('Click')
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('disabled state', () => {
    it('prevents clicks when disabled', () => {
      const handleClick = vi.fn()
      render(<Button disabled onClick={handleClick}>Disabled</Button>)

      fireEvent.click(screen.getByText('Disabled'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('applies disabled styling', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByText('Disabled')
      expect(button).toBeDisabled()
      expect(button.className).toContain('disabled:opacity-50')
      expect(button.className).toContain('disabled:cursor-not-allowed')
    })

    it('is not disabled by default', () => {
      render(<Button>Enabled</Button>)
      expect(screen.getByText('Enabled')).not.toBeDisabled()
    })
  })

  describe('loading state', () => {
    it('shows spinner when loading', () => {
      render(<Button loading>Loading</Button>)
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('prevents clicks when loading', () => {
      const handleClick = vi.fn()
      render(<Button loading onClick={handleClick}>Loading</Button>)

      fireEvent.click(screen.getByText('Loading'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('disables button when loading', () => {
      render(<Button loading>Loading</Button>)
      expect(screen.getByText('Loading')).toBeDisabled()
    })

    it('shows text alongside spinner', () => {
      render(<Button loading>Please wait</Button>)
      expect(screen.getByText('Please wait')).toBeInTheDocument()
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('does not show spinner when not loading', () => {
      render(<Button>Normal</Button>)
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument()
    })
  })

  describe('variants', () => {
    it('applies primary variant by default', () => {
      render(<Button>Primary</Button>)
      const button = screen.getByText('Primary')
      expect(button.className).toContain('bg-primary-500')
    })

    it('applies primary variant explicitly', () => {
      render(<Button variant="primary">Primary</Button>)
      const button = screen.getByText('Primary')
      expect(button.className).toContain('bg-primary-500')
      expect(button.className).toContain('text-white')
    })

    it('applies secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByText('Secondary')
      expect(button.className).toContain('border-2')
      expect(button.className).toContain('border-primary-500')
      expect(button.className).toContain('text-primary-500')
    })

    it('applies outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByText('Outline')
      expect(button.className).toContain('border-2')
      expect(button.className).toContain('border-slate-300')
    })

    it('applies ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByText('Ghost')
      expect(button.className).toContain('text-slate-700')
      expect(button.className).toContain('hover:bg-slate-100')
    })
  })

  describe('sizes', () => {
    it('applies medium size by default', () => {
      render(<Button>Medium</Button>)
      const button = screen.getByText('Medium')
      expect(button.className).toContain('px-6')
      expect(button.className).toContain('py-3')
    })

    it('applies small size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByText('Small')
      expect(button.className).toContain('px-4')
      expect(button.className).toContain('py-2')
      expect(button.className).toContain('text-sm')
    })

    it('applies medium size explicitly', () => {
      render(<Button size="md">Medium</Button>)
      const button = screen.getByText('Medium')
      expect(button.className).toContain('px-6')
      expect(button.className).toContain('py-3')
      expect(button.className).toContain('text-base')
    })

    it('applies large size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByText('Large')
      expect(button.className).toContain('px-8')
      expect(button.className).toContain('py-4')
      expect(button.className).toContain('text-lg')
    })
  })

  describe('custom className', () => {
    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByText('Custom')
      expect(button.className).toContain('custom-class')
    })

    it('preserves base classes with custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByText('Custom')
      expect(button.className).toContain('custom-class')
      expect(button.className).toContain('inline-flex')
      expect(button.className).toContain('items-center')
    })

    it('works without custom className', () => {
      render(<Button>No Custom</Button>)
      expect(screen.getByText('No Custom')).toBeInTheDocument()
    })
  })

  describe('base styles', () => {
    it('includes base transition classes', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')
      expect(button.className).toContain('transition-all')
      expect(button.className).toContain('duration-200')
    })

    it('includes flex layout classes', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')
      expect(button.className).toContain('inline-flex')
      expect(button.className).toContain('items-center')
      expect(button.className).toContain('justify-center')
    })

    it('includes rounded corners', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')
      expect(button.className).toContain('rounded-lg')
    })
  })

  describe('children', () => {
    it('renders string children', () => {
      render(<Button>Text</Button>)
      expect(screen.getByText('Text')).toBeInTheDocument()
    })

    it('renders JSX children', () => {
      render(
        <Button>
          <span data-testid="icon">Icon</span>
          <span>Text</span>
        </Button>
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })

    it('renders multiple children', () => {
      render(
        <Button>
          <span>First</span>
          <span>Second</span>
        </Button>
      )
      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
    })
  })

  describe('HTML attributes', () => {
    it('accepts type attribute', () => {
      render(<Button type="submit">Submit</Button>)
      const button = screen.getByText('Submit')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('accepts aria-label', () => {
      render(<Button aria-label="Close">X</Button>)
      expect(screen.getByLabelText('Close')).toBeInTheDocument()
    })

    it('accepts data attributes', () => {
      render(<Button data-testid="my-button">Test</Button>)
      expect(screen.getByTestId('my-button')).toBeInTheDocument()
    })

    it('accepts id attribute', () => {
      render(<Button id="my-id">Test</Button>)
      expect(document.getElementById('my-id')).toBeInTheDocument()
    })

    it('forwards other HTML attributes', () => {
      render(<Button title="Tooltip text">Test</Button>)
      expect(screen.getByText('Test')).toHaveAttribute('title', 'Tooltip text')
    })
  })

  describe('accessibility', () => {
    it('is keyboard accessible', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)

      const button = screen.getByText('Click')
      button.focus()
      expect(button).toHaveFocus()
    })

    it('has button role implicitly', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')
      expect(button.tagName).toBe('BUTTON')
    })

    it('shows disabled state to screen readers', () => {
      render(<Button disabled>Disabled</Button>)
      expect(screen.getByText('Disabled')).toBeDisabled()
    })
  })

  describe('combination of props', () => {
    it('handles variant and size together', () => {
      render(<Button variant="secondary" size="lg">Large Secondary</Button>)
      const button = screen.getByText('Large Secondary')
      expect(button.className).toContain('border-primary-500')
      expect(button.className).toContain('px-8')
      expect(button.className).toContain('py-4')
    })

    it('handles disabled and loading together', () => {
      render(<Button disabled loading>Disabled Loading</Button>)
      const button = screen.getByText('Disabled Loading')
      expect(button).toBeDisabled()
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('handles all props together', () => {
      const handleClick = vi.fn()
      render(
        <Button
          variant="outline"
          size="sm"
          loading
          onClick={handleClick}
          className="extra-class"
        >
          Complex
        </Button>
      )

      const button = screen.getByText('Complex')
      expect(button.className).toContain('border-slate-300')
      expect(button.className).toContain('text-sm')
      expect(button.className).toContain('extra-class')
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()

      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled() // disabled by loading
    })
  })
})
