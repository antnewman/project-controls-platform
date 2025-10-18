import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useWBSGeneration } from '@/hooks/useWBSGeneration'
import type { WBSPhase } from '@/lib/types'
import * as anthropic from '@/lib/anthropic'

// Mock the anthropic module
vi.mock('@/lib/anthropic', () => ({
  generateWBS: vi.fn()
}))

describe('useWBSGeneration', () => {
  const mockWBS: WBSPhase[] = [
    {
      id: 'phase-1',
      name: 'Planning',
      activities: [
        {
          id: 'act-1-1',
          name: 'Requirements',
          duration: 2,
          unit: 'weeks',
          dependencies: [],
          resources: ['BA'],
          milestone: true,
          phase: 'phase-1'
        }
      ]
    },
    {
      id: 'phase-2',
      name: 'Development',
      activities: [
        {
          id: 'act-2-1',
          name: 'Coding',
          duration: 4,
          unit: 'weeks',
          dependencies: ['act-1-1'],
          milestone: false,
          phase: 'phase-2'
        }
      ]
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useWBSGeneration())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.wbs).toBeNull()
  })

  it('exposes all required functions', () => {
    const { result } = renderHook(() => useWBSGeneration())

    expect(typeof result.current.generate).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  describe('generate', () => {
    it('calls generateWBS with narrative', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        await result.current.generate('Build a web application')
      })

      expect(anthropic.generateWBS).toHaveBeenCalledWith('Build a web application', undefined)
    })

    it('calls generateWBS with narrative and template', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        await result.current.generate('Build app', 'agile')
      })

      expect(anthropic.generateWBS).toHaveBeenCalledWith('Build app', 'agile')
    })

    it('sets loading to true during generation', async () => {
      vi.mocked(anthropic.generateWBS).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockWBS), 100))
      )

      const { result } = renderHook(() => useWBSGeneration())

      act(() => {
        result.current.generate('Test narrative')
      })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })

    it('updates wbs state on success', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        await result.current.generate('Test narrative')
      })

      await waitFor(() => {
        expect(result.current.wbs).toEqual(mockWBS)
        expect(result.current.loading).toBe(false)
      })
    })

    it('returns the generated WBS', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      let returnedWBS: WBSPhase[] | null = null

      await act(async () => {
        returnedWBS = await result.current.generate('Test narrative')
      })

      expect(returnedWBS).toEqual(mockWBS)
    })

    it('clears error on successful generation', async () => {
      vi.mocked(anthropic.generateWBS)
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      // First call - should fail
      await act(async () => {
        try {
          await result.current.generate('Test')
        } catch (e) {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(result.current.error).not.toBeNull()
      })

      // Second call - should succeed and clear error
      await act(async () => {
        await result.current.generate('Test again')
      })

      await waitFor(() => {
        expect(result.current.error).toBeNull()
        expect(result.current.wbs).toEqual(mockWBS)
      })
    })

    it('sets error state on failure', async () => {
      vi.mocked(anthropic.generateWBS).mockRejectedValueOnce(new Error('API Error'))

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        try {
          await result.current.generate('Test narrative')
        } catch (e) {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(result.current.error).toBe('API Error')
        expect(result.current.loading).toBe(false)
      })
    })

    it('throws error on failure', async () => {
      const testError = new Error('Test error')
      vi.mocked(anthropic.generateWBS).mockRejectedValueOnce(testError)

      const { result } = renderHook(() => useWBSGeneration())

      await expect(
        act(async () => {
          await result.current.generate('Test narrative')
        })
      ).rejects.toThrow('Test error')
    })

    it('handles non-Error exceptions', async () => {
      vi.mocked(anthropic.generateWBS).mockRejectedValueOnce('String error')

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        try {
          await result.current.generate('Test')
        } catch (e) {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to generate WBS')
      })
    })

    it('sets loading to false even on error', async () => {
      vi.mocked(anthropic.generateWBS).mockRejectedValueOnce(new Error('Test'))

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        try {
          await result.current.generate('Test')
        } catch (e) {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })

    it('validates empty narrative', async () => {
      const { result } = renderHook(() => useWBSGeneration())

      const returnValue = await act(async () => {
        return await result.current.generate('')
      })

      expect(returnValue).toBeNull()
      expect(result.current.error).toBe('Please provide a project narrative')
      expect(anthropic.generateWBS).not.toHaveBeenCalled()
    })

    it('validates whitespace-only narrative', async () => {
      const { result } = renderHook(() => useWBSGeneration())

      const returnValue = await act(async () => {
        return await result.current.generate('   \n  \t  ')
      })

      expect(returnValue).toBeNull()
      expect(result.current.error).toBe('Please provide a project narrative')
      expect(anthropic.generateWBS).not.toHaveBeenCalled()
    })

    it('accepts narrative with leading/trailing whitespace', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        await result.current.generate('  Valid narrative  ')
      })

      expect(anthropic.generateWBS).toHaveBeenCalledWith('  Valid narrative  ', undefined)
    })

    it('handles multiple consecutive generations', async () => {
      const wbs1: WBSPhase[] = [{ id: '1', name: 'Phase 1', activities: [] }]
      const wbs2: WBSPhase[] = [{ id: '2', name: 'Phase 2', activities: [] }]

      vi.mocked(anthropic.generateWBS)
        .mockResolvedValueOnce(wbs1)
        .mockResolvedValueOnce(wbs2)

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        await result.current.generate('First')
      })

      expect(result.current.wbs).toEqual(wbs1)

      await act(async () => {
        await result.current.generate('Second')
      })

      expect(result.current.wbs).toEqual(wbs2)
    })

    it('handles very long narratives', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      const longNarrative = 'Build '.repeat(1000) + 'application'

      await act(async () => {
        await result.current.generate(longNarrative)
      })

      expect(anthropic.generateWBS).toHaveBeenCalledWith(longNarrative, undefined)
      expect(result.current.wbs).toEqual(mockWBS)
    })

    it('handles narratives with special characters', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      const specialNarrative = 'Build app with @#$% & "quotes" and \'apostrophes\''

      await act(async () => {
        await result.current.generate(specialNarrative)
      })

      expect(anthropic.generateWBS).toHaveBeenCalledWith(specialNarrative, undefined)
    })

    it('handles Unicode characters in narrative', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      const unicodeNarrative = 'Build 应用程序 with émojis 🚀'

      await act(async () => {
        await result.current.generate(unicodeNarrative)
      })

      expect(anthropic.generateWBS).toHaveBeenCalledWith(unicodeNarrative, undefined)
    })
  })

  describe('reset', () => {
    it('clears wbs state', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        await result.current.generate('Test')
      })

      expect(result.current.wbs).not.toBeNull()

      act(() => {
        result.current.reset()
      })

      expect(result.current.wbs).toBeNull()
    })

    it('clears error state', async () => {
      vi.mocked(anthropic.generateWBS).mockRejectedValueOnce(new Error('Test'))

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        try {
          await result.current.generate('Test')
        } catch (e) {
          // Expected
        }
      })

      await waitFor(() => {
        expect(result.current.error).not.toBeNull()
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.error).toBeNull()
    })

    it('resets all state to defaults', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        await result.current.generate('Test')
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.wbs).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.loading).toBe(false)
    })
  })

  describe('complete workflow', () => {
    it('follows the complete WBS generation workflow', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      // Initial state
      expect(result.current.wbs).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()

      // Generate WBS
      let returnedWBS: WBSPhase[] | null = null

      await act(async () => {
        returnedWBS = await result.current.generate('Build a project management system')
      })

      // Check results
      await waitFor(() => {
        expect(result.current.wbs).toEqual(mockWBS)
        expect(returnedWBS).toEqual(mockWBS)
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBeNull()
      })

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.wbs).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('handles error and retry workflow', async () => {
      vi.mocked(anthropic.generateWBS)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockWBS)

      const { result } = renderHook(() => useWBSGeneration())

      // First attempt - fails
      await act(async () => {
        try {
          await result.current.generate('Test')
        } catch (e) {
          // Expected
        }
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Network error')
        expect(result.current.wbs).toBeNull()
      })

      // Retry - succeeds
      await act(async () => {
        await result.current.generate('Test retry')
      })

      await waitFor(() => {
        expect(result.current.error).toBeNull()
        expect(result.current.wbs).toEqual(mockWBS)
      })
    })

    it('handles validation error workflow', async () => {
      const { result } = renderHook(() => useWBSGeneration())

      // Try with empty narrative
      await act(async () => {
        await result.current.generate('')
      })

      expect(result.current.error).toBe('Please provide a project narrative')

      // Try again with valid narrative
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce(mockWBS)

      await act(async () => {
        await result.current.generate('Valid narrative')
      })

      await waitFor(() => {
        expect(result.current.error).toBeNull()
        expect(result.current.wbs).toEqual(mockWBS)
      })
    })
  })

  describe('edge cases', () => {
    it('handles concurrent generation calls', async () => {
      const wbs1: WBSPhase[] = [{ id: '1', name: 'First', activities: [] }]
      const wbs2: WBSPhase[] = [{ id: '2', name: 'Second', activities: [] }]

      vi.mocked(anthropic.generateWBS)
        .mockImplementation((narrative) => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(narrative.includes('First') ? wbs1 : wbs2)
            }, narrative.includes('First') ? 100 : 50)
          })
        })

      const { result } = renderHook(() => useWBSGeneration())

      // Start two generations at once
      const promise1 = act(async () => {
        return await result.current.generate('First narrative')
      })

      const promise2 = act(async () => {
        return await result.current.generate('Second narrative')
      })

      await Promise.all([promise1, promise2])

      // The last one should win
      await waitFor(() => {
        expect(result.current.wbs).toEqual(wbs2)
      })
    })

    it('handles null/undefined in returned WBS', async () => {
      vi.mocked(anthropic.generateWBS).mockResolvedValueOnce([])

      const { result } = renderHook(() => useWBSGeneration())

      await act(async () => {
        await result.current.generate('Test')
      })

      expect(result.current.wbs).toEqual([])
    })
  })
})
