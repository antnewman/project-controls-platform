import type { Risk, WBSPhase, WBSActivity } from './types';

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

/**
 * Calculate risk score (probability × impact)
 */
export const calculateRiskScore = (probability: number, impact: number): number => {
  return probability * impact;
};

/**
 * Get risk severity level based on score
 */
export const getRiskSeverity = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score <= 5) return 'low';
  if (score <= 10) return 'medium';
  if (score <= 15) return 'high';
  return 'critical';
};

/**
 * Get color class for risk severity
 */
export const getRiskColor = (severity: string): string => {
  switch (severity) {
    case 'low':
      return 'text-green-700 bg-green-50 border-green-200';
    case 'medium':
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    case 'high':
      return 'text-orange-700 bg-orange-50 border-orange-200';
    case 'critical':
      return 'text-red-700 bg-red-50 border-red-200';
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200';
  }
};

/**
 * Convert CSV data to Risk objects
 */
export const parseRisksFromCSV = (data: unknown[]): Risk[] => {
  return (data as Record<string, unknown>[]).map((row, index) => {
    // Get category value - check both lowercase and capitalized versions
    const categoryValue = row.category !== undefined ? row.category : row.Category;
    const category = categoryValue !== undefined ? String(categoryValue) : 'General';

    return {
      id: `risk-${index + 1}`,
      description: String(row.description || row.Description || ''),
      mitigation: String(row.mitigation || row.Mitigation || ''),
      probability: Number(row.probability || row.Probability || 3),
      impact: Number(row.impact || row.Impact || 3),
      category,
      owner: String(row.owner || row.Owner || ''),
      score: calculateRiskScore(
        Number(row.probability || row.Probability || 3),
        Number(row.impact || row.Impact || 3)
      ),
    };
  });
};

/**
 * Export WBS to CSV format
 */
export const exportWBSToCSV = (phases: WBSPhase[]): string => {
  const headers = ['Phase', 'Activity', 'Duration', 'Unit', 'Dependencies', 'Resources', 'Milestone'];
  const rows: string[][] = [headers];

  phases.forEach((phase) => {
    phase.activities.forEach((activity) => {
      rows.push([
        phase.name,
        activity.name,
        String(activity.duration),
        activity.unit,
        activity.dependencies.join('; '),
        activity.resources?.join('; ') || '',
        activity.milestone ? 'Yes' : 'No',
      ]);
    });
  });

  return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
};

/**
 * Download data as CSV file
 */
export const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Calculate total duration for a WBS phase
 */
export const calculatePhaseDuration = (activities: WBSActivity[]): number => {
  // Simple sum - in reality would need critical path analysis
  return activities.reduce((sum, act) => {
    const days = act.unit === 'weeks' ? act.duration * 5 : act.unit === 'months' ? act.duration * 20 : act.duration;
    return sum + days;
  }, 0);
};

/**
 * Validate CSV headers for risk import
 */
export const validateRiskCSVHeaders = (headers: string[]): { valid: boolean; missing: string[] } => {
  const required = ['description', 'mitigation', 'probability', 'impact'];
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());

  const missing = required.filter((req) => !normalizedHeaders.includes(req));

  return {
    valid: missing.length === 0,
    missing,
  };
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function for search/input
 */
export const debounce = <T extends (...args: unknown[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Class name helper (simple version)
 */
export const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};
