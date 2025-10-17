import { useState } from 'react';
import { Network } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { NarrativeInput } from '../components/wbs-generator/NarrativeInput';
import { WBSView } from '../components/wbs-generator/WBSView';
import { ScheduleExport } from '../components/wbs-generator/ScheduleExport';
import { useWBSGeneration } from '../hooks/useWBSGeneration';
import type { WBSPhase } from '../lib/types';

export default function WBSGenerator() {
  const [projectName, setProjectName] = useState('');
  const [wbs, setWbs] = useState<WBSPhase[] | null>(null);
  const { loading, error, generate } = useWBSGeneration();

  const handleGenerate = async (
    narrative: string,
    template: string,
    name: string,
    _duration: string
  ) => {
    setProjectName(name);
    const result = await generate(narrative, template);
    if (result) {
      setWbs(result);
    }
  };

  const handleRegenerate = () => {
    setWbs(null);
    setProjectName('');
  };

  return (
    <div className="container py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Network className="h-8 w-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-slate-900">WBS Generator</h1>
        </div>
        <p className="text-slate-600">
          Describe your project and let AI generate a comprehensive Work Breakdown Structure
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6">
          <Alert type="error" dismissible>
            {error}
          </Alert>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-md p-12">
          <LoadingSpinner text="Generating your Work Breakdown Structure..." />
          <p className="text-center text-sm text-slate-600 mt-4">
            Analyzing your project description and creating a detailed WBS with phases, activities, and dependencies.
          </p>
        </div>
      )}

      {/* Two-Panel Interface */}
      {!loading && !wbs && (
        <div className="grid grid-cols-1 gap-8">
          <NarrativeInput onGenerate={handleGenerate} loading={loading} />
        </div>
      )}

      {!loading && wbs && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - WBS Display (2/3 width) */}
          <div className="lg:col-span-2">
            <WBSView phases={wbs} projectName={projectName} />
          </div>

          {/* Right Panel - Export Options (1/3 width) */}
          <div className="lg:col-span-1">
            <ScheduleExport
              phases={wbs}
              projectName={projectName}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
