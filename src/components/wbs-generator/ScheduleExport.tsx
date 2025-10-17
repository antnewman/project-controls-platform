import { Download, Printer, RefreshCw } from 'lucide-react';
import type { WBSPhase } from '../../lib/types';

interface ScheduleExportProps {
  phases: WBSPhase[];
  projectName: string;
  onRegenerate: () => void;
}

export function ScheduleExport({ phases, projectName, onRegenerate }: ScheduleExportProps) {
  const exportToCSV = () => {
    const rows = [
      ['Project', projectName],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Activity ID', 'Activity Name', 'Duration', 'Unit', 'Phase', 'Milestone', 'Dependencies', 'Resources']
    ];

    phases.forEach(phase => {
      phase.activities.forEach(activity => {
        rows.push([
          activity.id,
          activity.name,
          activity.duration.toString(),
          activity.unit,
          phase.name,
          activity.milestone ? 'Yes' : 'No',
          activity.dependencies.join('; '),
          activity.resources ? activity.resources.join('; ') : ''
        ]);
      });
    });

    const csv = rows.map(row =>
      row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${projectName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-wbs-${new Date().toISOString().split('T')[0]}.csv`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Export & Actions</h3>

      <div className="space-y-3">
        <button
          onClick={exportToCSV}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export as CSV
        </button>

        <button
          onClick={handlePrint}
          className="w-full border-2 border-primary-500 text-primary-500 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-5 h-5" />
          Print Schedule
        </button>

        <button
          onClick={onRegenerate}
          className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Start New Project
        </button>
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <p className="text-sm font-medium text-slate-700 mb-2">Export Options:</p>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li><strong>CSV:</strong> Import into MS Project, Excel, or other tools</li>
          <li><strong>Print:</strong> Generate PDF using browser print dialog</li>
        </ul>
      </div>
    </div>
  );
}
