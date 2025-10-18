import { useState, useRef } from 'react';
import type { WBSPhase } from '../lib/types';
import { generateWBS } from '../lib/anthropic';

export function useWBSGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wbs, setWbs] = useState<WBSPhase[] | null>(null);
  const latestRequestRef = useRef(0);

  const generate = async (narrative: string, template?: string) => {
    if (!narrative.trim()) {
      setError('Please provide a project narrative');
      return null;
    }

    // Track this request
    const currentRequest = ++latestRequestRef.current;

    setLoading(true);
    setError(null);

    try {
      const result = await generateWBS(narrative, template);

      // Only update state if this is still the latest request
      if (currentRequest === latestRequestRef.current) {
        setWbs(result);
      }
      return result;
    } catch (err) {
      if (currentRequest === latestRequestRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate WBS';
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (currentRequest === latestRequestRef.current) {
        setLoading(false);
      }
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
