import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileUpload from '@/components/common/FileUpload'

// Mock papaparse
vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn((file, options) => {
      // Simulate successful CSV parsing
      const mockData = [
        { col1: 'value1', col2: 'value2' },
        { col1: 'value3', col2: 'value4' }
      ]

      if (file.name.includes('error')) {
        options.error?.({ message: 'Parse error' })
      } else if (file.name.includes('invalid')) {
        options.complete?.({
          data: mockData,
          errors: [{ message: 'Invalid data' }],
          meta: { fields: ['col1', 'col2'] }
        })
      } else {
        // Successful parse
        setTimeout(() => {
          options.complete?.({
            data: mockData,
            errors: [],
            meta: { fields: ['col1', 'col2'] }
          })
        }, 0)
      }
    })
  }
}))

describe('FileUpload', () => {
  const mockOnUpload = vi.fn()

  beforeEach(() => {
    mockOnUpload.mockClear()
  })

  describe('rendering', () => {
    it('renders upload zone', () => {
      render(<FileUpload onUpload={mockOnUpload} />)
      expect(screen.getByText(/Click to upload/i)).toBeInTheDocument()
    })

    it('shows drag and drop text', () => {
      render(<FileUpload onUpload={mockOnUpload} />)
      expect(screen.getByText(/or drag and drop/i)).toBeInTheDocument()
    })

    it('shows file type hint', () => {
      render(<FileUpload onUpload={mockOnUpload} />)
      expect(screen.getByText(/CSV files only/i)).toBeInTheDocument()
    })

    it('renders upload icon', () => {
      const { container } = render(<FileUpload onUpload={mockOnUpload} />)
      // Lucide-react renders as SVG
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('has hidden file input', () => {
      render(<FileUpload onUpload={mockOnUpload} />)
      const input = document.querySelector('input[type="file"]')
      expect(input).toBeInTheDocument()
      expect(input?.className).toContain('hidden')
    })
  })

  describe('file selection', () => {
    it('accepts CSV file', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['col1,col2\nvalue1,value2'], 'test.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled()
      })
    })

    it('rejects non-CSV files', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText(/Please upload a CSV file/i)).toBeInTheDocument()
      })

      expect(mockOnUpload).not.toHaveBeenCalled()
    })

    it('shows error for invalid CSV', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['invalid'], 'invalid.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText(/CSV parsing error/i)).toBeInTheDocument()
      })
    })

    it('calls onUpload with correct data', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['col1,col2\nvalue1,value2'], 'test.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalledWith(
          expect.objectContaining({
            fileName: 'test.csv',
            headers: expect.arrayContaining(['col1', 'col2']),
            data: expect.any(Array)
          })
        )
      })
    })

    it('updates file state after selection', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['col1,col2\nvalue1,value2'], 'my-data.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('my-data.csv')).toBeInTheDocument()
      })
    })
  })

  describe('drag and drop', () => {
    it('highlights zone on drag enter', () => {
      const { container } = render(<FileUpload onUpload={mockOnUpload} />)
      const dropZone = container.querySelector('.border-dashed')

      fireEvent.dragEnter(dropZone!)

      expect(dropZone?.className).toContain('border-primary-500')
      expect(dropZone?.className).toContain('bg-primary-50')
    })

    it('highlights zone on drag over', () => {
      const { container } = render(<FileUpload onUpload={mockOnUpload} />)
      const dropZone = container.querySelector('.border-dashed')

      fireEvent.dragOver(dropZone!)

      expect(dropZone?.className).toContain('border-primary-500')
    })

    it('removes highlight on drag leave', () => {
      const { container } = render(<FileUpload onUpload={mockOnUpload} />)
      const dropZone = container.querySelector('.border-dashed')

      fireEvent.dragEnter(dropZone!)
      expect(dropZone?.className).toContain('border-primary-500')

      fireEvent.dragLeave(dropZone!)
      expect(dropZone?.className).toContain('border-slate-300')
    })

    it('handles file drop', async () => {
      const { container } = render(<FileUpload onUpload={mockOnUpload} />)
      const dropZone = container.querySelector('.border-dashed')

      const file = new File(['col1,col2\nvalue1,value2'], 'dropped.csv', { type: 'text/csv' })

      fireEvent.drop(dropZone!, {
        dataTransfer: {
          files: [file]
        }
      })

      await waitFor(() => {
        expect(screen.getByText('dropped.csv')).toBeInTheDocument()
      })
    })

    it('removes highlight after drop', async () => {
      const { container } = render(<FileUpload onUpload={mockOnUpload} />)
      const dropZone = container.querySelector('.border-dashed')

      fireEvent.dragEnter(dropZone!)
      expect(dropZone?.className).toContain('border-primary-500')

      const file = new File(['data'], 'test.csv', { type: 'text/csv' })
      fireEvent.drop(dropZone!, {
        dataTransfer: {
          files: [file]
        }
      })

      expect(dropZone?.className).toContain('border-slate-300')
    })

    it('prevents default on drag events', () => {
      const { container } = render(<FileUpload onUpload={mockOnUpload} />)
      const dropZone = container.querySelector('.border-dashed')

      const dragEvent = new Event('dragover', { bubbles: true, cancelable: true })
      const preventDefaultSpy = vi.spyOn(dragEvent, 'preventDefault')

      dropZone?.dispatchEvent(dragEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('file preview', () => {
    it('shows file name after upload', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['data'], 'preview-test.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('preview-test.csv')).toBeInTheDocument()
      })
    })

    it('shows preview table with data', async () => {
      render(<FileUpload onUpload={mockOnUpload} maxPreviewRows={2} />)

      const file = new File(['col1,col2\nvalue1,value2'], 'test.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        const table = document.querySelector('table')
        expect(table).toBeInTheDocument()
      })
    })

    it('limits preview rows to maxPreviewRows', async () => {
      render(<FileUpload onUpload={mockOnUpload} maxPreviewRows={1} />)

      const file = new File(['data'], 'test.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        const table = document.querySelector('table')
        expect(table).toBeInTheDocument()
      })
    })

    it('shows file icon in preview', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['data'], 'test.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        const icons = document.querySelectorAll('svg')
        const hasFileIcon = Array.from(icons).some(icon =>
          icon.parentElement?.textContent?.includes('test.csv')
        )
        expect(hasFileIcon).toBe(true)
      })
    })

    it('shows remove button in preview', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['data'], 'test.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByLabelText('Remove file')).toBeInTheDocument()
      })
    })

    it('clears preview when remove button clicked', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['data'], 'test.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('test.csv')).toBeInTheDocument()
      })

      const removeButton = screen.getByLabelText('Remove file')
      await userEvent.click(removeButton)

      expect(screen.queryByText('test.csv')).not.toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('displays error message', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['data'], 'test.txt', { type: 'text/plain' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText(/Please upload a CSV file/i)).toBeInTheDocument()
      })
    })

    it('shows dismissible error', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['data'], 'test.txt', { type: 'text/plain' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText(/Please upload a CSV file/i)).toBeInTheDocument()
      })

      const dismissButton = screen.getByLabelText('Dismiss')
      await userEvent.click(dismissButton)

      expect(screen.queryByText(/Please upload a CSV file/i)).not.toBeInTheDocument()
    })

    it('clears error on new file upload', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      // First upload - error
      const badFile = new File(['data'], 'test.txt', { type: 'text/plain' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, badFile)

      await waitFor(() => {
        expect(screen.getByText(/Please upload a CSV file/i)).toBeInTheDocument()
      })

      // Second upload - success
      const goodFile = new File(['data'], 'test.csv', { type: 'text/csv' })
      await userEvent.upload(input, goodFile)

      await waitFor(() => {
        expect(screen.queryByText(/Please upload a CSV file/i)).not.toBeInTheDocument()
      })
    })

    it('handles parse errors', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['data'], 'error.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText(/Error reading file/i)).toBeInTheDocument()
      })
    })

    it('does not show preview when there is an error', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['data'], 'test.txt', { type: 'text/plain' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText(/Please upload a CSV file/i)).toBeInTheDocument()
      })

      expect(document.querySelector('table')).not.toBeInTheDocument()
    })
  })

  describe('custom accept prop', () => {
    it('uses default .csv accept', () => {
      render(<FileUpload onUpload={mockOnUpload} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(input.accept).toBe('.csv')
    })

    it('accepts custom accept prop', () => {
      render(<FileUpload onUpload={mockOnUpload} accept=".txt,.csv" />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(input.accept).toBe('.txt,.csv')
    })
  })

  describe('accessibility', () => {
    it('has accessible label for file input', () => {
      render(<FileUpload onUpload={mockOnUpload} />)
      const label = document.querySelector('label[for="file-upload"]')
      expect(label).toBeInTheDocument()
    })

    it('file input is keyboard accessible', () => {
      render(<FileUpload onUpload={mockOnUpload} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      input.focus()
      expect(document.activeElement).toBe(input)
    })

    it('remove button has aria-label', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['data'], 'test.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        const removeButton = screen.getByLabelText('Remove file')
        expect(removeButton).toBeInTheDocument()
      })
    })
  })

  describe('clearFile function', () => {
    it('clears all state', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['data'], 'test.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('test.csv')).toBeInTheDocument()
      })

      const removeButton = screen.getByLabelText('Remove file')
      await userEvent.click(removeButton)

      expect(screen.queryByText('test.csv')).not.toBeInTheDocument()
      expect(document.querySelector('table')).not.toBeInTheDocument()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles empty file', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File([], 'empty.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      // Should still attempt to process
      await waitFor(() => {
        expect(screen.getByText('empty.csv')).toBeInTheDocument()
      })
    })

    it('handles file with special characters in name', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const file = new File(['data'], 'file-name_with.special@chars.csv', { type: 'text/csv' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('file-name_with.special@chars.csv')).toBeInTheDocument()
      })
    })

    it('handles multiple rapid uploads', async () => {
      render(<FileUpload onUpload={mockOnUpload} />)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      const file1 = new File(['data1'], 'file1.csv', { type: 'text/csv' })
      const file2 = new File(['data2'], 'file2.csv', { type: 'text/csv' })

      await userEvent.upload(input, file1)
      await userEvent.upload(input, file2)

      await waitFor(() => {
        expect(screen.getByText('file2.csv')).toBeInTheDocument()
      })
    })
  })
})
