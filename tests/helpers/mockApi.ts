import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { createMockAnalysisResult, createMockWBSPhase, createMockRisk } from './testUtils'

export const handlers = [
  rest.post('/api/analyze', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(createMockAnalysisResult())
    )
  }),

  rest.post('/api/generate-wbs', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        createMockWBSPhase({ id: 'phase-1', name: 'Planning' }),
        createMockWBSPhase({ id: 'phase-2', name: 'Execution' }),
        createMockWBSPhase({ id: 'phase-3', name: 'Closure' })
      ])
    )
  }),

  rest.post('/api/identify-risks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        createMockRisk({ id: 'R1', description: 'Identified risk 1' }),
        createMockRisk({ id: 'R2', description: 'Identified risk 2' })
      ])
    )
  })
]

export const server = setupServer(...handlers)

// Setup and teardown
export const setupMockServer = () => {
  server.listen({ onUnhandledRequest: 'warn' })
}

export const resetMockServer = () => {
  server.resetHandlers()
}

export const closeMockServer = () => {
  server.close()
}
