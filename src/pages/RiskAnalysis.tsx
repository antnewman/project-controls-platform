import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import FileUpload from '../components/common/FileUpload';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import type { Risk } from '../lib/types';
import { parseRisksFromCSV } from '../lib/utils';
import { useRiskAnalysis } from '../hooks/useRiskAnalysis';
import { DEFAULT_HEURISTICS } from '../lib/mockData';

export default function RiskAnalysis() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const { loading, error, result, analyze } = useRiskAnalysis();

  const handleFileUpload = (uploadResult: { data: unknown[] }) => {
    const parsedRisks = parseRisksFromCSV(uploadResult.data);
    setRisks(parsedRisks);
  };

  const handleAnalyze = async () => {
    if (risks.length === 0) return;
    await analyze(risks, DEFAULT_HEURISTICS);
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="h-8 w-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-slate-700">Risk Analysis</h1>
        </div>
        <p className="text-slate-600">
          Take your time to thoroughly analyze your risk register with AI-powered SME heuristics
        </p>
      </div>

      <div className="space-y-6">
        <Card header={<h2 className="text-xl font-semibold text-slate-700">Upload Risk Register</h2>}>
          <FileUpload onUpload={handleFileUpload} />
          {risks.length > 0 && (
            <div className="mt-4">
              <Alert type="success">
                Successfully loaded {risks.length} risks. Ready to analyze when you are.
              </Alert>
            </div>
          )}
        </Card>

        {risks.length > 0 && !result && (
          <Card>
            <div className="text-center space-y-4">
              <p className="text-slate-600">
                {risks.length} risks are ready for analysis. Take your time reviewing before proceeding.
              </p>
              <Button onClick={handleAnalyze} loading={loading} disabled={loading}>
                Begin Analysis
              </Button>
            </div>
          </Card>
        )}

        {loading && (
          <Card>
            <LoadingSpinner text="Building your analysis carefully..." />
          </Card>
        )}

        {error && (
          <Alert type="error" dismissible>
            {error}
          </Alert>
        )}

        {result && (
          <Card header={<h2 className="text-xl font-semibold text-slate-700">Analysis Results</h2>}>
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <div className="text-sm text-slate-600 mb-1">Overall Quality Score</div>
                <div className="text-3xl font-bold text-primary-600">{result.overallScore}/10</div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Summary</h3>
                <p className="text-slate-600">{result.summary}</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Recommendations</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-slate-600">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
