import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '@/components/common/Card'

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders as a div element', () => {
    render(<Card><div data-testid="content">Content</div></Card>)
    const card = screen.getByTestId('content').parentElement?.parentElement
    expect(card?.tagName).toBe('DIV')
  })

  describe('basic structure', () => {
    it('has base styling classes', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('bg-white')
      expect(card.className).toContain('rounded-xl')
      expect(card.className).toContain('shadow-md')
    })

    it('has main content wrapper with padding', () => {
      render(<Card><span data-testid="content">Test</span></Card>)
      const contentWrapper = screen.getByTestId('content').parentElement
      expect(contentWrapper?.className).toContain('p-6')
    })
  })

  describe('header', () => {
    it('renders header when provided', () => {
      render(
        <Card header={<h2>Card Header</h2>}>
          <p>Content</p>
        </Card>
      )
      expect(screen.getByText('Card Header')).toBeInTheDocument()
    })

    it('does not render header section when not provided', () => {
      const { container } = render(<Card>Content</Card>)
      const headerDiv = container.querySelector('.border-b')
      expect(headerDiv).not.toBeInTheDocument()
    })

    it('header has correct styling', () => {
      render(
        <Card header={<span data-testid="header">Header</span>}>
          Content
        </Card>
      )
      const headerWrapper = screen.getByTestId('header').parentElement
      expect(headerWrapper?.className).toContain('px-6')
      expect(headerWrapper?.className).toContain('py-4')
      expect(headerWrapper?.className).toContain('border-b')
      expect(headerWrapper?.className).toContain('border-slate-200')
    })

    it('renders string header', () => {
      render(<Card header="Simple Header">Content</Card>)
      expect(screen.getByText('Simple Header')).toBeInTheDocument()
    })

    it('renders JSX header', () => {
      render(
        <Card
          header={
            <div>
              <h3>Title</h3>
              <p>Subtitle</p>
            </div>
          }
        >
          Content
        </Card>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Subtitle')).toBeInTheDocument()
    })
  })

  describe('footer', () => {
    it('renders footer when provided', () => {
      render(
        <Card footer={<button>Action</button>}>
          <p>Content</p>
        </Card>
      )
      expect(screen.getByText('Action')).toBeInTheDocument()
    })

    it('does not render footer section when not provided', () => {
      const { container } = render(<Card>Content</Card>)
      const footerDiv = container.querySelector('.border-t')
      expect(footerDiv).not.toBeInTheDocument()
    })

    it('footer has correct styling', () => {
      render(
        <Card footer={<span data-testid="footer">Footer</span>}>
          Content
        </Card>
      )
      const footerWrapper = screen.getByTestId('footer').parentElement
      expect(footerWrapper?.className).toContain('px-6')
      expect(footerWrapper?.className).toContain('py-4')
      expect(footerWrapper?.className).toContain('border-t')
      expect(footerWrapper?.className).toContain('border-slate-200')
      expect(footerWrapper?.className).toContain('bg-slate-50')
    })

    it('renders string footer', () => {
      render(<Card footer="Simple Footer">Content</Card>)
      expect(screen.getByText('Simple Footer')).toBeInTheDocument()
    })

    it('renders JSX footer', () => {
      render(
        <Card
          footer={
            <div>
              <button>Cancel</button>
              <button>Save</button>
            </div>
          }
        >
          Content
        </Card>
      )
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })
  })

  describe('custom className', () => {
    it('applies custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('custom-class')
    })

    it('preserves base classes with custom className', () => {
      const { container } = render(<Card className="extra-padding">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('extra-padding')
      expect(card.className).toContain('bg-white')
      expect(card.className).toContain('rounded-xl')
    })

    it('works without custom className', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toBeInTheDocument()
      expect(card.className).not.toContain('undefined')
    })

    it('handles multiple custom classes', () => {
      const { container } = render(<Card className="class-1 class-2 class-3">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('class-1')
      expect(card.className).toContain('class-2')
      expect(card.className).toContain('class-3')
    })
  })

  describe('children content', () => {
    it('renders text content', () => {
      render(<Card>Simple text</Card>)
      expect(screen.getByText('Simple text')).toBeInTheDocument()
    })

    it('renders multiple children', () => {
      render(
        <Card>
          <h3>Title</h3>
          <p>Paragraph</p>
          <button>Button</button>
        </Card>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
      expect(screen.getByText('Button')).toBeInTheDocument()
    })

    it('renders nested components', () => {
      render(
        <Card>
          <div>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </Card>
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('renders empty content', () => {
      const { container } = render(<Card>{null}</Card>)
      expect(container.querySelector('.p-6')).toBeInTheDocument()
    })
  })

  describe('complete card structure', () => {
    it('renders all sections together', () => {
      render(
        <Card
          header={<h2>Header</h2>}
          footer={<button>Footer Button</button>}
        >
          <p>Main Content</p>
        </Card>
      )

      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Main Content')).toBeInTheDocument()
      expect(screen.getByText('Footer Button')).toBeInTheDocument()
    })

    it('maintains correct order: header, content, footer', () => {
      const { container } = render(
        <Card
          header={<span data-testid="header">H</span>}
          footer={<span data-testid="footer">F</span>}
        >
          <span data-testid="content">C</span>
        </Card>
      )

      const sections = Array.from(container.firstChild?.childNodes || [])
      const headerIndex = sections.findIndex(node =>
        (node as HTMLElement).querySelector?.('[data-testid="header"]')
      )
      const contentIndex = sections.findIndex(node =>
        (node as HTMLElement).querySelector?.('[data-testid="content"]')
      )
      const footerIndex = sections.findIndex(node =>
        (node as HTMLElement).querySelector?.('[data-testid="footer"]')
      )

      expect(headerIndex).toBeLessThan(contentIndex)
      expect(contentIndex).toBeLessThan(footerIndex)
    })

    it('works with only header and content', () => {
      render(
        <Card header={<h2>Header Only</h2>}>
          <p>Content</p>
        </Card>
      )

      expect(screen.getByText('Header Only')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()

      const { container } = render(
        <Card header={<h2>Test</h2>}>Content</Card>
      )
      expect(container.querySelector('.border-t')).not.toBeInTheDocument()
    })

    it('works with only content and footer', () => {
      render(
        <Card footer={<button>Footer Only</button>}>
          <p>Content</p>
        </Card>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByText('Footer Only')).toBeInTheDocument()

      const { container } = render(
        <Card footer={<span>Test</span>}>Content</Card>
      )
      expect(container.querySelector('.border-b')).not.toBeInTheDocument()
    })
  })

  describe('styling combinations', () => {
    it('applies custom class with header and footer', () => {
      const { container } = render(
        <Card
          className="custom-border"
          header="Header"
          footer="Footer"
        >
          Content
        </Card>
      )

      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('custom-border')
      expect(card.className).toContain('bg-white')
    })

    it('maintains responsiveness classes', () => {
      const { container } = render(
        <Card className="md:w-1/2 lg:w-1/3">
          Responsive content
        </Card>
      )

      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('md:w-1/2')
      expect(card.className).toContain('lg:w-1/3')
    })
  })

  describe('semantic HTML', () => {
    it('uses div as container', () => {
      const { container } = render(<Card>Test</Card>)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    it('allows semantic elements in slots', () => {
      render(
        <Card
          header={<header>Semantic Header</header>}
          footer={<footer>Semantic Footer</footer>}
        >
          <article>Semantic Content</article>
        </Card>
      )

      expect(screen.getByText('Semantic Header').tagName).toBe('HEADER')
      expect(screen.getByText('Semantic Content').tagName).toBe('ARTICLE')
      expect(screen.getByText('Semantic Footer').tagName).toBe('FOOTER')
    })
  })

  describe('edge cases', () => {
    it('handles very long content', () => {
      const longText = 'Lorem ipsum '.repeat(100)
      render(<Card>{longText}</Card>)
      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('handles special characters in content', () => {
      render(<Card>Special chars: @#$%^&*(){'<>?'}</Card>)
      expect(screen.getByText(/Special chars:/)).toBeInTheDocument()
    })

    it('handles zero/false values in children', () => {
      render(
        <Card>
          {0}
          {false}
          {null}
          Content
        </Card>
      )
      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('handles empty string className', () => {
      const { container } = render(<Card className="">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('bg-white')
    })
  })

  describe('real-world usage', () => {
    it('works as a form container', () => {
      render(
        <Card
          header={<h2>Login Form</h2>}
          footer={<button type="submit">Submit</button>}
        >
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
        </Card>
      )

      expect(screen.getByText('Login Form')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByText('Submit')).toBeInTheDocument()
    })

    it('works as a dashboard widget', () => {
      render(
        <Card
          header={
            <div>
              <h3>Statistics</h3>
              <span>Last 30 days</span>
            </div>
          }
        >
          <div>
            <p>Users: 1,234</p>
            <p>Revenue: $56,789</p>
          </div>
        </Card>
      )

      expect(screen.getByText('Statistics')).toBeInTheDocument()
      expect(screen.getByText('Last 30 days')).toBeInTheDocument()
      expect(screen.getByText('Users: 1,234')).toBeInTheDocument()
      expect(screen.getByText('Revenue: $56,789')).toBeInTheDocument()
    })
  })
})
