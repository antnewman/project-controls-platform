import { Workflow } from 'lucide-react';
import Card from '../components/common/Card';

export default function IntegratedWorkflow() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Workflow className="h-8 w-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-slate-700">Integrated Workflow</h1>
        </div>
        <p className="text-slate-600">
          Complete end-to-end project planning workflow. Build it step by step, methodically.
        </p>
      </div>

      <Card>
        <div className="text-center py-12">
          <Workflow className="h-16 w-16 text-primary-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Coming Soon</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            The integrated workflow will guide you through: Generate WBS → Identify Risks → Analyze Quality.
            Take your time - we're building this carefully.
          </p>
        </div>
      </Card>
    </div>
  );
}
