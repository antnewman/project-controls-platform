import { useState } from 'react';
import { Network, Download } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { useWBSGeneration } from '../hooks/useWBSGeneration';
import { exportWBSToCSV, downloadCSV } from '../lib/utils';

export default function WBSGenerator() {
  const [narrative, setNarrative] = useState('');
  const { loading, error, wbs, generate } = useWBSGeneration();

  const handleGenerate = async () => {
    await generate(narrative);
  };

  const handleExport = () => {
    if (!wbs) return;
    const csv = exportWBSToCSV(wbs);
    downloadCSV(csv, 'wbs-export.csv');
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Network className="h-8 w-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-slate-700">WBS Generator</h1>
        </div>
        <p className="text-slate-600">
          Transform your project narrative into a comprehensive Work Breakdown Structure. Take your time describing your project thoroughly.
        </p>
      </div>

      <div className="space-y-6">
        <Card header={<h2 className="text-xl font-semibold text-slate-700">Project Narrative</h2>}>
          <div className="space-y-4">
            <div>
              <label className="label">
                Describe your project in detail. Include objectives, scope, key deliverables, and any constraints.
              </label>
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                className="input min-h-[200px] resize-y"
                placeholder="Example: We are building a customer portal that will allow users to manage their accounts, view invoices, and submit support tickets. The project must be completed in 6 months with a team of 5 developers..."
              />
            </div>
            <Button
              onClick={handleGenerate}
              loading={loading}
              disabled={loading || !narrative.trim()}
            >
              Generate WBS
            </Button>
          </div>
        </Card>

        {loading && (
          <Card>
            <LoadingSpinner text="Carefully building your Work Breakdown Structure..." />
          </Card>
        )}

        {error && (
          <Alert type="error" dismissible>
            {error}
          </Alert>
        )}

        {wbs && (
          <Card
            header={
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-700">Generated WBS</h2>
                <Button size="sm" variant="outline" onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            }
          >
            <div className="space-y-6">
              {wbs.map((phase) => (
                <div key={phase.id} className="border-l-4 border-primary-500 pl-4">
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">{phase.name}</h3>
                  <div className="space-y-2">
                    {phase.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-slate-700">{activity.name}</div>
                            <div className="text-sm text-slate-500 mt-1">
                              {activity.duration} {activity.unit}
                              {activity.milestone && (
                                <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs">
                                  Milestone
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
