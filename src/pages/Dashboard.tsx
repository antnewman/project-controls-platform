import { FolderOpen } from 'lucide-react';
import Card from '../components/common/Card';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">View and manage your saved projects</p>
      </div>

      <Card className="text-center py-16">
        <FolderOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No Projects Yet</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Your saved projects will appear here. Start by creating a risk analysis or WBS to see them listed.
        </p>
      </Card>
    </div>
  );
}
