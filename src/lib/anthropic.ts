import Anthropic from '@anthropic-ai/sdk';
import type { Risk, Heuristic, AnalysisResult, WBSPhase, Lesson, DocumentAnalysis, ExtractedLesson } from './types';
import { mockAnalyzeRisks, mockGenerateWBS } from './mockData';

// Check if we're in demo/mock mode
const MOCK_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';

// Initialize Anthropic client (only if not in mock mode and API key exists)
const anthropic = !MOCK_MODE && API_KEY ? new Anthropic({ apiKey: API_KEY, dangerouslyAllowBrowser: true }) : null;

/**
 * Analyze risks using Claude AI with SME heuristics
 */
export async function analyzeRisks(risks: Risk[], heuristics: Heuristic[]): Promise<AnalysisResult> {
  if (MOCK_MODE || !anthropic) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return mockAnalyzeRisks(risks, heuristics);
  }

  try {
    const prompt = buildRiskAnalysisPrompt(risks, heuristics);

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return parseRiskAnalysisResponse(content.text, risks);
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Error analyzing risks:', error);
    // Fallback to mock data on error
    return mockAnalyzeRisks(risks, heuristics);
  }
}

/**
 * Generate Work Breakdown Structure from project narrative
 */
export async function generateWBS(narrative: string, template?: string): Promise<WBSPhase[]> {
  if (MOCK_MODE || !anthropic) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return mockGenerateWBS(narrative);
  }

  try {
    const prompt = buildWBSPrompt(narrative, template);

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return parseWBSResponse(content.text);
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Error generating WBS:', error);
    // Fallback to mock data on error
    return mockGenerateWBS(narrative);
  }
}

/**
 * Identify risks from WBS phases and activities
 */
export async function identifyRisksFromWBS(
  phases: WBSPhase[],
  projectName: string
): Promise<Risk[]> {
  if (MOCK_MODE || !anthropic) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const risks: Risk[] = [];
    let riskCount = 1;

    phases.forEach(phase => {
      // Add phase-level risks
      risks.push({
        id: `R${riskCount++}`,
        description: `If ${phase.name.toLowerCase()} phase is delayed, then project timeline may be impacted`,
        mitigation: `Regular progress monitoring and early warning system for ${phase.name.toLowerCase()}`,
        probability: 3,
        impact: 4,
        category: phase.name,
        owner: 'Project Manager'
      });

      // Add activity-specific risks for high-risk activities
      phase.activities.forEach(activity => {
        if (activity.milestone || activity.duration > 10) {
          risks.push({
            id: `R${riskCount++}`,
            description: `If ${activity.name.toLowerCase()} encounters delays or quality issues, then ${phase.name.toLowerCase()} deliverables may be compromised`,
            mitigation: `Allocate experienced resources to ${activity.name.toLowerCase()} and implement quality checkpoints`,
            probability: Math.min(5, Math.floor(activity.duration / 5) + 2),
            impact: activity.milestone ? 4 : 3,
            category: phase.name,
            owner: ''
          });
        }
      });

      // Add resource risks
      if (phase.activities.length > 5) {
        risks.push({
          id: `R${riskCount++}`,
          description: `If adequate resources are not available for ${phase.name.toLowerCase()}, then project delivery may be delayed`,
          mitigation: `Secure resource commitments early and maintain resource pool for ${phase.name.toLowerCase()}`,
          probability: 3,
          impact: 3,
          category: 'Resource Management',
          owner: 'Resource Manager'
        });
      }
    });

    return risks;
  }

  try {
    const prompt = buildRiskIdentificationPrompt(phases, projectName);

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return parseRiskIdentificationResponse(content.text);
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Error identifying risks from WBS:', error);
    // Fallback to mock implementation on error
    return identifyRisksFromWBS(phases, projectName);
  }
}

/**
 * Build prompt for risk identification from WBS
 */
function buildRiskIdentificationPrompt(phases: WBSPhase[], projectName: string): string {
  return `You are a project risk management expert. Analyze the following Work Breakdown Structure and identify potential risks for the project "${projectName}".

WBS PHASES AND ACTIVITIES:
${phases.map(phase => `
Phase: ${phase.name}
Activities:
${phase.activities.map(act => `  - ${act.id}: ${act.name} (${act.duration} ${act.unit}${act.milestone ? ' - MILESTONE' : ''})`).join('\n')}
`).join('\n')}

For each phase and critical activity, identify risks using the "If-Then" format:
- "If [trigger event], then [consequence]"

For each risk, provide:
1. Risk ID (R1, R2, etc.)
2. Clear description (using If-Then format)
3. Mitigation strategy
4. Probability (1-5, where 5 is most likely)
5. Impact (1-5, where 5 is most severe)
6. Category (the phase name or risk type)
7. Suggested owner role

Focus on:
- Schedule delays for critical activities
- Resource availability issues
- Quality concerns for deliverables
- Dependencies between activities
- Technical/execution risks for complex activities

Return your response as a JSON array with this structure:
[
  {
    "id": "R1",
    "description": "If-Then format risk description",
    "mitigation": "Specific mitigation strategy",
    "probability": number (1-5),
    "impact": number (1-5),
    "category": "Phase name or risk type",
    "owner": "Suggested owner role"
  }
]`;
}

/**
 * Parse risk identification response from Claude
 */
function parseRiskIdentificationResponse(response: string): Risk[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error parsing risk identification response:', error);
    return [];
  }
}

/**
 * Build prompt for risk analysis
 */
function buildRiskAnalysisPrompt(risks: Risk[], heuristics: Heuristic[]): string {
  return `You are a project risk management expert. Analyze the following risks using the provided SME heuristics and score each risk's quality from 1-10.

HEURISTICS:
${heuristics.map((h) => `${h.name}: ${h.description}\nRule: ${h.rule}`).join('\n\n')}

RISKS TO ANALYZE:
${risks
  .map(
    (r, i) => `
Risk ${i + 1}:
- Description: ${r.description}
- Mitigation: ${r.mitigation}
- Probability: ${r.probability}/5
- Impact: ${r.impact}/5
- Category: ${r.category || 'N/A'}
- Owner: ${r.owner || 'N/A'}
`
  )
  .join('\n')}

For each risk, provide:
1. Quality score (1-10)
2. Specific suggestions for improvement
3. Which heuristics were violated (if any)

Also provide:
- Overall quality score (average)
- Summary of analysis
- Top 3-5 recommendations

Return your response as a JSON object with this structure:
{
  "risks": [
    {
      "id": "risk id",
      "qualityScore": number,
      "suggestions": ["suggestion 1", "suggestion 2"]
    }
  ],
  "overallScore": number,
  "summary": "string",
  "recommendations": ["rec 1", "rec 2", "rec 3"]
}`;
}

/**
 * Build prompt for WBS generation
 */
function buildWBSPrompt(narrative: string, template?: string): string {
  return `You are a project planning expert. Generate a detailed Work Breakdown Structure (WBS) from the following project description.

PROJECT DESCRIPTION:
${narrative}

${template ? `Use this template as a guide:\n${template}\n` : ''}

Create a comprehensive WBS with:
- 3-5 major phases
- 8-15 activities total
- Realistic durations (in days, weeks, or months)
- Dependencies between activities
- Resource requirements
- Milestone identification

Return your response as a JSON array with this structure:
[
  {
    "id": "phase-1",
    "name": "Phase Name",
    "activities": [
      {
        "id": "act-1-1",
        "name": "Activity Name",
        "duration": number,
        "unit": "days" | "weeks" | "months",
        "dependencies": ["act-id-1", "act-id-2"],
        "resources": ["Resource 1", "Resource 2"],
        "milestone": true/false,
        "phase": "phase-1"
      }
    ]
  }
]`;
}

/**
 * Parse risk analysis response from Claude
 */
function parseRiskAnalysisResponse(response: string, originalRisks: Risk[]): AnalysisResult {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const parsed = JSON.parse(jsonMatch[0]);

    // Merge with original risks
    const analyzedRisks = originalRisks.map((risk) => {
      const analysis = parsed.risks.find((r: { id: string }) => r.id === risk.id);
      return {
        ...risk,
        qualityScore: analysis?.qualityScore || 5,
        suggestions: analysis?.suggestions || [],
      };
    });

    return {
      risks: analyzedRisks,
      overallScore: parsed.overallScore || 5,
      summary: parsed.summary || 'Analysis complete',
      recommendations: parsed.recommendations || [],
    };
  } catch (error) {
    console.error('Error parsing risk analysis response:', error);
    return mockAnalyzeRisks(originalRisks, []);
  }
}

/**
 * Parse WBS response from Claude
 */
function parseWBSResponse(response: string): WBSPhase[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error parsing WBS response:', error);
    return mockGenerateWBS('');
  }
}

/**
 * Check if Anthropic API is configured
 */
export const isAnthropicConfigured = (): boolean => {
  return Boolean(API_KEY) && API_KEY !== 'your-anthropic-api-key-here';
};

// ============================================
// CHALLENGE 4: LESSONS LIBRARY FUNCTIONS
// ============================================

/**
 * Extract lessons from Gateway review or assurance document
 */
export async function extractLessonsFromDocument(
  documentText: string,
  documentName: string,
  documentType: 'gateway_review' | 'nista' | 'project_closure' | 'assurance_report'
): Promise<DocumentAnalysis> {
  const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'

  if (DEMO_MODE) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Generate mock lessons based on document type
    const mockLessons: ExtractedLesson[] = [
      {
        rawText: "The project experienced delays due to unclear procurement processes and lack of early supplier engagement.",
        extractedLesson: {
          title: "Early Supplier Engagement Critical for Timeline",
          description: "Procurement delays caused 3-month project slippage",
          category: 'Procurement',
          context: "Major infrastructure project with complex supply chain requirements",
          observation: "Procurement processes were initiated 6 months into project, causing significant delays when specialist suppliers had long lead times",
          impact: "3-month delay to project delivery, £2M additional costs, stakeholder confidence reduced",
          recommendation: "Engage key suppliers during project planning phase, minimum 9 months before requirement date for specialist equipment",
          actionableSteps: [
            "Conduct market analysis during project initiation",
            "Identify long-lead items in first month",
            "Establish framework agreements with critical suppliers",
            "Build supplier engagement into project timeline"
          ],
          tags: ['procurement', 'timeline', 'supplier-management', 'planning'],
          relatedPhases: ['Planning', 'Procurement', 'Execution'],
          relatedRiskCategories: ['Supply Chain', 'Schedule'],
          applicability: 'universal',
          confidence: 8
        },
        confidence: 8,
        needsReview: false
      },
      {
        rawText: "Governance structure was unclear, leading to decision-making bottlenecks and accountability gaps.",
        extractedLesson: {
          title: "Clear Governance Structure Required from Day 1",
          description: "Ambiguous governance caused decision delays and accountability issues",
          category: 'Governance',
          context: "Multi-stakeholder programme with unclear decision authority",
          observation: "RACI matrix was not defined until 4 months into project. Multiple stakeholders claimed decision authority, causing 2-3 week delays on critical approvals",
          impact: "Average 2-week delay on major decisions, team frustration, missed milestones",
          recommendation: "Define and communicate RACI matrix during project initiation. Document decision-making authority and escalation paths in Project Initiation Document",
          actionableSteps: [
            "Create RACI matrix in first 2 weeks",
            "Review and sign-off with all stakeholders",
            "Include in Project Initiation Document",
            "Review monthly and update as needed",
            "Train team on escalation procedures"
          ],
          tags: ['governance', 'decision-making', 'accountability', 'raci'],
          relatedPhases: ['Planning', 'Governance Setup'],
          relatedRiskCategories: ['Governance', 'Stakeholder Management'],
          applicability: 'universal',
          confidence: 9
        },
        confidence: 9,
        needsReview: false
      },
      {
        rawText: "Resource constraints in Q2 due to competing priorities led to quality issues in deliverables.",
        extractedLesson: {
          title: "Resource Capacity Planning Must Account for Organisational Priorities",
          description: "Shared resources caused quality problems when priorities shifted",
          category: 'Resourcing',
          context: "Project relying on shared technical resources across multiple programmes",
          observation: "Key technical staff were pulled to 'urgent' organisational priorities in Q2, leaving project understaffed during critical design phase. Rush to catch up led to design errors discovered in build phase",
          impact: "3 major design errors requiring rework, £500K additional costs, 6-week delay",
          recommendation: "Secure dedicated resource commitments or build contingency time. Include resource availability as a key project risk. Establish clear prioritisation framework with senior leadership",
          actionableSteps: [
            "Identify all shared resources during planning",
            "Secure written commitments from resource managers",
            "Build 20% contingency for resource unavailability",
            "Escalate resource conflicts to programme board immediately",
            "Consider external resources for critical skills"
          ],
          tags: ['resourcing', 'capacity-planning', 'quality', 'design'],
          relatedPhases: ['Planning', 'Design', 'Execution'],
          relatedRiskCategories: ['Resource Management', 'Quality'],
          applicability: 'sector_specific',
          sector: 'Government',
          confidence: 8
        },
        confidence: 8,
        needsReview: false
      },
      {
        rawText: "Risk register was not reviewed regularly and several high-impact risks materialized without mitigation plans in place.",
        extractedLesson: {
          title: "Active Risk Management Prevents Crisis Response",
          description: "Static risk register led to reactive firefighting",
          category: 'Risk Management',
          context: "Complex project with multiple interdependencies and external factors",
          observation: "Risk register created at project start but only reviewed quarterly. Three high-impact risks (supplier failure, regulatory change, key staff departure) materialized within 2 months without active mitigation strategies",
          impact: "Project moved to 'red' status, emergency intervention required, £1.5M overspend on crisis management",
          recommendation: "Review risk register monthly minimum. Assign risk owners who actively manage mitigation actions. Include risk review in all steering committee meetings",
          actionableSteps: [
            "Schedule monthly risk review workshops",
            "Assign named owner to each risk",
            "Track mitigation actions with deadlines",
            "Include 'risk spotlight' in every board report",
            "Escalate risks trending upward immediately",
            "Use this platform's Risk Analysis tool for quality checks"
          ],
          tags: ['risk-management', 'governance', 'mitigation', 'monitoring'],
          relatedPhases: ['Planning', 'Execution', 'Monitoring'],
          relatedRiskCategories: ['Risk Management', 'Governance'],
          applicability: 'universal',
          confidence: 10
        },
        confidence: 10,
        needsReview: false
      },
      {
        rawText: "Communication breakdown between project team and end-users resulted in system that didn't meet operational needs.",
        extractedLesson: {
          title: "Continuous User Engagement Prevents Delivery Failures",
          description: "Lack of user involvement led to system rejection",
          category: 'Stakeholder Management',
          context: "IT system implementation for operational end-users",
          observation: "User requirements gathered at project start but no further engagement until UAT phase. System delivered didn't reflect evolved operational needs or user workflows. Users refused to adopt system",
          impact: "System required complete redesign, 9-month delay, near project failure, damaged trust",
          recommendation: "Establish user working group that meets monthly throughout project lifecycle. Include users in design reviews. Conduct iterative user testing, not just final UAT",
          actionableSteps: [
            "Create user steering group with operational representatives",
            "Schedule monthly show-and-tell sessions",
            "Conduct user testing at each design milestone",
            "Document user feedback and decisions made",
            "Include users in acceptance criteria definition",
            "Plan phased rollout with early adopter groups"
          ],
          tags: ['stakeholder-management', 'user-engagement', 'requirements', 'uat'],
          relatedPhases: ['Requirements', 'Design', 'Testing', 'Deployment'],
          relatedRiskCategories: ['Stakeholder Management', 'Requirements'],
          applicability: 'sector_specific',
          sector: 'Technology',
          confidence: 9
        },
        confidence: 9,
        needsReview: false
      }
    ]

    return {
      documentName,
      documentType,
      extractedLessons: mockLessons,
      summary: `Analysis of ${documentName} identified ${mockLessons.length} key lessons across procurement, governance, resourcing, risk management, and stakeholder engagement. Common themes include the importance of early planning, clear accountability, and continuous engagement.`,
      keyThemes: [
        'Early supplier engagement',
        'Clear governance structures',
        'Resource capacity planning',
        'Active risk management',
        'Continuous stakeholder engagement'
      ],
      processingTime: 3.2
    }
  }

  // Real API implementation
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Anthropic API key not configured')

  const prompt = `You are an expert project management analyst specializing in lessons learned.

Analyze this ${documentType} document and extract ALL significant lessons that could benefit future projects.

DOCUMENT: ${documentName}

CONTENT:
${documentText}

For each lesson found, extract:
1. Title (clear, actionable)
2. Category (Procurement, Governance, Resourcing, Risk Management, Delivery & Execution, Stakeholder Management, Technical, Commercial, Quality, Schedule, Budget & Finance, Communication, Change Management, or Compliance)
3. Context (what was the situation)
4. Observation (what happened - both positive and negative)
5. Impact (what were the consequences)
6. Recommendation (what should be done differently)
7. Actionable steps (specific actions to implement the recommendation)
8. Tags (keywords for searchability)
9. Confidence score (1-10 on how clear/actionable this lesson is)

Look for both EXPLICIT lessons (clearly stated) and IMPLICIT lessons (inferred from issues, risks, or recommendations in the document).

Return a JSON array of lessons with this structure:
{
  "lessons": [{
    "title": "...",
    "category": "...",
    "context": "...",
    "observation": "...",
    "impact": "...",
    "recommendation": "...",
    "actionableSteps": ["...", "..."],
    "tags": ["...", "..."],
    "confidence": 8
  }],
  "summary": "Overall summary of key themes",
  "keyThemes": ["theme1", "theme2"]
}

Be thorough - aim to extract 5-10 lessons per document.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    })

    const data = await response.json()
    const result = JSON.parse(data.content[0].text)

    // Transform to our format
    const extractedLessons: ExtractedLesson[] = result.lessons.map((lesson: any) => ({
      rawText: `${lesson.context} ${lesson.observation}`,
      extractedLesson: {
        ...lesson,
        sourceType: documentType,
        source: documentName,
        dateIdentified: new Date().toISOString(),
        applicability: 'universal', // Can be refined
        relatedPhases: inferRelatedPhases(lesson.category),
        relatedRiskCategories: inferRiskCategories(lesson.category)
      },
      confidence: lesson.confidence,
      needsReview: lesson.confidence < 7
    }))

    return {
      documentName,
      documentType,
      extractedLessons,
      summary: result.summary,
      keyThemes: result.keyThemes,
      processingTime: 0
    }
  } catch (error) {
    console.error('Failed to extract lessons:', error)
    throw error
  }
}

/**
 * Enrich a lesson with AI-generated insights
 */
export async function enrichLesson(lesson: Lesson): Promise<Lesson> {
  const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'

  if (DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      ...lesson,
      aiSummary: `This lesson emphasizes the importance of ${lesson.category.toLowerCase()} in project success. Based on similar projects, implementing these recommendations typically reduces related issues by 60-80%.`,
      similarLessons: [] // Would be populated from database
    }
  }

  // Real API call for enrichment
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) return lesson

  const prompt = `Analyze this project lesson and provide enrichment:

LESSON: ${lesson.title}
CATEGORY: ${lesson.category}
CONTEXT: ${lesson.context}
OBSERVATION: ${lesson.observation}
RECOMMENDATION: ${lesson.recommendation}

Provide:
1. A concise 2-sentence summary
2. Related concepts/keywords
3. Estimated impact if implemented
4. Warnings about implementation challenges

Return JSON:
{
  "summary": "...",
  "keywords": ["...", "..."],
  "estimatedImpact": "...",
  "implementationWarnings": ["...", "..."]
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    const enrichment = JSON.parse(data.content[0].text)

    return {
      ...lesson,
      aiSummary: enrichment.summary,
      tags: [...new Set([...lesson.tags, ...enrichment.keywords])]
    }
  } catch (error) {
    console.error('Failed to enrich lesson:', error)
    return lesson
  }
}

/**
 * Search for relevant lessons based on project context
 */
export async function findRelevantLessons(
  _context: {
    projectDescription?: string
    risks?: Risk[]
    wbsPhases?: WBSPhase[]
    category?: string
  }
): Promise<Lesson[]> {
  const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'

  if (DEMO_MODE) {
    // Return mock relevant lessons
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In real implementation, would query database
    return [] // Would be populated from lesson library
  }

  // Real implementation would combine semantic search with filters
  // For now, return empty array
  return []
}

// Helper functions
function inferRelatedPhases(category: string): string[] {
  const phaseMap: Record<string, string[]> = {
    'Procurement': ['Planning', 'Procurement', 'Execution'],
    'Governance': ['Planning', 'Governance Setup', 'Monitoring'],
    'Resourcing': ['Planning', 'Execution', 'Resource Allocation'],
    'Risk Management': ['Planning', 'Risk Assessment', 'Monitoring'],
    'Delivery & Execution': ['Execution', 'Delivery', 'Closeout'],
    'Stakeholder Management': ['Planning', 'Execution', 'Communication'],
    'Technical': ['Design', 'Development', 'Testing'],
    'Schedule': ['Planning', 'Execution', 'Monitoring'],
    'Budget & Finance': ['Planning', 'Financial Management', 'Monitoring']
  }

  return phaseMap[category] || ['Planning', 'Execution']
}

function inferRiskCategories(category: string): string[] {
  const riskMap: Record<string, string[]> = {
    'Procurement': ['Supply Chain', 'Commercial'],
    'Governance': ['Governance', 'Compliance'],
    'Resourcing': ['Resource Management', 'Capacity'],
    'Risk Management': ['Risk Management', 'Governance'],
    'Delivery & Execution': ['Delivery', 'Schedule'],
    'Stakeholder Management': ['Stakeholder Management', 'Communication'],
    'Technical': ['Technical', 'Quality'],
    'Schedule': ['Schedule', 'Delivery'],
    'Budget & Finance': ['Financial', 'Commercial']
  }

  return riskMap[category] || []
}
