import { describe, it, expect, vi, beforeEach } from 'vitest'
import { analyzeRisks, generateWBS, identifyRisksFromWBS, isAnthropicConfigured } from '@/lib/anthropic'
import type { Risk, Heuristic, WBSPhase } from '@/lib/types'

// Mock the environment variables
vi.mock('import.meta', () => ({
  env: {
    VITE_DEMO_MODE: 'true',
    VITE_ANTHROPIC_API_KEY: ''
  }
}))

describe('anthropic.ts', () => {
  describe('analyzeRisks', () => {
    const mockRisks: Risk[] = [
      {
        id: 'R1',
        description: 'Project timeline may be delayed due to resource constraints',
        mitigation: 'Establish resource allocation plan and maintain buffer resources',
        probability: 3,
        impact: 4,
        category: 'Schedule',
        owner: 'PM'
      },
      {
        id: 'R2',
        description: 'Bad thing',
        mitigation: 'Fix it',
        probability: 2,
        impact: 2,
        category: 'Technical'
      }
    ]

    const mockHeuristics: Heuristic[] = [
      {
        id: 'h1',
        name: 'Description Clarity',
        description: 'Risks should be specific',
        rule: 'Check for vague language',
        category: 'description'
      }
    ]

    it('returns correct structure', async () => {
      const result = await analyzeRisks(mockRisks, mockHeuristics)

      expect(result).toHaveProperty('overallScore')
      expect(result).toHaveProperty('risks')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('recommendations')
    })

    it('returns analyzed risks with quality scores', async () => {
      const result = await analyzeRisks(mockRisks, mockHeuristics)

      expect(result.risks).toHaveLength(2)
      expect(result.risks[0]).toHaveProperty('qualityScore')
      expect(result.risks[0]).toHaveProperty('suggestions')
    })

    it('scores are within 1-10 range', async () => {
      const result = await analyzeRisks(mockRisks, mockHeuristics)

      result.risks.forEach(risk => {
        expect(risk.qualityScore).toBeGreaterThanOrEqual(1)
        expect(risk.qualityScore).toBeLessThanOrEqual(10)
      })

      expect(result.overallScore).toBeGreaterThanOrEqual(1)
      expect(result.overallScore).toBeLessThanOrEqual(10)
    })

    it('poor quality risks get low scores', async () => {
      const poorRisks: Risk[] = [
        {
          id: 'R1',
          description: 'Bad',
          mitigation: 'Fix',
          probability: 3,
          impact: 3
        }
      ]

      const result = await analyzeRisks(poorRisks, mockHeuristics)

      expect(result.risks[0].qualityScore).toBeLessThan(5)
    })

    it('good quality risks get high scores', async () => {
      const goodRisks: Risk[] = [
        {
          id: 'R1',
          description: 'If vendor delivery is delayed by more than 2 weeks, then project timeline will be impacted and milestone dates will slip',
          mitigation: 'Establish alternative supplier relationships, maintain 4-week buffer stock, and implement weekly vendor status meetings',
          probability: 3,
          impact: 4,
          category: 'Supply Chain',
          owner: 'Procurement Manager'
        }
      ]

      const result = await analyzeRisks(goodRisks, mockHeuristics)

      expect(result.risks[0].qualityScore).toBeGreaterThan(6)
    })

    it('suggestions are provided for low-scoring risks', async () => {
      const result = await analyzeRisks(mockRisks, mockHeuristics)

      const lowScoreRisk = result.risks.find(r => r.id === 'R2')
      expect(lowScoreRisk).toBeDefined()
      expect(lowScoreRisk!.suggestions).toBeDefined()
      expect(lowScoreRisk!.suggestions!.length).toBeGreaterThan(0)
    })

    it('handles empty risk array', async () => {
      const result = await analyzeRisks([], mockHeuristics)

      expect(result.risks).toHaveLength(0)
      expect(result.overallScore).toBeDefined()
      expect(result.summary).toBeDefined()
    })

    it('handles risks without optional fields', async () => {
      const minimalRisks: Risk[] = [
        {
          id: 'R1',
          description: 'Test risk description',
          mitigation: 'Test mitigation',
          probability: 3,
          impact: 3
        }
      ]

      const result = await analyzeRisks(minimalRisks, mockHeuristics)

      expect(result.risks[0]).toBeDefined()
      expect(result.risks[0].qualityScore).toBeDefined()
    })

    it('penalizes vague descriptions', async () => {
      const vagueRisks: Risk[] = [
        {
          id: 'R1',
          description: 'Something bad might happen',
          mitigation: 'Monitor the situation',
          probability: 3,
          impact: 3
        }
      ]

      const result = await analyzeRisks(vagueRisks, mockHeuristics)

      expect(result.risks[0].qualityScore).toBeLessThan(7)
      expect(result.risks[0].suggestions?.some(s => s.toLowerCase().includes('vague'))).toBe(true)
    })

    it('penalizes generic mitigations', async () => {
      const genericRisks: Risk[] = [
        {
          id: 'R1',
          description: 'If timeline is delayed, then project will fail',
          mitigation: 'Be careful and monitor',
          probability: 3,
          impact: 3
        }
      ]

      const result = await analyzeRisks(genericRisks, mockHeuristics)

      expect(result.risks[0].suggestions?.some(s =>
        s.toLowerCase().includes('monitor') || s.toLowerCase().includes('generic')
      )).toBe(true)
    })

    it('provides positive feedback for good risks', async () => {
      const goodRisks: Risk[] = [
        {
          id: 'R1',
          description: 'If critical vendor fails to deliver materials by Q2, then project schedule will slip by 4-6 weeks',
          mitigation: 'Establish secondary vendor relationships, maintain strategic inventory buffer, and implement weekly delivery tracking',
          probability: 3,
          impact: 4,
          category: 'Supply Chain',
          owner: 'Procurement Lead'
        }
      ]

      const result = await analyzeRisks(goodRisks, mockHeuristics)

      expect(result.risks[0].suggestions?.some(s => s.includes('✓'))).toBe(true)
    })

    it('identifies high-priority risks', async () => {
      const highPriorityRisks: Risk[] = [
        {
          id: 'R1',
          description: 'Bad',
          mitigation: 'Fix',
          probability: 4,
          impact: 4,
          category: 'Critical'
        }
      ]

      const result = await analyzeRisks(highPriorityRisks, mockHeuristics)

      expect(result.risks[0].suggestions?.some(s => s.includes('HIGH-PRIORITY'))).toBe(true)
    })

    it('penalizes missing owner', async () => {
      const noOwnerRisks: Risk[] = [
        {
          id: 'R1',
          description: 'If vendor delivery is delayed, then timeline will slip',
          mitigation: 'Establish backup suppliers',
          probability: 3,
          impact: 3
        }
      ]

      const result = await analyzeRisks(noOwnerRisks, mockHeuristics)

      expect(result.risks[0].suggestions?.some(s => s.toLowerCase().includes('owner'))).toBe(true)
    })

    it('penalizes missing category', async () => {
      const noCategoryRisks: Risk[] = [
        {
          id: 'R1',
          description: 'If vendor delivery is delayed, then timeline will slip',
          mitigation: 'Establish backup suppliers',
          probability: 3,
          impact: 3,
          owner: 'PM'
        }
      ]

      const result = await analyzeRisks(noCategoryRisks, mockHeuristics)

      expect(result.risks[0].suggestions?.some(s => s.toLowerCase().includes('category'))).toBe(true)
    })

    it('generates overall summary', async () => {
      const result = await analyzeRisks(mockRisks, mockHeuristics)

      expect(result.summary).toBeDefined()
      expect(typeof result.summary).toBe('string')
      expect(result.summary.length).toBeGreaterThan(0)
    })

    it('generates recommendations', async () => {
      const result = await analyzeRisks(mockRisks, mockHeuristics)

      expect(result.recommendations).toBeDefined()
      expect(Array.isArray(result.recommendations)).toBe(true)
      expect(result.recommendations.length).toBeGreaterThan(0)
    })

    it('calculates overall score correctly', async () => {
      const result = await analyzeRisks(mockRisks, mockHeuristics)

      const manualAverage = Math.round(
        result.risks.reduce((sum, r) => sum + (r.qualityScore || 0), 0) / result.risks.length
      )

      expect(result.overallScore).toBe(manualAverage)
    })
  })

  describe('generateWBS', () => {
    it('returns array of phases', async () => {
      const result = await generateWBS('Build a web application')

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('phases have correct structure', async () => {
      const result = await generateWBS('Build a mobile app')

      result.forEach(phase => {
        expect(phase).toHaveProperty('id')
        expect(phase).toHaveProperty('name')
        expect(phase).toHaveProperty('activities')
        expect(Array.isArray(phase.activities)).toBe(true)
      })
    })

    it('activities have all required properties', async () => {
      const result = await generateWBS('Develop software')

      result.forEach(phase => {
        phase.activities.forEach(activity => {
          expect(activity).toHaveProperty('id')
          expect(activity).toHaveProperty('name')
          expect(activity).toHaveProperty('duration')
          expect(activity).toHaveProperty('unit')
          expect(activity).toHaveProperty('dependencies')
          expect(activity).toHaveProperty('milestone')
          expect(activity).toHaveProperty('phase')
        })
      })
    })

    it('detects construction projects', async () => {
      const result = await generateWBS('Build a new office building with 5 floors')

      expect(result.some(phase =>
        phase.name.toLowerCase().includes('construction') ||
        phase.activities.some(act => act.name.toLowerCase().includes('foundation'))
      )).toBe(true)
    })

    it('detects research projects', async () => {
      const result = await generateWBS('Conduct research study on climate change impacts')

      expect(result.some(phase =>
        phase.name.toLowerCase().includes('research') ||
        phase.activities.some(act => act.name.toLowerCase().includes('literature'))
      )).toBe(true)
    })

    it('defaults to software template', async () => {
      const result = await generateWBS('Create a new system')

      expect(result.some(phase =>
        phase.name.toLowerCase().includes('planning') ||
        phase.name.toLowerCase().includes('development')
      )).toBe(true)
    })

    it('generates milestones', async () => {
      const result = await generateWBS('Build software')

      const allActivities = result.flatMap(phase => phase.activities)
      const milestones = allActivities.filter(act => act.milestone)

      expect(milestones.length).toBeGreaterThan(0)
    })

    it('creates dependencies', async () => {
      const result = await generateWBS('Build application')

      const allActivities = result.flatMap(phase => phase.activities)
      const withDependencies = allActivities.filter(act => act.dependencies.length > 0)

      expect(withDependencies.length).toBeGreaterThan(0)
    })

    it('duration values are reasonable', async () => {
      const result = await generateWBS('Create project')

      result.forEach(phase => {
        phase.activities.forEach(activity => {
          expect(activity.duration).toBeGreaterThan(0)
          expect(activity.duration).toBeLessThan(1000)
        })
      })
    })

    it('generates multiple phases', async () => {
      const result = await generateWBS('Complete project')

      expect(result.length).toBeGreaterThanOrEqual(3)
      expect(result.length).toBeLessThanOrEqual(5)
    })

    it('phases have unique IDs', async () => {
      const result = await generateWBS('Build system')

      const phaseIds = result.map(p => p.id)
      const uniqueIds = new Set(phaseIds)

      expect(uniqueIds.size).toBe(phaseIds.length)
    })

    it('activities have unique IDs', async () => {
      const result = await generateWBS('Develop application')

      const activityIds = result.flatMap(phase => phase.activities.map(a => a.id))
      const uniqueIds = new Set(activityIds)

      expect(uniqueIds.size).toBe(activityIds.length)
    })

    it('handles empty narrative', async () => {
      const result = await generateWBS('')

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('handles very long narrative', async () => {
      const longNarrative = 'Build '.repeat(100) + 'a complex system'
      const result = await generateWBS(longNarrative)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('identifyRisksFromWBS', () => {
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
            milestone: true,
            phase: 'phase-1'
          },
          {
            id: 'act-1-2',
            name: 'Design',
            duration: 15,
            unit: 'days',
            dependencies: ['act-1-1'],
            milestone: false,
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
            dependencies: ['act-1-2'],
            milestone: false,
            phase: 'phase-2'
          }
        ]
      }
    ]

    it('generates risks from WBS', async () => {
      const result = await identifyRisksFromWBS(mockWBS, 'Test Project')

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('risks have correct structure', async () => {
      const result = await identifyRisksFromWBS(mockWBS, 'Test Project')

      result.forEach(risk => {
        expect(risk).toHaveProperty('id')
        expect(risk).toHaveProperty('description')
        expect(risk).toHaveProperty('mitigation')
        expect(risk).toHaveProperty('probability')
        expect(risk).toHaveProperty('impact')
        expect(risk).toHaveProperty('category')
      })
    })

    it('risk categories match WBS phases', async () => {
      const result = await identifyRisksFromWBS(mockWBS, 'Test Project')

      const phaseNames = mockWBS.map(p => p.name)
      const hasMatchingCategory = result.some(risk =>
        phaseNames.some(name => risk.category?.includes(name)) ||
        risk.category?.includes('Resource')
      )

      expect(hasMatchingCategory).toBe(true)
    })

    it('generates risks for milestones', async () => {
      const result = await identifyRisksFromWBS(mockWBS, 'Test Project')

      expect(result.some(risk =>
        risk.description.toLowerCase().includes('requirement')
      )).toBe(true)
    })

    it('generates risks for long-duration activities', async () => {
      const result = await identifyRisksFromWBS(mockWBS, 'Test Project')

      expect(result.some(risk =>
        risk.description.toLowerCase().includes('design')
      )).toBe(true)
    })

    it('generates resource risks for complex phases', async () => {
      const complexWBS: WBSPhase[] = [
        {
          id: 'phase-1',
          name: 'Complex Phase',
          activities: Array(10).fill(null).map((_, i) => ({
            id: `act-${i}`,
            name: `Activity ${i}`,
            duration: 1,
            unit: 'weeks' as const,
            dependencies: [],
            milestone: false,
            phase: 'phase-1'
          }))
        }
      ]

      const result = await identifyRisksFromWBS(complexWBS, 'Test')

      expect(result.some(risk =>
        risk.category?.toLowerCase().includes('resource')
      )).toBe(true)
    })

    it('milestone activities generate higher-impact risks', async () => {
      const result = await identifyRisksFromWBS(mockWBS, 'Test Project')

      const milestoneRisk = result.find(risk =>
        risk.description.toLowerCase().includes('requirement')
      )

      expect(milestoneRisk).toBeDefined()
      expect(milestoneRisk!.impact).toBeGreaterThanOrEqual(4)
    })

    it('all generated risks are valid', async () => {
      const result = await identifyRisksFromWBS(mockWBS, 'Test Project')

      result.forEach(risk => {
        expect(risk.probability).toBeGreaterThanOrEqual(1)
        expect(risk.probability).toBeLessThanOrEqual(5)
        expect(risk.impact).toBeGreaterThanOrEqual(1)
        expect(risk.impact).toBeLessThanOrEqual(5)
        expect(risk.description.length).toBeGreaterThan(10)
        expect(risk.mitigation.length).toBeGreaterThan(10)
      })
    })

    it('generates phase-level risks', async () => {
      const result = await identifyRisksFromWBS(mockWBS, 'Test Project')

      expect(result.some(risk =>
        risk.description.toLowerCase().includes('phase')
      )).toBe(true)
    })

    it('handles empty WBS', async () => {
      const result = await identifyRisksFromWBS([], 'Test Project')

      expect(Array.isArray(result)).toBe(true)
    })

    it('uses project name in context', async () => {
      const projectName = 'My Special Project'
      const result = await identifyRisksFromWBS(mockWBS, projectName)

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('generates unique risk IDs', async () => {
      const result = await identifyRisksFromWBS(mockWBS, 'Test Project')

      const riskIds = result.map(r => r.id)
      const uniqueIds = new Set(riskIds)

      expect(uniqueIds.size).toBe(riskIds.length)
    })
  })

  describe('isAnthropicConfigured', () => {
    it('returns false in demo mode', () => {
      const result = isAnthropicConfigured()

      expect(typeof result).toBe('boolean')
      expect(result).toBe(false)
    })

    it('returns false when API key is placeholder', () => {
      vi.mock('import.meta', () => ({
        env: {
          VITE_DEMO_MODE: 'false',
          VITE_ANTHROPIC_API_KEY: 'your-anthropic-api-key-here'
        }
      }))

      const result = isAnthropicConfigured()

      expect(result).toBe(false)
    })
  })
})
