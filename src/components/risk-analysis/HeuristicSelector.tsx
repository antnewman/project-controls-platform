import { useState } from 'react';
import { CheckCircle2, Circle, Plus, X } from 'lucide-react';
import type { Heuristic } from '../../lib/types';
import { DEFAULT_HEURISTICS } from '../../lib/mockData';

interface HeuristicSelectorProps {
  selectedHeuristics: Heuristic[];
  onSelectionChange: (heuristics: Heuristic[]) => void;
  onContinue: () => void;
  risksCount: number;
}

export function HeuristicSelector({
  selectedHeuristics,
  onSelectionChange,
  onContinue,
  risksCount,
}: HeuristicSelectorProps) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customCategory, setCustomCategory] = useState<Heuristic['category']>('description');

  const getCategoryColor = (category: Heuristic['category']) => {
    switch (category) {
      case 'description':
        return 'bg-blue-100 text-blue-700';
      case 'mitigation':
        return 'bg-green-100 text-green-700';
      case 'scoring':
        return 'bg-purple-100 text-purple-700';
      case 'completeness':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const toggleHeuristic = (heuristic: Heuristic) => {
    const isSelected = selectedHeuristics.some(h => h.id === heuristic.id);
    if (isSelected) {
      onSelectionChange(selectedHeuristics.filter(h => h.id !== heuristic.id));
    } else {
      onSelectionChange([...selectedHeuristics, heuristic]);
    }
  };

  const addCustomHeuristic = () => {
    if (!customName.trim() || !customDescription.trim()) return;

    const newHeuristic: Heuristic = {
      id: `custom-${Date.now()}`,
      name: customName,
      description: customDescription,
      rule: customDescription,
      category: customCategory,
    };

    onSelectionChange([...selectedHeuristics, newHeuristic]);
    setCustomName('');
    setCustomDescription('');
    setCustomCategory('description');
    setShowCustomForm(false);
  };

  const selectAll = () => {
    const allHeuristics = [...DEFAULT_HEURISTICS];
    // Add any custom heuristics that aren't in defaults
    selectedHeuristics.forEach(h => {
      if (h.id.startsWith('custom-') && !allHeuristics.some(ah => ah.id === h.id)) {
        allHeuristics.push(h);
      }
    });
    onSelectionChange(allHeuristics);
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  // Get all heuristics (defaults + custom)
  const allHeuristics = [...DEFAULT_HEURISTICS];
  selectedHeuristics.forEach(h => {
    if (h.id.startsWith('custom-') && !allHeuristics.some(ah => ah.id === h.id)) {
      allHeuristics.push(h);
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">
            Step 2: Select Analysis Heuristics
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Analyzing {risksCount} risk{risksCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-500">
            {selectedHeuristics.length}
          </p>
          <p className="text-sm text-slate-600">selected</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={selectAll}
          className="text-sm text-primary-500 hover:text-primary-600 font-medium"
        >
          Select All
        </button>
        <span className="text-slate-300">|</span>
        <button
          onClick={deselectAll}
          className="text-sm text-slate-500 hover:text-slate-600 font-medium"
        >
          Deselect All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {allHeuristics.map((heuristic) => {
          const isSelected = selectedHeuristics.some(h => h.id === heuristic.id);
          const isCustom = heuristic.id.startsWith('custom-');

          return (
            <div
              key={heuristic.id}
              onClick={() => toggleHeuristic(heuristic)}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-slate-900">
                      {heuristic.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(heuristic.category)}`}>
                      {heuristic.category}
                    </span>
                    {isCustom && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {heuristic.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCustomForm ? (
        <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-slate-900">Add Custom Heuristic</h4>
            <button
              onClick={() => setShowCustomForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Heuristic Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., Timeline Feasibility"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Describe what this heuristic checks for..."
                rows={3}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as Heuristic['category'])}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="description">Description</option>
                <option value="mitigation">Mitigation</option>
                <option value="scoring">Scoring</option>
                <option value="completeness">Completeness</option>
              </select>
            </div>
            <button
              onClick={addCustomHeuristic}
              disabled={!customName.trim() || !customDescription.trim()}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium"
            >
              Add Heuristic
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowCustomForm(true)}
          className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Custom Heuristic</span>
        </button>
      )}

      <button
        onClick={onContinue}
        disabled={selectedHeuristics.length === 0}
        className="w-full mt-6 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium text-lg"
      >
        Analyze Risks with {selectedHeuristics.length} Heuristic{selectedHeuristics.length !== 1 ? 's' : ''}
      </button>
    </div>
  );
}
