import { Download, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { AnalysisResult } from '../../lib/types';

interface RiskResultsViewProps {
  results: AnalysisResult;
  onReset: () => void;
}

export function RiskResultsView({ results, onReset }: RiskResultsViewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-success text-white';
    if (score >= 5) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <TrendingUp className="w-5 h-5" />;
    if (score >= 5) return <Minus className="w-5 h-5" />;
    return <TrendingDown className="w-5 h-5" />;
  };

  const getOverallScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-500';
  };

  const handleExport = () => {
    // Build CSV content
    const rows = [
      [
        'Risk ID',
        'Description',
        'Mitigation',
        'Probability',
        'Impact',
        'Risk Score',
        'Quality Score',
        'Category',
        'Owner',
        'Suggestions',
      ],
    ];

    results.risks.forEach((risk) => {
      rows.push([
        risk.id,
        `"${risk.description.replace(/"/g, '""')}"`,
        `"${risk.mitigation.replace(/"/g, '""')}"`,
        risk.probability.toString(),
        risk.impact.toString(),
        (risk.probability * risk.impact).toString(),
        (risk.qualityScore || 0).toString(),
        risk.category || '',
        risk.owner || '',
        `"${(risk.suggestions || []).join('; ').replace(/"/g, '""')}"`,
      ]);
    });

    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `risk-analysis-results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Calculate statistics
  const highPriorityCount = results.risks.filter(r => r.probability * r.impact >= 12).length;
  const needsImprovementCount = results.risks.filter(r => (r.qualityScore || 0) < 6).length;

  return (
    <div className="space-y-8">
      {/* Overall Score Section */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-slate-900 mb-4">
            Overall Risk Quality Score
          </h3>
          <div className={`text-7xl font-bold ${getOverallScoreColor(results.overallScore)} mb-4`}>
            {results.overallScore}
            <span className="text-3xl text-slate-400">/10</span>
          </div>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            {results.summary}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-slate-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-primary-500">{results.risks.length}</div>
            <div className="text-sm text-slate-600 mt-1">Total Risks Analyzed</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-500">{highPriorityCount}</div>
            <div className="text-sm text-slate-600 mt-1">High Priority Risks</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600">{needsImprovementCount}</div>
            <div className="text-sm text-slate-600 mt-1">Need Improvement</div>
          </div>
        </div>

        {/* Recommendations */}
        {results.recommendations && results.recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-3">Key Recommendations</h4>
            <ul className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Individual Risk Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Individual Risk Analysis</h3>
          <div className="text-sm text-slate-600">
            Showing all {results.risks.length} risks
          </div>
        </div>

        {results.risks.map((risk) => (
          <div
            key={risk.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-slate-900 text-lg">{risk.id}</h4>
                  {risk.category && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                      {risk.category}
                    </span>
                  )}
                  {risk.probability * risk.impact >= 12 && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                      High Priority
                    </span>
                  )}
                </div>
                <p className="text-slate-700 leading-relaxed">{risk.description}</p>
              </div>
              <div className={`flex-shrink-0 ml-4 px-4 py-2 rounded-lg ${getScoreColor(risk.qualityScore || 0)} flex items-center gap-2`}>
                {getScoreIcon(risk.qualityScore || 0)}
                <div className="text-center">
                  <div className="text-2xl font-bold">{risk.qualityScore || 0}</div>
                  <div className="text-xs opacity-90">Quality</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Mitigation Plan</p>
                <p className="text-sm text-slate-700">{risk.mitigation}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Probability:</span>
                  <span className="font-medium text-slate-900">{risk.probability}/5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Impact:</span>
                  <span className="font-medium text-slate-900">{risk.impact}/5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Risk Score:</span>
                  <span className="font-bold text-slate-900">{risk.probability * risk.impact}</span>
                </div>
                {risk.owner && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Owner:</span>
                    <span className="font-medium text-slate-900">{risk.owner}</span>
                  </div>
                )}
              </div>
            </div>

            {risk.suggestions && risk.suggestions.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  {risk.suggestions[0].startsWith('✓') ? 'Assessment:' : 'Suggested Improvements:'}
                </p>
                <ul className="space-y-2">
                  {risk.suggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-2 text-sm p-2 rounded ${
                        suggestion.startsWith('✓')
                          ? 'bg-green-50 text-green-800'
                          : suggestion.startsWith('⚠️')
                          ? 'bg-red-50 text-red-800 font-medium'
                          : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="flex-shrink-0 mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleExport}
          className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export Enhanced Risk Register
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Analyze New Risks
        </button>
      </div>
    </div>
  );
}
