import type { Risk, Heuristic, WBSPhase, AnalysisResult } from './types';

// Sample risks with varying quality for testing
export const SAMPLE_RISKS: Risk[] = [
  {
    id: '1',
    description: 'Potential delays in vendor delivery of critical components',
    mitigation: 'Establish alternative supplier relationships and maintain buffer stock',
    probability: 4,
    impact: 4,
    category: 'Supply Chain',
    owner: 'Procurement Manager',
    score: 16,
  },
  {
    id: '2',
    description: 'Bad thing might happen',
    mitigation: 'Fix it',
    probability: 3,
    impact: 3,
    category: 'Technical',
    owner: 'Team Lead',
    score: 9,
  },
  {
    id: '3',
    description: 'Regulatory compliance requirements may change during project execution, requiring significant rework',
    mitigation: 'Engage compliance team early, monitor regulatory landscape, and build flexibility into design phase',
    probability: 2,
    impact: 5,
    category: 'Regulatory',
    owner: 'Compliance Officer',
    score: 10,
  },
  {
    id: '4',
    description: 'Resource availability',
    mitigation: 'Hire more people',
    probability: 3,
    impact: 2,
    category: 'Resources',
    owner: 'HR',
    score: 6,
  },
  {
    id: '5',
    description: 'Integration challenges between legacy systems and new platform may cause data inconsistencies and system downtime',
    mitigation: 'Conduct thorough integration testing in staging environment, develop rollback procedures, and implement phased migration approach',
    probability: 3,
    impact: 4,
    category: 'Technical',
    owner: 'Integration Lead',
    score: 12,
  },
];

// Default heuristics for risk analysis
export const DEFAULT_HEURISTICS: Heuristic[] = [
  {
    id: 'h1',
    name: 'Description Clarity',
    description: 'Risk descriptions should be specific, measurable, and clearly state the potential negative event',
    rule: 'Check for vague language like "might", "could", "bad thing". Ensure the description follows "event-condition-consequence" pattern.',
    category: 'description',
  },
  {
    id: 'h2',
    name: 'Mitigation Actionability',
    description: 'Mitigation strategies should include concrete actions with responsible parties',
    rule: 'Verify mitigation includes specific verbs, responsible roles, and measurable outcomes. Avoid generic phrases like "monitor" or "be careful".',
    category: 'mitigation',
  },
  {
    id: 'h3',
    name: 'Scoring Consistency',
    description: 'Probability and impact scores should be consistent with the described risk',
    rule: 'High probability (4-5) risks should have recent historical precedent. High impact (4-5) should clearly threaten project objectives.',
    category: 'scoring',
  },
  {
    id: 'h4',
    name: 'Completeness Check',
    description: 'All required fields should be populated with meaningful information',
    rule: 'Ensure category, owner, description, and mitigation are all present and substantive (>10 characters).',
    category: 'completeness',
  },
  {
    id: 'h5',
    name: 'Risk Specificity',
    description: 'Risks should be specific to the project context, not generic statements',
    rule: 'Avoid boilerplate risks. Each risk should reference specific project components, phases, or stakeholders.',
    category: 'description',
  },
];

// Sample WBS for testing
export const SAMPLE_WBS: WBSPhase[] = [
  {
    id: 'phase-1',
    name: 'Project Initiation',
    activities: [
      {
        id: 'act-1-1',
        name: 'Project Charter Development',
        duration: 2,
        unit: 'weeks',
        dependencies: [],
        resources: ['Project Manager', 'Sponsor'],
        milestone: true,
        phase: 'phase-1',
      },
      {
        id: 'act-1-2',
        name: 'Stakeholder Identification',
        duration: 1,
        unit: 'weeks',
        dependencies: ['act-1-1'],
        resources: ['Project Manager'],
        milestone: false,
        phase: 'phase-1',
      },
      {
        id: 'act-1-3',
        name: 'Initial Risk Assessment',
        duration: 1,
        unit: 'weeks',
        dependencies: ['act-1-2'],
        resources: ['Risk Manager', 'Project Manager'],
        milestone: false,
        phase: 'phase-1',
      },
    ],
  },
  {
    id: 'phase-2',
    name: 'Planning',
    activities: [
      {
        id: 'act-2-1',
        name: 'Requirements Gathering',
        duration: 3,
        unit: 'weeks',
        dependencies: ['act-1-3'],
        resources: ['Business Analyst', 'SMEs'],
        milestone: false,
        phase: 'phase-2',
      },
      {
        id: 'act-2-2',
        name: 'Solution Design',
        duration: 4,
        unit: 'weeks',
        dependencies: ['act-2-1'],
        resources: ['Architect', 'Tech Lead'],
        milestone: true,
        phase: 'phase-2',
      },
      {
        id: 'act-2-3',
        name: 'Resource Planning',
        duration: 2,
        unit: 'weeks',
        dependencies: ['act-2-1'],
        resources: ['Project Manager', 'Resource Manager'],
        milestone: false,
        phase: 'phase-2',
      },
      {
        id: 'act-2-4',
        name: 'Procurement Planning',
        duration: 2,
        unit: 'weeks',
        dependencies: ['act-2-2'],
        resources: ['Procurement Lead'],
        milestone: false,
        phase: 'phase-2',
      },
    ],
  },
  {
    id: 'phase-3',
    name: 'Execution',
    activities: [
      {
        id: 'act-3-1',
        name: 'Development Sprint 1',
        duration: 2,
        unit: 'weeks',
        dependencies: ['act-2-2', 'act-2-3'],
        resources: ['Dev Team'],
        milestone: false,
        phase: 'phase-3',
      },
      {
        id: 'act-3-2',
        name: 'Development Sprint 2',
        duration: 2,
        unit: 'weeks',
        dependencies: ['act-3-1'],
        resources: ['Dev Team'],
        milestone: false,
        phase: 'phase-3',
      },
      {
        id: 'act-3-3',
        name: 'Integration Testing',
        duration: 2,
        unit: 'weeks',
        dependencies: ['act-3-2'],
        resources: ['QA Team', 'Dev Team'],
        milestone: true,
        phase: 'phase-3',
      },
      {
        id: 'act-3-4',
        name: 'User Acceptance Testing',
        duration: 2,
        unit: 'weeks',
        dependencies: ['act-3-3'],
        resources: ['QA Team', 'End Users'],
        milestone: true,
        phase: 'phase-3',
      },
    ],
  },
];

// Mock analysis result generator
export const mockAnalyzeRisks = (risks: Risk[], _heuristics: Heuristic[]): AnalysisResult => {
  const analyzedRisks = risks.map((risk) => {
    // Simple quality scoring based on description length and mitigation detail
    let qualityScore = 5;

    if (risk.description.length > 50) qualityScore += 2;
    if (risk.mitigation.length > 30) qualityScore += 2;
    if (risk.owner && risk.category) qualityScore += 1;

    const suggestions: string[] = [];

    if (risk.description.length < 30) {
      suggestions.push('Expand risk description with more specific details');
    }
    if (risk.mitigation.length < 20) {
      suggestions.push('Provide more actionable mitigation strategies');
    }
    if (!risk.owner) {
      suggestions.push('Assign a risk owner for accountability');
    }

    return {
      ...risk,
      qualityScore: Math.min(10, qualityScore),
      suggestions,
    };
  });

  const overallScore = analyzedRisks.reduce((sum, r) => sum + (r.qualityScore || 0), 0) / analyzedRisks.length;

  return {
    overallScore: Math.round(overallScore * 10) / 10,
    risks: analyzedRisks,
    summary: `Analyzed ${risks.length} risks. Overall quality score: ${Math.round(overallScore * 10) / 10}/10. ${
      overallScore < 6 ? 'Several risks need improvement in clarity and actionability.' : 'Most risks are well-defined.'
    }`,
    recommendations: [
      'Ensure all risks have assigned owners',
      'Use specific, measurable language in risk descriptions',
      'Include concrete actions in mitigation strategies',
      'Review probability and impact scores for consistency',
    ],
  };
};

// Mock WBS generation
export const mockGenerateWBS = (_narrative: string): WBSPhase[] => {
  // Return sample WBS with slight variations
  return SAMPLE_WBS;
};
