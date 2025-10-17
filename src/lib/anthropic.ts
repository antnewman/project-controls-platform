import Anthropic from '@anthropic-ai/sdk';
import type { Risk, Heuristic, AnalysisResult, WBSPhase } from './types';
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
