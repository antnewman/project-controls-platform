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

// Mock analysis result generator with realistic scoring
export const mockAnalyzeRisks = (risks: Risk[], _heuristics: Heuristic[]): AnalysisResult => {
  const analyzedRisks = risks.map((risk) => {
    let qualityScore = 7; // Base score
    const suggestions: string[] = [];

    // Check description quality
    if (risk.description.length < 20) {
      qualityScore -= 2;
      suggestions.push('Risk description is too brief - add more specific details about the event, conditions, and consequences');
    }
    if (!risk.description.toLowerCase().includes('if') &&
        !risk.description.toLowerCase().includes('may') &&
        !risk.description.toLowerCase().includes('could')) {
      qualityScore -= 1;
      suggestions.push("Consider using 'If X occurs, then Y' format for clarity");
    }
    if (risk.description.toLowerCase().includes('bad thing') ||
        risk.description.toLowerCase().includes('might happen') ||
        risk.description.length < 30) {
      qualityScore -= 1;
      suggestions.push('Avoid vague language - be specific about what could go wrong');
    }

    // Check mitigation quality
    if (!risk.mitigation || risk.mitigation.length < 10) {
      qualityScore -= 3;
      suggestions.push('Mitigation plan is missing or incomplete - provide concrete action steps');
    } else if (risk.mitigation.length < 30) {
      qualityScore -= 2;
      suggestions.push('Mitigation is too brief - include specific actions, responsibilities, and timelines');
    }
    if (risk.mitigation && !risk.mitigation.match(/\b(will|shall|must|implement|establish|develop|monitor)\b/i)) {
      qualityScore -= 1;
      suggestions.push('Mitigation should include clear action verbs (will, shall, implement, etc.)');
    }
    if (risk.mitigation && (risk.mitigation.toLowerCase().includes('fix it') ||
                            risk.mitigation.toLowerCase().includes('be careful') ||
                            risk.mitigation.toLowerCase().includes('monitor'))) {
      qualityScore -= 2;
      suggestions.push('Avoid generic phrases like "fix it" or "monitor" - be specific about actions');
    }

    // Check if owner is assigned
    if (!risk.owner) {
      qualityScore -= 1;
      suggestions.push('Assign a risk owner for accountability');
    }

    // Check category
    if (!risk.category) {
      qualityScore -= 1;
      suggestions.push('Assign a risk category for better organization');
    }

    // Check probability and impact consistency
    if (risk.probability > 3 && risk.impact > 3 && suggestions.length > 0) {
      suggestions.unshift('⚠️ HIGH-PRIORITY RISK: This critical risk needs immediate attention and improvement');
    }

    // Check for completeness
    if (risk.description.length > 50 && risk.mitigation.length > 40 && risk.owner) {
      qualityScore += 1;
    }

    // Ensure score is within bounds
    qualityScore = Math.max(1, Math.min(10, qualityScore));

    // Add positive feedback for good risks
    if (suggestions.length === 0) {
      suggestions.push('✓ Risk is well-defined with clear description and actionable mitigation');
    }

    return {
      ...risk,
      qualityScore,
      suggestions,
    };
  });

  const overallScore = Math.round(
    analyzedRisks.reduce((sum, r) => sum + (r.qualityScore || 0), 0) / analyzedRisks.length
  );

  return {
    overallScore,
    risks: analyzedRisks,
    summary: overallScore >= 8
      ? 'Excellent risk register quality! Risks are well-defined with clear, actionable mitigations.'
      : overallScore >= 6
      ? 'Good foundation. Several risks have room for improvement in clarity and specificity.'
      : 'Risk register needs significant improvement. Focus on clear descriptions and actionable mitigations.',
    recommendations: [
      'Ensure all risk descriptions follow the "If X occurs, then Y consequence" format',
      'Assign specific owners to all high-priority risks (probability × impact > 12)',
      'Review mitigation plans for actionability - include concrete steps and responsibilities',
      'Avoid generic language like "monitor", "be careful", or "fix it"',
      'Consider adding estimated costs or timeframes to mitigation strategies',
    ],
  };
};

// Mock WBS generation with context-aware responses
export const mockGenerateWBS = (narrative: string): WBSPhase[] => {
  const lowerNarrative = narrative.toLowerCase();

  // Detect project type from narrative
  const isConstruction = lowerNarrative.includes('build') ||
                        lowerNarrative.includes('construct') ||
                        lowerNarrative.includes('foundation') ||
                        lowerNarrative.includes('building');

  const isResearch = lowerNarrative.includes('research') ||
                    lowerNarrative.includes('study') ||
                    lowerNarrative.includes('analysis') ||
                    lowerNarrative.includes('experiment');

  // Construction project WBS
  if (isConstruction) {
    return [
      {
        id: 'phase-1',
        name: 'Project Initiation & Planning',
        activities: [
          { id: '1.1', name: 'Site Survey & Assessment', duration: 5, unit: 'days', dependencies: [], milestone: false, phase: 'phase-1' },
          { id: '1.2', name: 'Permits & Regulatory Approvals', duration: 15, unit: 'days', dependencies: ['1.1'], milestone: true, phase: 'phase-1' },
          { id: '1.3', name: 'Final Design Review & Sign-off', duration: 3, unit: 'days', dependencies: ['1.2'], milestone: true, phase: 'phase-1' },
          { id: '1.4', name: 'Procurement Planning', duration: 5, unit: 'days', dependencies: ['1.3'], milestone: false, phase: 'phase-1' }
        ]
      },
      {
        id: 'phase-2',
        name: 'Construction Phase',
        activities: [
          { id: '2.1', name: 'Site Preparation & Clearing', duration: 10, unit: 'days', dependencies: ['1.4'], milestone: false, phase: 'phase-2' },
          { id: '2.2', name: 'Foundation & Excavation Work', duration: 20, unit: 'days', dependencies: ['2.1'], milestone: false, phase: 'phase-2' },
          { id: '2.3', name: 'Structural Framework Build', duration: 45, unit: 'days', dependencies: ['2.2'], milestone: true, phase: 'phase-2' },
          { id: '2.4', name: 'MEP Systems Installation', duration: 30, unit: 'days', dependencies: ['2.3'], milestone: false, phase: 'phase-2' },
          { id: '2.5', name: 'Interior Finishing', duration: 25, unit: 'days', dependencies: ['2.4'], milestone: false, phase: 'phase-2' }
        ]
      },
      {
        id: 'phase-3',
        name: 'Testing & Closeout',
        activities: [
          { id: '3.1', name: 'Systems Testing & Commissioning', duration: 10, unit: 'days', dependencies: ['2.5'], milestone: false, phase: 'phase-3' },
          { id: '3.2', name: 'Final Inspections & Certifications', duration: 5, unit: 'days', dependencies: ['3.1'], milestone: true, phase: 'phase-3' },
          { id: '3.3', name: 'Project Handover & Documentation', duration: 2, unit: 'days', dependencies: ['3.2'], milestone: true, phase: 'phase-3' }
        ]
      }
    ];
  }

  // Research project WBS
  if (isResearch) {
    return [
      {
        id: 'phase-1',
        name: 'Research Design',
        activities: [
          { id: '1.1', name: 'Literature Review', duration: 3, unit: 'weeks', dependencies: [], milestone: false, phase: 'phase-1' },
          { id: '1.2', name: 'Research Question Formulation', duration: 1, unit: 'weeks', dependencies: ['1.1'], milestone: true, phase: 'phase-1' },
          { id: '1.3', name: 'Methodology Design', duration: 2, unit: 'weeks', dependencies: ['1.2'], milestone: false, phase: 'phase-1' },
          { id: '1.4', name: 'Ethics Approval', duration: 2, unit: 'weeks', dependencies: ['1.3'], milestone: true, phase: 'phase-1' }
        ]
      },
      {
        id: 'phase-2',
        name: 'Data Collection & Analysis',
        activities: [
          { id: '2.1', name: 'Data Collection Setup', duration: 1, unit: 'weeks', dependencies: ['1.4'], milestone: false, phase: 'phase-2' },
          { id: '2.2', name: 'Primary Data Collection', duration: 6, unit: 'weeks', dependencies: ['2.1'], milestone: false, phase: 'phase-2' },
          { id: '2.3', name: 'Data Cleaning & Validation', duration: 2, unit: 'weeks', dependencies: ['2.2'], milestone: false, phase: 'phase-2' },
          { id: '2.4', name: 'Statistical Analysis', duration: 3, unit: 'weeks', dependencies: ['2.3'], milestone: true, phase: 'phase-2' }
        ]
      },
      {
        id: 'phase-3',
        name: 'Reporting & Dissemination',
        activities: [
          { id: '3.1', name: 'Results Interpretation', duration: 2, unit: 'weeks', dependencies: ['2.4'], milestone: false, phase: 'phase-3' },
          { id: '3.2', name: 'Draft Report Writing', duration: 4, unit: 'weeks', dependencies: ['3.1'], milestone: false, phase: 'phase-3' },
          { id: '3.3', name: 'Peer Review & Revision', duration: 2, unit: 'weeks', dependencies: ['3.2'], milestone: false, phase: 'phase-3' },
          { id: '3.4', name: 'Final Publication', duration: 1, unit: 'weeks', dependencies: ['3.3'], milestone: true, phase: 'phase-3' }
        ]
      }
    ];
  }

  // Default: Software development project WBS
  return [
    {
      id: 'phase-1',
      name: 'Planning & Design',
      activities: [
        { id: '1.1', name: 'Requirements Gathering & Analysis', duration: 2, unit: 'weeks', dependencies: [], milestone: false, phase: 'phase-1' },
        { id: '1.2', name: 'System Architecture Design', duration: 2, unit: 'weeks', dependencies: ['1.1'], milestone: false, phase: 'phase-1' },
        { id: '1.3', name: 'UI/UX Design & Prototyping', duration: 2, unit: 'weeks', dependencies: ['1.1'], milestone: false, phase: 'phase-1' },
        { id: '1.4', name: 'Design Review & Approval', duration: 1, unit: 'weeks', dependencies: ['1.2', '1.3'], milestone: true, phase: 'phase-1' }
      ]
    },
    {
      id: 'phase-2',
      name: 'Development',
      activities: [
        { id: '2.1', name: 'Backend API Development', duration: 6, unit: 'weeks', dependencies: ['1.4'], milestone: false, phase: 'phase-2' },
        { id: '2.2', name: 'Frontend Development', duration: 6, unit: 'weeks', dependencies: ['1.4'], milestone: false, phase: 'phase-2' },
        { id: '2.3', name: 'Database Setup & Configuration', duration: 1, unit: 'weeks', dependencies: ['1.4'], milestone: false, phase: 'phase-2' },
        { id: '2.4', name: 'System Integration', duration: 2, unit: 'weeks', dependencies: ['2.1', '2.2', '2.3'], milestone: true, phase: 'phase-2' }
      ]
    },
    {
      id: 'phase-3',
      name: 'Testing & Deployment',
      activities: [
        { id: '3.1', name: 'Unit & Integration Testing', duration: 2, unit: 'weeks', dependencies: ['2.4'], milestone: false, phase: 'phase-3' },
        { id: '3.2', name: 'User Acceptance Testing', duration: 2, unit: 'weeks', dependencies: ['3.1'], milestone: false, phase: 'phase-3' },
        { id: '3.3', name: 'Performance Testing & Optimization', duration: 1, unit: 'weeks', dependencies: ['3.2'], milestone: false, phase: 'phase-3' },
        { id: '3.4', name: 'Production Deployment', duration: 3, unit: 'days', dependencies: ['3.3'], milestone: true, phase: 'phase-3' },
        { id: '3.5', name: 'Go Live & Monitoring', duration: 1, unit: 'weeks', dependencies: ['3.4'], milestone: true, phase: 'phase-3' }
      ]
    }
  ];
};
