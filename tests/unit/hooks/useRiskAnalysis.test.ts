import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRiskAnalysis } from '@/hooks/useRiskAnalysis'
import type { Risk, Heuristic } from '@/lib/types'
import * as anthropic from '@/lib/anthropic'

// Mock the anthropic module
vi.mock('@/lib/anthropic', () => ({
  analyzeRisks: vi.fn()
}))

describe('useRiskAnalysis', () => {
  const mockRisks: Risk[] = [
    {
      id: 'R1',
      description: 'Test risk',
      mitigation: 'Test mitigation',
      probability: 3,
      impact: 4,
      category: 'Technical',
      owner: 'PM'
    }
  ]

  const mockHeuristics: Heuristic[] = [
    {
      id: 'h1',
      name: 'Test Heuristic',
      description: 'Test description',
      rule: 'Test rule',
      category: 'description'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useRiskAnalysis())

    expect(result.current.step).toBe(1)
    expect(result.current.risks).toEqual([])
    expect(result.current.selectedHeuristics).toEqual([])
    expect(result.current.results).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('exposes all required functions', () => {
    const { result } = renderHook(() => useRiskAnalysis())

    expect(typeof result.current.handleFileUpload).toBe('function')
    expect(typeof result.current.handleAnalyze).toBe('function')
    expect(typeof result.current.setSelectedHeuristics).toBe('function')
    expect(typeof result.current.setStep).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  describe('handleFileUpload', () => {
    it('updates risks and moves to step 2', () => {
      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.handleFileUpload(mockRisks)
      })

      expect(result.current.risks).toEqual(mockRisks)
      expect(result.current.step).toBe(2)
      expect(result.current.error).toBeNull()
    })

    it('clears previous errors', () => {
      const { result } = renderHook(() => useRiskAnalysis())

      // First, create an error state (by failing analysis)
      vi.mocked(anthropic.analyzeRisks).mockRejectedValueOnce(new Error('Test error'))

      act(() => {
        result.current.handleFileUpload(mockRisks)
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      // Try to analyze to create an error
      act(() => {
        result.current.handleAnalyze()
      })

      // Then upload a new file
      act(() => {
        result.current.handleFileUpload([])
      })

      expect(result.current.error).toBeNull()
    })

    it('handles empty risk array', () => {
      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.handleFileUpload([])
      })

      expect(result.current.risks).toEqual([])
      expect(result.current.step).toBe(2)
    })

    it('overwrites previous risks', () => {
      const { result } = renderHook(() => useRiskAnalysis())

      const firstRisks = [mockRisks[0]]
      const secondRisks = [
        { ...mockRisks[0], id: 'R2', description: 'Second risk' }
      ]

      act(() => {
        result.current.handleFileUpload(firstRisks)
      })

      expect(result.current.risks).toEqual(firstRisks)

      act(() => {
        result.current.handleFileUpload(secondRisks)
      })

      expect(result.current.risks).toEqual(secondRisks)
    })
  })

  describe('handleAnalyze', () => {
    it('calls analyzeRisks with correct parameters', async () => {
      const mockResult = {
        overallScore: 8,
        risks: mockRisks,
        summary: 'Good quality',
        recommendations: ['Rec 1', 'Rec 2']
      }

      vi.mocked(anthropic.analyzeRisks).mockResolvedValueOnce(mockResult)

      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.handleFileUpload(mockRisks)
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      await act(async () => {
        await result.current.handleAnalyze()
      })

      expect(anthropic.analyzeRisks).toHaveBeenCalledWith(mockRisks, mockHeuristics)
    })

    it('sets loading to true during analysis', async () => {
      vi.mocked(anthropic.analyzeRisks).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          overallScore: 8,
          risks: mockRisks,
          summary: 'Good',
          recommendations: []
        }), 100))
      )

      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.handleFileUpload(mockRisks)
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      act(() => {
        result.current.handleAnalyze()
      })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })

    it('updates results and moves to step 3 on success', async () => {
      const mockResult = {
        overallScore: 7,
        risks: mockRisks,
        summary: 'Analysis complete',
        recommendations: ['Test recommendation']
      }

      vi.mocked(anthropic.analyzeRisks).mockResolvedValueOnce(mockResult)

      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.handleFileUpload(mockRisks)
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      await act(async () => {
        await result.current.handleAnalyze()
      })

      await waitFor(() => {
        expect(result.current.results).toEqual(mockResult)
        expect(result.current.step).toBe(3)
        expect(result.current.loading).toBe(false)
      })
    })

    it('clears error on successful analysis', async () => {
      const mockResult = {
        overallScore: 7,
        risks: mockRisks,
        summary: 'Success',
        recommendations: []
      }

      vi.mocked(anthropic.analyzeRisks).mockResolvedValueOnce(mockResult)

      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.handleFileUpload(mockRisks)
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      await act(async () => {
        await result.current.handleAnalyze()
      })

      await waitFor(() => {
        expect(result.current.error).toBeNull()
      })
    })

    it('sets error state on failure', async () => {
      vi.mocked(anthropic.analyzeRisks).mockRejectedValueOnce(new Error('API Error'))

      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.handleFileUpload(mockRisks)
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      await act(async () => {
        await result.current.handleAnalyze()
      })

      await waitFor(() => {
        expect(result.current.error).toBe('API Error')
        expect(result.current.loading).toBe(false)
        expect(result.current.step).toBe(2) // Should not advance on error
      })
    })

    it('handles non-Error exceptions', async () => {
      vi.mocked(anthropic.analyzeRisks).mockRejectedValueOnce('String error')

      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.handleFileUpload(mockRisks)
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      await act(async () => {
        await result.current.handleAnalyze()
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Analysis failed')
        expect(result.current.loading).toBe(false)
      })
    })

    it('sets loading to false even on error', async () => {
      vi.mocked(anthropic.analyzeRisks).mockRejectedValueOnce(new Error('Test'))

      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.handleFileUpload(mockRisks)
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      await act(async () => {
        await result.current.handleAnalyze()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('setSelectedHeuristics', () => {
    it('updates selected heuristics', () => {
      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      expect(result.current.selectedHeuristics).toEqual(mockHeuristics)
    })

    it('can set empty array', () => {
      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      expect(result.current.selectedHeuristics).toEqual(mockHeuristics)

      act(() => {
        result.current.setSelectedHeuristics([])
      })

      expect(result.current.selectedHeuristics).toEqual([])
    })
  })

  describe('setStep', () => {
    it('manually changes step', () => {
      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.setStep(3)
      })

      expect(result.current.step).toBe(3)

      act(() => {
        result.current.setStep(1)
      })

      expect(result.current.step).toBe(1)
    })

    it('allows going back to previous steps', () => {
      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.handleFileUpload(mockRisks)
      })

      expect(result.current.step).toBe(2)

      act(() => {
        result.current.setStep(1)
      })

      expect(result.current.step).toBe(1)
    })
  })

  describe('reset', () => {
    it('resets all state to defaults', async () => {
      const mockResult = {
        overallScore: 8,
        risks: mockRisks,
        summary: 'Test',
        recommendations: []
      }

      vi.mocked(anthropic.analyzeRisks).mockResolvedValueOnce(mockResult)

      const { result } = renderHook(() => useRiskAnalysis())

      // Set up some state
      act(() => {
        result.current.handleFileUpload(mockRisks)
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      await act(async () => {
        await result.current.handleAnalyze()
      })

      await waitFor(() => {
        expect(result.current.step).toBe(3)
      })

      // Now reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.step).toBe(1)
      expect(result.current.risks).toEqual([])
      expect(result.current.selectedHeuristics).toEqual([])
      expect(result.current.results).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('clears error state', async () => {
      vi.mocked(anthropic.analyzeRisks).mockRejectedValueOnce(new Error('Test'))

      const { result } = renderHook(() => useRiskAnalysis())

      act(() => {
        result.current.handleFileUpload(mockRisks)
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      await act(async () => {
        await result.current.handleAnalyze()
      })

      await waitFor(() => {
        expect(result.current.error).not.toBeNull()
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('complete workflow', () => {
    it('follows the complete analysis workflow', async () => {
      const mockResult = {
        overallScore: 9,
        risks: mockRisks.map(r => ({ ...r, qualityScore: 9, suggestions: [] })),
        summary: 'Excellent',
        recommendations: ['Keep up the good work']
      }

      vi.mocked(anthropic.analyzeRisks).mockResolvedValueOnce(mockResult)

      const { result } = renderHook(() => useRiskAnalysis())

      // Step 1: Initial state
      expect(result.current.step).toBe(1)

      // Step 2: Upload risks
      act(() => {
        result.current.handleFileUpload(mockRisks)
      })

      expect(result.current.step).toBe(2)
      expect(result.current.risks).toEqual(mockRisks)

      // Step 3: Select heuristics
      act(() => {
        result.current.setSelectedHeuristics(mockHeuristics)
      })

      expect(result.current.selectedHeuristics).toEqual(mockHeuristics)

      // Step 4: Analyze
      await act(async () => {
        await result.current.handleAnalyze()
      })

      await waitFor(() => {
        expect(result.current.step).toBe(3)
        expect(result.current.results).toEqual(mockResult)
        expect(result.current.loading).toBe(false)
      })

      // Step 5: Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.step).toBe(1)
      expect(result.current.risks).toEqual([])
    })
  })
})
