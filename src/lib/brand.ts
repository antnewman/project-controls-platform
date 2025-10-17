/**
 * TortoiseAI Brand Guidelines
 *
 * Brand Voice: Knowledgeable without being condescending, patient and encouraging,
 * clear and jargon-free, confident but humble, warm professionalism.
 *
 * Visual Style: Clean and minimalist aesthetic, generous white space,
 * subtle and professional, no clutter or busy designs.
 *
 * Key Message: "Steady progress. Lasting results."
 */

export const BRAND_COLORS = {
  primary: '#D946EF',      // Tortoise Fuchsia
  slate: '#334155',        // Deep Slate
  softGrey: '#F8FAFC',     // Soft Grey (backgrounds)
  success: '#10B981',      // Accent Green
} as const;

export const BRAND_TAGLINE = 'Steady progress. Lasting results.';

export const BRAND_NAME = 'TortoiseAI';

export const BRAND_DOMAIN = 'tortoiseai.co.uk';

// Patient, encouraging loading messages
export const LOADING_MESSAGES = {
  analyzing: 'Building your analysis carefully...',
  generating: 'Taking our time to get this right...',
  processing: 'Steady progress on your request...',
  saving: 'Carefully saving your work...',
} as const;

// Encouraging success messages
export const SUCCESS_MESSAGES = {
  analysisComplete: 'Analysis complete! Built with care.',
  wbsGenerated: 'WBS generated successfully. Take your time reviewing.',
  saved: 'Safely saved. Your work is secure.',
} as const;

// Patient, helpful error messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Let\'s take a moment and try again.',
  upload: 'File upload issue. No rush - check the format and try again.',
  api: 'Connection issue. We\'ll wait for you to try again when ready.',
} as const;

// Brand voice guidelines (as constants for reference)
export const VOICE_PRINCIPLES = {
  DO: [
    'Be patient and methodical',
    'Focus on quality over speed',
    'Use clear, jargon-free language',
    'Encourage steady progress',
    'Show expertise humbly',
  ],
  DONT: [
    'Rush or create urgency',
    'Overwhelm with features',
    'Use flashy or gimmicky language',
    'Be condescending',
  ],
} as const;

// Animation/transition timings (smooth and deliberate)
export const TRANSITIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;
