import { useState } from 'react';
import type { Risk, Heuristic, AnalysisResult } from '../lib/types';
import { analyzeRisks } from '../lib/anthropic';

export function useRiskAnalysis() {
  const [step, setStep] = useState(1);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [selectedHeuristics, setSelectedHeuristics] = useState<Heuristic[]>([]);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (parsedRisks: Risk[]) => {
    setRisks(parsedRisks);
    setError(null);
    setStep(2);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const analysisResults = await analyzeRisks(risks, selectedHeuristics);
      setResults(analysisResults);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setRisks([]);
    setSelectedHeuristics([]);
    setResults(null);
    setError(null);
  };

  return {
    step,
    risks,
    selectedHeuristics,
    results,
    loading,
    error,
    handleFileUpload,
    handleAnalyze,
    setSelectedHeuristics,
    setStep,
    reset,
  };
}
