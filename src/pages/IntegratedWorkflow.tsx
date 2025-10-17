import React, { useState } from 'react';
import {
  Workflow,
  FileText,
  Network,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Download,
  Loader2
} from 'lucide-react';
import { generateWBS, identifyRisksFromWBS, analyzeRisks } from '../lib/anthropic';
import { DEFAULT_HEURISTICS } from '../lib/mockData';
import type { WBSPhase, Risk, AnalysisResult } from '../lib/types';

export default function IntegratedWorkflow() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Project input
  const [projectName, setProjectName] = useState('');
  const [narrative, setNarrative] = useState('');
  const [template, setTemplate] = useState('');

  // Step 2: Generated WBS
  const [wbsPhases, setWbsPhases] = useState<WBSPhase[]>([]);

  // Step 3: Identified risks
  const [identifiedRisks, setIdentifiedRisks] = useState<Risk[]>([]);

  // Step 4: Analysis results
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);

  const handleGenerateWBS = async () => {
    if (!narrative.trim()) return;

    setLoading(true);
    try {
      const phases = await generateWBS(narrative, template);
      setWbsPhases(phases);
      setStep(2);
    } catch (error) {
      console.error('WBS generation failed:', error);
      alert('Failed to generate WBS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleIdentifyRisks = async () => {
    setLoading(true);
    try {
      const risks = await identifyRisksFromWBS(wbsPhases, projectName);
      setIdentifiedRisks(risks);
      setStep(3);
    } catch (error) {
      console.error('Risk identification failed:', error);
      alert('Failed to identify risks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeRisks = async () => {
    setLoading(true);
    try {
      const results = await analyzeRisks(identifiedRisks, DEFAULT_HEURISTICS);
      setAnalysisResults(results);
      setStep(4);
    } catch (error) {
      console.error('Risk analysis failed:', error);
      alert('Failed to analyze risks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setProjectName('');
    setNarrative('');
    setTemplate('');
    setWbsPhases([]);
    setIdentifiedRisks([]);
    setAnalysisResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-primary-100 rounded-2xl mb-4">
              <Workflow className="w-12 h-12 text-primary-500" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Integrated Workflow
            </h1>
            <p className="text-xl text-slate-600">
              Complete end-to-end project planning. Build it step by step, methodically.
            </p>
          </div>

          {/* Progress Stepper */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4">
              {[
                { num: 1, label: 'Project Input', icon: FileText },
                { num: 2, label: 'Generate WBS', icon: Network },
                { num: 3, label: 'Identify Risks', icon: AlertTriangle },
                { num: 4, label: 'Analyze Quality', icon: CheckCircle }
              ].map((s, idx) => (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s.num
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      {step > s.num ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        s.num
                      )}
                    </div>
                    <span className={`text-sm mt-2 font-medium ${
                      step >= s.num ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 3 && (
                    <div className={`w-16 h-1 mb-6 transition-all ${
                      step > s.num ? 'bg-primary-500' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* STEP 1: Project Input */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-primary-500" />
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Step 1: Describe Your Project
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Office Building Construction"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    placeholder="Describe your project in detail. Include objectives, deliverables, timeline, and any specific requirements..."
                    className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    The more detail you provide, the better the WBS and risk identification will be.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Template (Optional)
                  </label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Custom</option>
                    <option value="construction">Construction Project</option>
                    <option value="software">Software Development</option>
                    <option value="research">Research Project</option>
                  </select>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleGenerateWBS}
                    disabled={!projectName.trim() || !narrative.trim() || loading}
                    className="bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating WBS...
                      </>
                    ) : (
                      <>
                        Generate WBS
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: View Generated WBS */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Network className="w-6 h-6 text-primary-500" />
                    <h2 className="text-2xl font-semibold text-slate-900">
                      Step 2: Review Work Breakdown Structure
                    </h2>
                  </div>
                  <div className="text-sm text-slate-500">
                    {wbsPhases.length} phases, {wbsPhases.reduce((sum, p) => sum + p.activities.length, 0)} activities
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {wbsPhases.map((phase, idx) => (
                    <div key={phase.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">
                          {idx + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">{phase.name}</h3>
                        <span className="text-sm text-slate-500">({phase.activities.length} activities)</span>
                      </div>
                      <div className="ml-11 space-y-2">
                        {phase.activities.map(activity => (
                          <div key={activity.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-600">{activity.id}</span>
                              <span className="text-slate-900">{activity.name}</span>
                              {activity.milestone && (
                                <span className="px-2 py-0.5 bg-success text-white text-xs rounded-full">Milestone</span>
                              )}
                            </div>
                            <span className="text-sm text-slate-600">{activity.duration} {activity.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Back to Edit
                  </button>
                  <button
                    onClick={handleIdentifyRisks}
                    disabled={loading}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Identifying Risks...
                      </>
                    ) : (
                      <>
                        Identify Risks
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: View Identified Risks */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-primary-500" />
                    <h2 className="text-2xl font-semibold text-slate-900">
                      Step 3: Review Identified Risks
                    </h2>
                  </div>
                  <div className="text-sm text-slate-500">
                    {identifiedRisks.length} risks identified
                  </div>
                </div>

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primary-900">
                    <strong>AI-Generated Risks:</strong> Based on your WBS, we've identified potential risks for each phase and activity. Review these before analysis.
                  </p>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {identifiedRisks.map((risk) => (
                    <div key={risk.id} className="border border-slate-200 rounded-lg p-4 bg-white hover:border-primary-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{risk.id}</h4>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                            P: {risk.probability}
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            I: {risk.impact}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm mb-2">{risk.description}</p>
                      <p className="text-slate-600 text-sm">
                        <strong className="text-slate-700">Mitigation:</strong> {risk.mitigation}
                      </p>
                      {risk.category && (
                        <div className="mt-2">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                            {risk.category}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Back to WBS
                  </button>
                  <button
                    onClick={handleAnalyzeRisks}
                    disabled={loading}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Quality...
                      </>
                    ) : (
                      <>
                        Analyze Risk Quality
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: View Analysis Results */}
            {step === 4 && analysisResults && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Step 4: Complete Project Plan
                  </h2>
                </div>

                {/* Overall Summary */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {wbsPhases.length}
                    </div>
                    <div className="text-sm text-slate-700">Project Phases</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {identifiedRisks.length}
                    </div>
                    <div className="text-sm text-slate-700">Risks Identified</div>
                  </div>
                  <div className="bg-gradient-to-br from-success/10 to-success/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-success mb-2">
                      {analysisResults.overallScore}/10
                    </div>
                    <div className="text-sm text-slate-700">Quality Score</div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Executive Summary</h3>
                  <p className="text-slate-700 mb-4">{analysisResults.summary}</p>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Key Recommendations:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {analysisResults.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-slate-600">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* High Priority Risks */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Risks Needing Attention</h3>
                  <div className="space-y-3">
                    {analysisResults.risks
                      .filter(r => (r.qualityScore || 0) < 7)
                      .slice(0, 5)
                      .map(risk => (
                        <div key={risk.id} className="border-l-4 border-red-500 bg-red-50 rounded-r-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-slate-900">{risk.id}</h4>
                            <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                              Score: {risk.qualityScore}/10
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 mb-2">{risk.description}</p>
                          {risk.suggestions && risk.suggestions.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-slate-700 mb-1">Improvements needed:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {risk.suggestions.map((s, idx) => (
                                  <li key={idx} className="text-sm text-slate-600">{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleReset}
                    className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Start New Project
                  </button>
                  <button
                    onClick={() => {
                      alert('Export functionality - download WBS + Risk Register as Excel/CSV');
                    }}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Export Project Plan
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-slate-500 italic">
            Steady progress. Lasting results.
          </div>
        </div>
      </div>
    </div>
  );
}
