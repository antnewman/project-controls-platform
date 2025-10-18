// Core type definitions for the Project Controls Intelligence Platform

export interface Risk {
  id: string;
  description: string;
  mitigation: string;
  probability: number; // 1-5
  impact: number; // 1-5
  category?: string;
  owner?: string;
  score?: number; // probability * impact
  qualityScore?: number; // 1-10 from AI analysis
  suggestions?: string[];
}

export interface Heuristic {
  id: string;
  name: string;
  description: string;
  rule: string;
  category: 'description' | 'mitigation' | 'scoring' | 'completeness';
}

export interface WBSActivity {
  id: string;
  name: string;
  duration: number;
  unit: 'days' | 'weeks' | 'months';
  dependencies: string[];
  resources?: string[];
  milestone: boolean;
  phase: string;
}

export interface WBSPhase {
  id: string;
  name: string;
  activities: WBSActivity[];
}

export interface Project {
  id: string;
  name: string;
  type: 'risk-analysis' | 'wbs' | 'integrated';
  created_at: string;
  updated_at: string;
  data?: unknown;
}

export interface AnalysisResult {
  overallScore: number;
  risks: Risk[];
  summary: string;
  recommendations: string[];
}

// Component prop types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface FileUploadResult {
  data: unknown[];
  fileName: string;
  headers: string[];
}

// ============================================
// CHALLENGE 4: LESSONS LIBRARY TYPES
// ============================================

// Lesson Types for Challenge 4
export interface Lesson {
  id: string
  title: string
  description: string
  category: LessonCategory
  source: string // e.g., "Gateway Review - Project Alpha"
  sourceType: 'gateway_review' | 'nista' | 'project_closure' | 'assurance_report'
  dateIdentified: string
  projectName?: string
  projectType?: string

  // What happened
  context: string

  // What went wrong/right
  observation: string

  // Why it matters
  impact: string

  // What to do differently
  recommendation: string

  // How to apply this lesson
  actionableSteps?: string[]

  // Metadata
  tags: string[]
  relatedPhases?: string[] // Links to WBS phases
  relatedRiskCategories?: string[] // Links to risk categories
  applicability: 'universal' | 'sector_specific' | 'project_specific'
  sector?: string

  // Quality metrics
  confidence: number // 1-10 score on lesson quality
  timesApplied?: number
  effectiveness?: number // If tracked

  // AI-generated insights
  aiSummary?: string
  similarLessons?: string[] // IDs of related lessons
}

export type LessonCategory =
  | 'Procurement'
  | 'Governance'
  | 'Resourcing'
  | 'Risk Management'
  | 'Delivery & Execution'
  | 'Stakeholder Management'
  | 'Technical'
  | 'Commercial'
  | 'Quality'
  | 'Schedule'
  | 'Budget & Finance'
  | 'Communication'
  | 'Change Management'
  | 'Compliance'

export interface LessonSearchFilters {
  category?: LessonCategory[]
  tags?: string[]
  sector?: string[]
  projectType?: string[]
  sourceType?: string[]
  dateRange?: {
    start: string
    end: string
  }
  applicability?: Lesson['applicability'][]
  minConfidence?: number
}

export interface ExtractedLesson {
  rawText: string
  extractedLesson: Partial<Lesson>
  confidence: number
  needsReview: boolean
}

export interface DocumentAnalysis {
  documentName: string
  documentType: string
  extractedLessons: ExtractedLesson[]
  summary: string
  keyThemes: string[]
  processingTime: number
}
