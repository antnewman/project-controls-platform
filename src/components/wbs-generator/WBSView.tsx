import { Flag, Clock, ArrowRight, Package } from 'lucide-react';
import type { WBSPhase } from '../../lib/types';

interface WBSViewProps {
  phases: WBSPhase[];
  projectName: string;
}

export function WBSView({ phases, projectName }: WBSViewProps) {
  // Calculate total statistics
  const totalActivities = phases.reduce((sum, phase) => sum + phase.activities.length, 0);
  const totalMilestones = phases.reduce(
    (sum, phase) => sum + phase.activities.filter(a => a.milestone).length,
    0
  );

  // Calculate estimated duration (sum of activities without dependencies)
  const calculateTotalDuration = () => {
    let totalDays = 0;
    phases.forEach(phase => {
      phase.activities.forEach(activity => {
        // Convert to days
        let days = activity.duration;
        if (activity.unit === 'weeks') days *= 7;
        if (activity.unit === 'months') days *= 30;
        totalDays += days;
      });
    });

    // Return formatted duration
    if (totalDays > 60) {
      return `${Math.round(totalDays / 30)} months`;
    } else if (totalDays > 14) {
      return `${Math.round(totalDays / 7)} weeks`;
    } else {
      return `${totalDays} days`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h3 className="text-2xl font-semibold text-slate-900 mb-2">
          {projectName}
        </h3>
        <p className="text-slate-600">Work Breakdown Structure</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-primary-50 rounded-lg text-center">
          <div className="text-3xl font-bold text-primary-500">{phases.length}</div>
          <div className="text-sm text-slate-600 mt-1">Phases</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-500">{totalActivities}</div>
          <div className="text-sm text-slate-600 mt-1">Activities</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-500">{totalMilestones}</div>
          <div className="text-sm text-slate-600 mt-1">Milestones</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-500">{calculateTotalDuration()}</div>
          <div className="text-sm text-slate-600 mt-1">Est. Duration</div>
        </div>
      </div>

      {/* WBS Tree */}
      <div className="space-y-6">
        {phases.map((phase, phaseIdx) => (
          <div
            key={phase.id}
            className="border-2 border-slate-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors"
          >
            {/* Phase Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-500 font-bold text-lg">
                  {phaseIdx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white">
                    {phase.name}
                  </h4>
                  <p className="text-primary-100 text-sm">
                    {phase.activities.length} activities • {phase.activities.filter(a => a.milestone).length} milestones
                  </p>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Package className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Phase {phaseIdx + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Activities List */}
            <div className="p-4 space-y-2 bg-slate-50">
              {phase.activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg border-l-4 bg-white shadow-sm hover:shadow-md transition-shadow ${
                    activity.milestone
                      ? 'border-l-success bg-green-50'
                      : 'border-l-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Activity Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          {activity.id}
                        </span>
                        <h5 className="font-semibold text-slate-900">
                          {activity.name}
                        </h5>
                        {activity.milestone && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success text-white text-xs rounded-full font-medium">
                            <Flag className="w-3 h-3" />
                            Milestone
                          </span>
                        )}
                      </div>

                      {/* Dependencies */}
                      {activity.dependencies.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                          <ArrowRight className="w-4 h-4" />
                          <span className="text-xs">
                            Depends on: <span className="font-mono font-medium">{activity.dependencies.join(', ')}</span>
                          </span>
                        </div>
                      )}

                      {/* Resources */}
                      {activity.resources && activity.resources.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {activity.resources.map((resource, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {resource}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">
                          {activity.duration}
                        </div>
                        <div className="text-xs text-slate-600">
                          {activity.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> This WBS is AI-generated based on your project description.
          You may need to adjust activities, dependencies, and durations based on your specific
          project requirements and organizational standards.
        </p>
      </div>
    </div>
  );
}
