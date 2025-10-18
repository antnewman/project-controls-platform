import { describe, it, expect } from 'vitest'
import {
  formatDate,
  calculateRiskScore,
  getRiskSeverity,
  getRiskColor,
  parseRisksFromCSV,
  exportWBSToCSV,
  downloadCSV,
  calculatePhaseDuration,
  validateRiskCSVHeaders,
  generateId,
  debounce,
  cn
} from '@/lib/utils'
import type { WBSPhase, WBSActivity } from '@/lib/types'

describe('utils.ts', () => {
  describe('formatDate', () => {
    it('formats Date object correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toBe('Jan 15, 2024')
    })

    it('formats string date correctly', () => {
      const formatted = formatDate('2024-03-20')
      expect(formatted).toBe('Mar 20, 2024')
    })

    it('handles different months', () => {
      expect(formatDate('2024-12-25')).toContain('Dec')
      expect(formatDate('2024-06-01')).toContain('Jun')
    })
  })

  describe('calculateRiskScore', () => {
    it('calculates score correctly', () => {
      expect(calculateRiskScore(3, 4)).toBe(12)
    })

    it('handles minimum values', () => {
      expect(calculateRiskScore(1, 1)).toBe(1)
    })

    it('handles maximum values', () => {
      expect(calculateRiskScore(5, 5)).toBe(25)
    })

    it('handles zero values', () => {
      expect(calculateRiskScore(0, 5)).toBe(0)
      expect(calculateRiskScore(5, 0)).toBe(0)
    })

    it('handles decimal values', () => {
      expect(calculateRiskScore(2.5, 3)).toBe(7.5)
    })
  })

  describe('getRiskSeverity', () => {
    it('returns low for scores <= 5', () => {
      expect(getRiskSeverity(1)).toBe('low')
      expect(getRiskSeverity(3)).toBe('low')
      expect(getRiskSeverity(5)).toBe('low')
    })

    it('returns medium for scores 6-10', () => {
      expect(getRiskSeverity(6)).toBe('medium')
      expect(getRiskSeverity(8)).toBe('medium')
      expect(getRiskSeverity(10)).toBe('medium')
    })

    it('returns high for scores 11-15', () => {
      expect(getRiskSeverity(11)).toBe('high')
      expect(getRiskSeverity(13)).toBe('high')
      expect(getRiskSeverity(15)).toBe('high')
    })

    it('returns critical for scores > 15', () => {
      expect(getRiskSeverity(16)).toBe('critical')
      expect(getRiskSeverity(20)).toBe('critical')
      expect(getRiskSeverity(25)).toBe('critical')
    })
  })

  describe('getRiskColor', () => {
    it('returns correct color for low severity', () => {
      const color = getRiskColor('low')
      expect(color).toContain('green')
    })

    it('returns correct color for medium severity', () => {
      const color = getRiskColor('medium')
      expect(color).toContain('yellow')
    })

    it('returns correct color for high severity', () => {
      const color = getRiskColor('high')
      expect(color).toContain('orange')
    })

    it('returns correct color for critical severity', () => {
      const color = getRiskColor('critical')
      expect(color).toContain('red')
    })

    it('returns default color for unknown severity', () => {
      const color = getRiskColor('unknown')
      expect(color).toContain('gray')
    })
  })

  describe('parseRisksFromCSV', () => {
    it('parses valid CSV data with all columns', () => {
      const data = [
        {
          description: 'Test risk',
          mitigation: 'Test mitigation',
          probability: 3,
          impact: 4,
          category: 'Technical',
          owner: 'John Doe'
        }
      ]

      const risks = parseRisksFromCSV(data)

      expect(risks).toHaveLength(1)
      expect(risks[0]).toMatchObject({
        description: 'Test risk',
        mitigation: 'Test mitigation',
        probability: 3,
        impact: 4,
        category: 'Technical',
        owner: 'John Doe',
        score: 12
      })
      expect(risks[0].id).toBe('risk-1')
    })

    it('parses CSV with capitalized column names', () => {
      const data = [
        {
          Description: 'Test risk',
          Mitigation: 'Test mitigation',
          Probability: 4,
          Impact: 5
        }
      ]

      const risks = parseRisksFromCSV(data)

      expect(risks[0].description).toBe('Test risk')
      expect(risks[0].mitigation).toBe('Test mitigation')
      expect(risks[0].probability).toBe(4)
      expect(risks[0].impact).toBe(5)
    })

    it('handles minimal columns with defaults', () => {
      const data = [
        {
          description: 'Minimal risk',
          mitigation: 'Minimal mitigation'
        }
      ]

      const risks = parseRisksFromCSV(data)

      expect(risks[0].probability).toBe(3)
      expect(risks[0].impact).toBe(3)
      expect(risks[0].category).toBe('General')
      expect(risks[0].owner).toBe('')
    })

    it('handles multiple rows', () => {
      const data = [
        { description: 'Risk 1', mitigation: 'Mitigation 1', probability: 2, impact: 3 },
        { description: 'Risk 2', mitigation: 'Mitigation 2', probability: 4, impact: 4 },
        { description: 'Risk 3', mitigation: 'Mitigation 3', probability: 5, impact: 5 }
      ]

      const risks = parseRisksFromCSV(data)

      expect(risks).toHaveLength(3)
      expect(risks[0].id).toBe('risk-1')
      expect(risks[1].id).toBe('risk-2')
      expect(risks[2].id).toBe('risk-3')
    })

    it('handles special characters in descriptions', () => {
      const data = [
        {
          description: 'Risk with "quotes" and, commas',
          mitigation: 'Mitigation with special chars: @#$%',
          probability: 3,
          impact: 3
        }
      ]

      const risks = parseRisksFromCSV(data)

      expect(risks[0].description).toBe('Risk with "quotes" and, commas')
      expect(risks[0].mitigation).toBe('Mitigation with special chars: @#$%')
    })

    it('converts string numbers to numbers', () => {
      const data = [
        {
          description: 'Test',
          mitigation: 'Test',
          probability: '4',
          impact: '5'
        }
      ]

      const risks = parseRisksFromCSV(data)

      expect(typeof risks[0].probability).toBe('number')
      expect(typeof risks[0].impact).toBe('number')
      expect(risks[0].probability).toBe(4)
      expect(risks[0].impact).toBe(5)
    })

    it('handles empty values', () => {
      const data = [
        {
          description: '',
          mitigation: '',
          category: '',
          owner: ''
        }
      ]

      const risks = parseRisksFromCSV(data)

      expect(risks[0].description).toBe('')
      expect(risks[0].mitigation).toBe('')
      expect(risks[0].category).toBe('')
      expect(risks[0].owner).toBe('')
    })
  })

  describe('exportWBSToCSV', () => {
    it('exports WBS to CSV format correctly', () => {
      const phases: WBSPhase[] = [
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
              resources: ['BA', 'PM'],
              milestone: true,
              phase: 'phase-1'
            }
          ]
        }
      ]

      const csv = exportWBSToCSV(phases)

      expect(csv).toContain('Phase')
      expect(csv).toContain('Activity')
      expect(csv).toContain('Duration')
      expect(csv).toContain('Planning')
      expect(csv).toContain('Requirements')
      expect(csv).toContain('2')
      expect(csv).toContain('weeks')
      expect(csv).toContain('Yes')
    })

    it('handles activities with dependencies', () => {
      const phases: WBSPhase[] = [
        {
          id: 'phase-1',
          name: 'Dev',
          activities: [
            {
              id: 'act-1',
              name: 'Code',
              duration: 1,
              unit: 'weeks',
              dependencies: ['act-0'],
              resources: ['Dev'],
              milestone: false,
              phase: 'phase-1'
            }
          ]
        }
      ]

      const csv = exportWBSToCSV(phases)

      expect(csv).toContain('act-0')
    })

    it('handles activities with multiple resources', () => {
      const phases: WBSPhase[] = [
        {
          id: 'phase-1',
          name: 'Test',
          activities: [
            {
              id: 'act-1',
              name: 'QA',
              duration: 1,
              unit: 'days',
              dependencies: [],
              resources: ['QA', 'Dev', 'PM'],
              milestone: false,
              phase: 'phase-1'
            }
          ]
        }
      ]

      const csv = exportWBSToCSV(phases)

      expect(csv).toContain('QA; Dev; PM')
    })

    it('handles activities without resources', () => {
      const phases: WBSPhase[] = [
        {
          id: 'phase-1',
          name: 'Test',
          activities: [
            {
              id: 'act-1',
              name: 'Task',
              duration: 1,
              unit: 'days',
              dependencies: [],
              milestone: false,
              phase: 'phase-1'
            }
          ]
        }
      ]

      const csv = exportWBSToCSV(phases)

      expect(csv).toContain('""')
    })

    it('escapes quotes in activity names', () => {
      const phases: WBSPhase[] = [
        {
          id: 'phase-1',
          name: 'Phase',
          activities: [
            {
              id: 'act-1',
              name: 'Activity with "quotes"',
              duration: 1,
              unit: 'days',
              dependencies: [],
              milestone: false,
              phase: 'phase-1'
            }
          ]
        }
      ]

      const csv = exportWBSToCSV(phases)

      expect(csv).toContain('Activity with "quotes"')
    })

    it('handles multiple phases and activities', () => {
      const phases: WBSPhase[] = [
        {
          id: 'phase-1',
          name: 'Phase 1',
          activities: [
            {
              id: 'act-1',
              name: 'Activity 1',
              duration: 1,
              unit: 'weeks',
              dependencies: [],
              milestone: false,
              phase: 'phase-1'
            },
            {
              id: 'act-2',
              name: 'Activity 2',
              duration: 2,
              unit: 'weeks',
              dependencies: [],
              milestone: true,
              phase: 'phase-1'
            }
          ]
        },
        {
          id: 'phase-2',
          name: 'Phase 2',
          activities: [
            {
              id: 'act-3',
              name: 'Activity 3',
              duration: 3,
              unit: 'days',
              dependencies: [],
              milestone: false,
              phase: 'phase-2'
            }
          ]
        }
      ]

      const csv = exportWBSToCSV(phases)

      const lines = csv.split('\n')
      expect(lines.length).toBe(4) // Header + 3 activities
    })
  })

  describe('calculatePhaseDuration', () => {
    it('calculates sum of days correctly', () => {
      const activities: WBSActivity[] = [
        { id: '1', name: 'Task 1', duration: 5, unit: 'days', dependencies: [], milestone: false, phase: 'p1' },
        { id: '2', name: 'Task 2', duration: 3, unit: 'days', dependencies: [], milestone: false, phase: 'p1' }
      ]

      expect(calculatePhaseDuration(activities)).toBe(8)
    })

    it('converts weeks to days', () => {
      const activities: WBSActivity[] = [
        { id: '1', name: 'Task', duration: 2, unit: 'weeks', dependencies: [], milestone: false, phase: 'p1' }
      ]

      expect(calculatePhaseDuration(activities)).toBe(10) // 2 weeks * 5 days
    })

    it('converts months to days', () => {
      const activities: WBSActivity[] = [
        { id: '1', name: 'Task', duration: 1, unit: 'months', dependencies: [], milestone: false, phase: 'p1' }
      ]

      expect(calculatePhaseDuration(activities)).toBe(20) // 1 month * 20 days
    })

    it('handles mixed units', () => {
      const activities: WBSActivity[] = [
        { id: '1', name: 'Task 1', duration: 5, unit: 'days', dependencies: [], milestone: false, phase: 'p1' },
        { id: '2', name: 'Task 2', duration: 1, unit: 'weeks', dependencies: [], milestone: false, phase: 'p1' },
        { id: '3', name: 'Task 3', duration: 1, unit: 'months', dependencies: [], milestone: false, phase: 'p1' }
      ]

      expect(calculatePhaseDuration(activities)).toBe(30) // 5 + 5 + 20
    })

    it('returns 0 for empty activities', () => {
      expect(calculatePhaseDuration([])).toBe(0)
    })
  })

  describe('validateRiskCSVHeaders', () => {
    it('validates correct headers', () => {
      const headers = ['description', 'mitigation', 'probability', 'impact', 'category']
      const result = validateRiskCSVHeaders(headers)

      expect(result.valid).toBe(true)
      expect(result.missing).toHaveLength(0)
    })

    it('validates capitalized headers', () => {
      const headers = ['Description', 'Mitigation', 'Probability', 'Impact']
      const result = validateRiskCSVHeaders(headers)

      expect(result.valid).toBe(true)
    })

    it('validates headers with extra whitespace', () => {
      const headers = ['  description  ', 'mitigation', 'probability', 'impact']
      const result = validateRiskCSVHeaders(headers)

      expect(result.valid).toBe(true)
    })

    it('detects missing required headers', () => {
      const headers = ['description', 'mitigation']
      const result = validateRiskCSVHeaders(headers)

      expect(result.valid).toBe(false)
      expect(result.missing).toContain('probability')
      expect(result.missing).toContain('impact')
    })

    it('identifies all missing headers', () => {
      const headers = ['category', 'owner']
      const result = validateRiskCSVHeaders(headers)

      expect(result.valid).toBe(false)
      expect(result.missing).toHaveLength(4)
    })

    it('allows extra non-required headers', () => {
      const headers = ['description', 'mitigation', 'probability', 'impact', 'category', 'owner', 'extra']
      const result = validateRiskCSVHeaders(headers)

      expect(result.valid).toBe(true)
    })
  })

  describe('generateId', () => {
    it('generates a unique ID', () => {
      const id = generateId()
      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('generates unique IDs each time', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('contains timestamp and random component', () => {
      const id = generateId()
      expect(id).toContain('-')
    })
  })

  describe('debounce', () => {
    it('delays function execution', async () => {
      let callCount = 0
      const fn = () => { callCount++ }
      const debounced = debounce(fn, 50)

      debounced()
      expect(callCount).toBe(0)

      await new Promise(resolve => setTimeout(resolve, 60))
      expect(callCount).toBe(1)
    })

    it('cancels previous calls', async () => {
      let callCount = 0
      const fn = () => { callCount++ }
      const debounced = debounce(fn, 50)

      debounced()
      debounced()
      debounced()

      await new Promise(resolve => setTimeout(resolve, 60))
      expect(callCount).toBe(1)
    })

    it('passes arguments to the function', async () => {
      let receivedArg = ''
      const fn = (arg: string) => { receivedArg = arg }
      const debounced = debounce(fn, 50)

      debounced('test')

      await new Promise(resolve => setTimeout(resolve, 60))
      expect(receivedArg).toBe('test')
    })
  })

  describe('cn', () => {
    it('joins multiple classes', () => {
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3')
    })

    it('filters out falsy values', () => {
      expect(cn('class1', false, 'class2', undefined, 'class3')).toBe('class1 class2 class3')
    })

    it('handles empty input', () => {
      expect(cn()).toBe('')
    })

    it('handles all falsy values', () => {
      expect(cn(false, undefined, false)).toBe('')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const isDisabled = false
      expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active')
    })
  })
})
