import { useState } from 'react';
import type { WBSPhase } from '../lib/types';
import { generateWBS } from '../lib/anthropic';

export function useWBSGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wbs, setWbs] = useState<WBSPhase[] | null>(null);

  const generate = async (narrative: string, template?: string) => {
    if (!narrative.trim()) {
      setError('Please provide a project narrative');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateWBS(narrative, template);
      setWbs(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate WBS';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setWbs(null);
    setError(null);
  };

  return {
    loading,
    error,
    wbs,
    generate,
    reset,
  };
}
