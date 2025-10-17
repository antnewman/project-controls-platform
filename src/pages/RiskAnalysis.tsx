import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useRiskAnalysis } from '../hooks/useRiskAnalysis';
import { RiskUpload } from '../components/risk-analysis/RiskUpload';
import { HeuristicSelector } from '../components/risk-analysis/HeuristicSelector';
import { RiskResultsView } from '../components/risk-analysis/RiskResultsView';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { DEFAULT_HEURISTICS } from '../lib/mockData';

export default function RiskAnalysis() {
  const {
    step,
    risks,
    selectedHeuristics,
    results,
    loading,
    error,
    handleFileUpload,
    handleAnalyze,
    setSelectedHeuristics,
    reset,
  } = useRiskAnalysis();

  // Initialize with default heuristics when moving to step 2
  useEffect(() => {
    if (step === 2 && selectedHeuristics.length === 0) {
      setSelectedHeuristics(DEFAULT_HEURISTICS);
    }
  }, [step, selectedHeuristics.length, setSelectedHeuristics]);

  return (
    <div className="container py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="h-8 w-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-slate-900">Risk Analysis</h1>
        </div>
        <p className="text-slate-600">
          Upload your risk register, select analysis heuristics, and get AI-powered quality insights
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
          step >= 1 ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-500'
        }`}>
          1
        </div>
        <div className={`w-24 h-1 ${step >= 2 ? 'bg-primary-500' : 'bg-slate-200'}`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
          step >= 2 ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-500'
        }`}>
          2
        </div>
        <div className={`w-24 h-1 ${step >= 3 ? 'bg-primary-500' : 'bg-slate-200'}`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
          step >= 3 ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-500'
        }`}>
          3
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6">
          <Alert type="error" dismissible>
            {error}
          </Alert>
        </div>
      )}

      {/* Step 1: Upload Risk Register */}
      {step === 1 && (
        <RiskUpload onUploadSuccess={handleFileUpload} />
      )}

      {/* Step 2: Select Heuristics */}
      {step === 2 && (
        <HeuristicSelector
          selectedHeuristics={selectedHeuristics}
          onSelectionChange={setSelectedHeuristics}
          onContinue={handleAnalyze}
          risksCount={risks.length}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-md p-12">
          <LoadingSpinner text="Analyzing risks with AI-powered heuristics..." />
          <p className="text-center text-sm text-slate-600 mt-4">
            This may take a moment. We're evaluating {risks.length} risk{risks.length !== 1 ? 's' : ''} against {selectedHeuristics.length} heuristic{selectedHeuristics.length !== 1 ? 's' : ''}.
          </p>
        </div>
      )}

      {/* Step 3: View Results */}
      {step === 3 && results && !loading && (
        <RiskResultsView results={results} onReset={reset} />
      )}
    </div>
  );
}
