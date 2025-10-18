import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import type { Risk, WBSPhase, WBSActivity, Heuristic, AnalysisResult } from '@/lib/types'

interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data generators
export const createMockRisk = (overrides: Partial<Risk> = {}): Risk => ({
  id: 'R1',
  description: 'Test risk description',
  mitigation: 'Test mitigation strategy',
  probability: 3,
  impact: 4,
  category: 'Technical',
  owner: 'Test Owner',
  score: 12,
  ...overrides
})

export const createMockWBSActivity = (overrides: Partial<WBSActivity> = {}): WBSActivity => ({
  id: 'act-1',
  name: 'Test Activity',
  duration: 2,
  unit: 'weeks',
  dependencies: [],
  resources: ['Resource 1'],
  milestone: false,
  phase: 'phase-1',
  ...overrides
})

export const createMockWBSPhase = (overrides: Partial<WBSPhase> = {}): WBSPhase => ({
  id: 'phase-1',
  name: 'Test Phase',
  activities: [createMockWBSActivity()],
  ...overrides
})

export const createMockHeuristic = (overrides: Partial<Heuristic> = {}): Heuristic => ({
  id: 'h1',
  name: 'Test Heuristic',
  description: 'Test heuristic description',
  rule: 'Test rule',
  category: 'description',
  ...overrides
})

export const createMockAnalysisResult = (overrides: Partial<AnalysisResult> = {}): AnalysisResult => ({
  overallScore: 7,
  risks: [createMockRisk({ qualityScore: 7, suggestions: [] })],
  summary: 'Test summary',
  recommendations: ['Test recommendation 1', 'Test recommendation 2'],
  ...overrides
})

// CSV data generators
export const createMockCSVData = (rows: number = 3) => {
  return Array.from({ length: rows }, (_, i) => ({
    description: `Risk ${i + 1} description`,
    mitigation: `Mitigation ${i + 1}`,
    probability: Math.min(5, i + 2),
    impact: Math.min(5, i + 2),
    category: 'Technical',
    owner: `Owner ${i + 1}`
  }))
}

export const createMockCSVFile = (data: unknown[] = createMockCSVData()) => {
  const csvContent = Object.keys(data[0] as Record<string, unknown>).join(',') + '\n' +
    data.map(row =>
      Object.values(row as Record<string, unknown>).join(',')
    ).join('\n')

  return new File([csvContent], 'test-risks.csv', { type: 'text/csv' })
}

// Wait helpers
export const waitForLoadingToFinish = async () => {
  const { waitFor } = await import('@testing-library/react')
  await waitFor(() => {
    expect(document.querySelector('.animate-spin')).not.toBeInTheDocument()
  }, { timeout: 5000 })
}

export const waitForElement = async (text: string | RegExp) => {
  const { waitFor, screen } = await import('@testing-library/react')
  await waitFor(() => {
    expect(screen.getByText(text)).toBeInTheDocument()
  }, { timeout: 5000 })
}
