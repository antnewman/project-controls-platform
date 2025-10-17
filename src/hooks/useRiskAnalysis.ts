import { useState } from 'react';
import type { Risk, Heuristic, AnalysisResult } from '../lib/types';
import { analyzeRisks } from '../lib/anthropic';

export function useRiskAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async (risks: Risk[], heuristics: Heuristic[]) => {
    setLoading(true);
    setError(null);

    try {
      const analysisResult = await analyzeRisks(risks, heuristics);
      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze risks';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    loading,
    error,
    result,
    analyze,
    reset,
  };
}
