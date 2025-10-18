import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Alert from '@/components/common/Alert'

describe('Alert', () => {
  it('renders with message', () => {
    render(<Alert>Test message</Alert>)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('is visible by default', () => {
    render(<Alert>Visible alert</Alert>)
    expect(screen.getByText('Visible alert')).toBeInTheDocument()
  })

  describe('types/variants', () => {
    it('renders info type by default', () => {
      const { container } = render(<Alert>Info message</Alert>)
      const alert = screen.getByText('Info message').parentElement
      expect(alert?.className).toContain('bg-primary-50')
      expect(alert?.className).toContain('border-primary-200')
      expect(alert?.className).toContain('text-primary-800')
    })

    it('renders info type explicitly', () => {
      const { container } = render(<Alert type="info">Info message</Alert>)
      const alert = screen.getByText('Info message').parentElement
      expect(alert?.className).toContain('bg-primary-50')
    })

    it('renders success type', () => {
      const { container } = render(<Alert type="success">Success message</Alert>)
      const alert = screen.getByText('Success message').parentElement
      expect(alert?.className).toContain('bg-green-50')
      expect(alert?.className).toContain('border-green-200')
      expect(alert?.className).toContain('text-green-800')
    })

    it('renders error type', () => {
      const { container } = render(<Alert type="error">Error message</Alert>)
      const alert = screen.getByText('Error message').parentElement
      expect(alert?.className).toContain('bg-red-50')
      expect(alert?.className).toContain('border-red-200')
      expect(alert?.className).toContain('text-red-800')
    })

    it('renders warning type', () => {
      const { container } = render(<Alert type="warning">Warning message</Alert>)
      const alert = screen.getByText('Warning message').parentElement
      expect(alert?.className).toContain('bg-amber-50')
      expect(alert?.className).toContain('border-amber-200')
      expect(alert?.className).toContain('text-amber-800')
    })
  })

  describe('icons', () => {
    it('shows info icon for info type', () => {
      const { container } = render(<Alert type="info">Info</Alert>)
      // Check for SVG icon
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('shows success icon for success type', () => {
      const { container } = render(<Alert type="success">Success</Alert>)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('shows error icon for error type', () => {
      const { container } = render(<Alert type="error">Error</Alert>)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('shows warning icon for warning type', () => {
      const { container } = render(<Alert type="warning">Warning</Alert>)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('icon has correct size', () => {
      const { container } = render(<Alert>Test</Alert>)
      const icon = container.querySelector('svg')
      expect(icon?.className).toContain('h-5')
      expect(icon?.className).toContain('w-5')
    })

    it('icon is non-shrinking', () => {
      const { container } = render(<Alert>Test</Alert>)
      const iconWrapper = container.querySelector('.flex-shrink-0')
      expect(iconWrapper).toBeInTheDocument()
    })
  })

  describe('dismissible alerts', () => {
    it('shows close button when dismissible', () => {
      render(<Alert dismissible>Dismissible alert</Alert>)
      expect(screen.getByLabelText('Dismiss')).toBeInTheDocument()
    })

    it('does not show close button by default', () => {
      render(<Alert>Not dismissible</Alert>)
      expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument()
    })

    it('hides alert when close button clicked', async () => {
      render(<Alert dismissible>Dismissible alert</Alert>)

      expect(screen.getByText('Dismissible alert')).toBeInTheDocument()

      const closeButton = screen.getByLabelText('Dismiss')
      await userEvent.click(closeButton)

      expect(screen.queryByText('Dismissible alert')).not.toBeInTheDocument()
    })

    it('calls onDismiss callback when closed', async () => {
      const onDismiss = vi.fn()
      render(
        <Alert dismissible onDismiss={onDismiss}>
          Test
        </Alert>
      )

      const closeButton = screen.getByLabelText('Dismiss')
      await userEvent.click(closeButton)

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('returns null after dismissal', async () => {
      const { container } = render(<Alert dismissible>Test</Alert>)

      const closeButton = screen.getByLabelText('Dismiss')
      await userEvent.click(closeButton)

      expect(container.firstChild).toBeNull()
    })

    it('close button has X icon', () => {
      const { container } = render(<Alert dismissible>Test</Alert>)
      const closeButton = screen.getByLabelText('Dismiss')
      const icon = closeButton.querySelector('svg')
      expect(icon).toBeInTheDocument()
      expect(icon?.className).toContain('h-4')
      expect(icon?.className).toContain('w-4')
    })
  })

  describe('children content', () => {
    it('renders string children', () => {
      render(<Alert>Simple text</Alert>)
      expect(screen.getByText('Simple text')).toBeInTheDocument()
    })

    it('renders JSX children', () => {
      render(
        <Alert>
          <div>
            <strong>Bold</strong> and <em>italic</em>
          </div>
        </Alert>
      )
      expect(screen.getByText('Bold')).toBeInTheDocument()
      expect(screen.getByText('and')).toBeInTheDocument()
      expect(screen.getByText('italic')).toBeInTheDocument()
    })

    it('renders complex children', () => {
      render(
        <Alert>
          <h4>Title</h4>
          <p>Description</p>
          <button>Action</button>
        </Alert>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })

    it('children flex-grow to fill space', () => {
      const { container } = render(<Alert>Content</Alert>)
      const contentWrapper = screen.getByText('Content').parentElement
      expect(contentWrapper?.className).toContain('flex-1')
    })
  })

  describe('custom className', () => {
    it('applies custom className', () => {
      const { container } = render(<Alert className="custom-class">Test</Alert>)
      const alert = container.firstChild as HTMLElement
      expect(alert.className).toContain('custom-class')
    })

    it('preserves base classes', () => {
      const { container } = render(<Alert className="extra">Test</Alert>)
      const alert = container.firstChild as HTMLElement
      expect(alert.className).toContain('extra')
      expect(alert.className).toContain('border')
      expect(alert.className).toContain('rounded-lg')
    })

    it('works without custom className', () => {
      const { container } = render(<Alert>Test</Alert>)
      const alert = container.firstChild as HTMLElement
      expect(alert).toBeInTheDocument()
    })
  })

  describe('layout and styling', () => {
    it('has flex layout', () => {
      const { container } = render(<Alert>Test</Alert>)
      const alert = container.firstChild as HTMLElement
      expect(alert.className).toContain('flex')
      expect(alert.className).toContain('items-start')
    })

    it('has gap between elements', () => {
      const { container } = render(<Alert dismissible>Test</Alert>)
      const alert = container.firstChild as HTMLElement
      expect(alert.className).toContain('gap-3')
    })

    it('has padding', () => {
      const { container } = render(<Alert>Test</Alert>)
      const alert = container.firstChild as HTMLElement
      expect(alert.className).toContain('p-4')
    })

    it('has rounded corners', () => {
      const { container } = render(<Alert>Test</Alert>)
      const alert = container.firstChild as HTMLElement
      expect(alert.className).toContain('rounded-lg')
    })

    it('has border', () => {
      const { container } = render(<Alert>Test</Alert>)
      const alert = container.firstChild as HTMLElement
      expect(alert.className).toContain('border')
    })

    it('has transition animation', () => {
      const { container } = render(<Alert>Test</Alert>)
      const alert = container.firstChild as HTMLElement
      expect(alert.className).toContain('transition-all')
      expect(alert.className).toContain('duration-300')
    })
  })

  describe('onDismiss callback', () => {
    it('can be provided without dismissible prop', async () => {
      const onDismiss = vi.fn()
      render(<Alert onDismiss={onDismiss}>Test</Alert>)

      // onDismiss exists but close button doesn't
      expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument()
    })

    it('is optional for dismissible alerts', () => {
      render(<Alert dismissible>Test</Alert>)
      // Should render without error
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('handles undefined onDismiss gracefully', async () => {
      render(<Alert dismissible onDismiss={undefined}>Test</Alert>)

      const closeButton = screen.getByLabelText('Dismiss')
      await userEvent.click(closeButton)

      // Should dismiss without error
      expect(screen.queryByText('Test')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('dismiss button has aria-label', () => {
      render(<Alert dismissible>Test</Alert>)
      expect(screen.getByLabelText('Dismiss')).toBeInTheDocument()
    })

    it('dismiss button is keyboard accessible', () => {
      render(<Alert dismissible>Test</Alert>)
      const closeButton = screen.getByLabelText('Dismiss')

      closeButton.focus()
      expect(document.activeElement).toBe(closeButton)
    })

    it('renders as semantic div', () => {
      const { container } = render(<Alert>Test</Alert>)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    it('can use role prop if needed', () => {
      render(<Alert role="alert">Error message</Alert>)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  describe('combination of props', () => {
    it('handles all props together', () => {
      const onDismiss = vi.fn()
      const { container } = render(
        <Alert
          type="warning"
          dismissible
          onDismiss={onDismiss}
          className="custom-alert"
        >
          Warning content
        </Alert>
      )

      const alert = container.firstChild as HTMLElement
      expect(alert.className).toContain('bg-amber-50')
      expect(alert.className).toContain('custom-alert')
      expect(screen.getByText('Warning content')).toBeInTheDocument()
      expect(screen.getByLabelText('Dismiss')).toBeInTheDocument()
    })

    it('success alert with dismiss', async () => {
      const onDismiss = vi.fn()
      render(
        <Alert type="success" dismissible onDismiss={onDismiss}>
          Success!
        </Alert>
      )

      expect(screen.getByText('Success!')).toBeInTheDocument()

      const closeButton = screen.getByLabelText('Dismiss')
      await userEvent.click(closeButton)

      expect(onDismiss).toHaveBeenCalled()
      expect(screen.queryByText('Success!')).not.toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles very long messages', () => {
      const longMessage = 'This is a very long alert message that contains a lot of text and might wrap to multiple lines in the UI. '.repeat(5)
      render(<Alert>{longMessage}</Alert>)
      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })

    it('handles empty children', () => {
      const { container } = render(<Alert>{''}</Alert>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles special characters', () => {
      render(<Alert>Alert with @#$%^&* characters</Alert>)
      expect(screen.getByText(/Alert with/)).toBeInTheDocument()
    })

    it('handles Unicode characters', () => {
      render(<Alert>成功しました 🎉</Alert>)
      expect(screen.getByText(/成功しました/)).toBeInTheDocument()
    })

    it('maintains state across re-renders', () => {
      const { rerender } = render(<Alert>First</Alert>)
      expect(screen.getByText('First')).toBeInTheDocument()

      rerender(<Alert>Second</Alert>)
      expect(screen.getByText('Second')).toBeInTheDocument()
    })
  })

  describe('real-world usage', () => {
    it('works as form validation error', () => {
      render(
        <Alert type="error">
          <strong>Error:</strong> Please fill in all required fields
        </Alert>
      )

      expect(screen.getByText('Error:')).toBeInTheDocument()
      expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument()
    })

    it('works as success notification', () => {
      render(
        <Alert type="success" dismissible>
          Your changes have been saved successfully
        </Alert>
      )

      expect(screen.getByText('Your changes have been saved successfully')).toBeInTheDocument()
      expect(screen.getByLabelText('Dismiss')).toBeInTheDocument()
    })

    it('works as info banner', () => {
      render(
        <Alert type="info">
          <p>
            <strong>Notice:</strong> Maintenance scheduled for tomorrow
          </p>
        </Alert>
      )

      expect(screen.getByText('Notice:')).toBeInTheDocument()
      expect(screen.getByText('Maintenance scheduled for tomorrow')).toBeInTheDocument()
    })

    it('works as warning with action', () => {
      render(
        <Alert type="warning" dismissible>
          <div>
            <p>Your session will expire in 5 minutes</p>
            <button>Extend session</button>
          </div>
        </Alert>
      )

      expect(screen.getByText('Your session will expire in 5 minutes')).toBeInTheDocument()
      expect(screen.getByText('Extend session')).toBeInTheDocument()
    })
  })
})
