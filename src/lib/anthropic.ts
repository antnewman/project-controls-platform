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
