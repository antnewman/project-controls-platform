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
