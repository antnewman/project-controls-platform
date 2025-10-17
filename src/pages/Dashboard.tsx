import { FolderOpen } from 'lucide-react';
import Card from '../components/common/Card';

export default function Dashboard() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">View and manage your saved projects</p>
      </div>

      <Card className="text-center py-16">
        <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Yet</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Your saved projects will appear here. Start by creating a risk analysis or WBS to see them listed.
        </p>
      </Card>
    </div>
  );
}
