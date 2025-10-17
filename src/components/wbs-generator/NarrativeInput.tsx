import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';

interface NarrativeInputProps {
  onGenerate: (narrative: string, template: string, projectName: string, duration: string) => void;
  loading: boolean;
}

export function NarrativeInput({ onGenerate, loading }: NarrativeInputProps) {
  const [narrative, setNarrative] = useState('');
  const [template, setTemplate] = useState('');
  const [projectName, setProjectName] = useState('');
  const [duration, setDuration] = useState('');

  const handleGenerate = () => {
    if (narrative.trim() && projectName.trim()) {
      onGenerate(narrative, template, projectName, duration);
    }
  };

  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate);

    // Set example narratives based on template
    if (newTemplate === 'construction') {
      setNarrative(
        'We need to construct a new 3-story office building with modern amenities. ' +
        'The project includes site preparation, foundation work, structural build, MEP systems installation, ' +
        'and interior finishing. The building should meet LEED certification standards and include ' +
        'parking facilities for 100 vehicles. Total building area is approximately 50,000 square feet.'
      );
      if (!projectName) setProjectName('Office Building Construction');
      if (!duration) setDuration('9 months');
    } else if (newTemplate === 'software') {
      setNarrative(
        'Develop a web-based project management application with real-time collaboration features. ' +
        'The system should support task tracking, team communication, file sharing, and reporting. ' +
        'Must integrate with popular tools like Slack and Google Drive. Target launch is Q2 with ' +
        'mobile apps to follow. Expected user base of 10,000+ users.'
      );
      if (!projectName) setProjectName('Project Management Software');
      if (!duration) setDuration('6 months');
    } else if (newTemplate === 'research') {
      setNarrative(
        'Conduct a comprehensive study on the impact of AI adoption in project management. ' +
        'Research will include literature review, survey of 500+ project managers, statistical analysis, ' +
        'and case studies from 10 organizations. Results will be published in peer-reviewed journals ' +
        'and presented at industry conferences.'
      );
      if (!projectName) setProjectName('AI in Project Management Study');
      if (!duration) setDuration('12 months');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <FileText className="w-6 h-6 text-primary-500" />
        <h3 className="text-xl font-semibold text-slate-900">Project Description</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Project Template
        </label>
        <select
          value={template}
          onChange={(e) => handleTemplateChange(e.target.value)}
          disabled={loading}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100"
        >
          <option value="">Custom (Start from scratch)</option>
          <option value="construction">Construction Project</option>
          <option value="software">Software Development</option>
          <option value="research">Research Project</option>
        </select>
        <p className="text-xs text-slate-500 mt-1">
          Select a template to populate example content
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Describe Your Project
        </label>
        <textarea
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
          placeholder="Describe your project in detail. Include objectives, key deliverables, constraints, timeline expectations, and any specific requirements. The more detail you provide, the better the generated WBS will be.&#10;&#10;Example: 'We need to build a new e-commerce platform with inventory management, payment processing, and customer analytics. The system should handle 10,000 concurrent users and integrate with our existing ERP system. Launch target is Q3 2025...'"
          disabled={loading}
          className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100 resize-none"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-slate-500">
            {narrative.length} characters • Minimum 50 recommended
          </p>
          {narrative.length > 0 && narrative.length < 50 && (
            <p className="text-xs text-yellow-600 font-medium">
              Add more detail for better results
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g., E-Commerce Platform"
            disabled={loading}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estimated Duration
          </label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 6 months, 12 weeks"
            disabled={loading}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={handleGenerate}
          disabled={!narrative.trim() || !projectName.trim() || loading}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-3 transition-colors"
        >
          <Sparkles className="w-6 h-6" />
          {loading ? 'Generating WBS...' : 'Generate Work Breakdown Structure'}
        </button>
        {!projectName.trim() && narrative.trim() && (
          <p className="text-sm text-red-600 text-center mt-2">
            Please enter a project name
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-medium text-blue-900 mb-2">Tips for better results:</p>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Include project objectives and key deliverables</li>
          <li>Mention specific technologies, methods, or standards</li>
          <li>Describe any constraints (budget, timeline, resources)</li>
          <li>Note dependencies on other systems or teams</li>
        </ul>
      </div>
    </div>
  );
}
