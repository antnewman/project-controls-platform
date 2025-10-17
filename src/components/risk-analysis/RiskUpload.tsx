import { useCallback, useState } from 'react';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import type { Risk } from '../../lib/types';

interface RiskUploadProps {
  onUploadSuccess: (risks: Risk[]) => void;
}

export function RiskUpload({ onUploadSuccess }: RiskUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);

  const normalizeColumnName = (name: string): string => {
    return name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  };

  const findColumn = (headers: string[], possibleNames: string[]): string | undefined => {
    const normalized = headers.map(h => ({ original: h, normalized: normalizeColumnName(h) }));
    for (const name of possibleNames) {
      const found = normalized.find(h => h.normalized === normalizeColumnName(name));
      if (found) return found.original;
    }
    return undefined;
  };

  const parseCSV = useCallback((file: File) => {
    setParsing(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            throw new Error(`CSV parsing errors: ${results.errors[0].message}`);
          }

          const data = results.data as Record<string, string>[];
          if (data.length === 0) {
            throw new Error('CSV file is empty');
          }

          const headers = Object.keys(data[0]);

          // Find required columns with flexible naming
          const idColumn = findColumn(headers, ['riskid', 'id', 'risk_id', 'risk']);
          const descColumn = findColumn(headers, ['description', 'riskdescription', 'risk_description', 'desc']);
          const mitigationColumn = findColumn(headers, ['mitigation', 'mitigationplan', 'mitigation_plan', 'response', 'action']);
          const probabilityColumn = findColumn(headers, ['probability', 'likelihood', 'prob']);
          const impactColumn = findColumn(headers, ['impact', 'severity', 'consequence']);

          if (!idColumn || !descColumn || !mitigationColumn || !probabilityColumn || !impactColumn) {
            const missing = [];
            if (!idColumn) missing.push('Risk ID/ID');
            if (!descColumn) missing.push('Description');
            if (!mitigationColumn) missing.push('Mitigation');
            if (!probabilityColumn) missing.push('Probability/Likelihood');
            if (!impactColumn) missing.push('Impact/Severity');
            throw new Error(`Missing required columns: ${missing.join(', ')}`);
          }

          // Optional columns
          const categoryColumn = findColumn(headers, ['category', 'type', 'risk_category']);
          const ownerColumn = findColumn(headers, ['owner', 'responsible', 'assignee']);

          // Parse risks
          const risks: Risk[] = data.map((row, index) => {
            const id = row[idColumn] || `R${index + 1}`;
            const description = row[descColumn] || '';
            const mitigation = row[mitigationColumn] || '';

            // Parse probability and impact (convert to 1-5 if needed)
            let probability = parseInt(row[probabilityColumn]);
            let impact = parseInt(row[impactColumn]);

            // Handle different scales (e.g., percentages or 1-10 scale)
            if (probability > 5) probability = Math.min(5, Math.ceil(probability / 20));
            if (impact > 5) impact = Math.min(5, Math.ceil(impact / 20));

            // Ensure values are in 1-5 range
            probability = Math.max(1, Math.min(5, probability || 3));
            impact = Math.max(1, Math.min(5, impact || 3));

            const category = categoryColumn ? row[categoryColumn] : undefined;
            const owner = ownerColumn ? row[ownerColumn] : undefined;

            return {
              id,
              description,
              mitigation,
              probability,
              impact,
              category,
              owner,
              score: probability * impact,
            };
          }).filter(risk => risk.description.trim().length > 0); // Remove empty risks

          if (risks.length === 0) {
            throw new Error('No valid risks found in CSV file');
          }

          setUploadedFile(file.name);
          onUploadSuccess(risks);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
        } finally {
          setParsing(false);
        }
      },
      error: (error) => {
        setError(`Failed to read CSV file: ${error.message}`);
        setParsing(false);
      },
    });
  }, [onUploadSuccess]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    parseCSV(file);
  }, [parseCSV]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    parseCSV(file);
  }, [parseCSV]);

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">
        Step 1: Upload Risk Register
      </h3>

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadedFile ? (
          <div className="space-y-4">
            <FileCheck className="w-16 h-16 text-success mx-auto" />
            <div>
              <p className="text-lg font-medium text-slate-900">{uploadedFile}</p>
              <p className="text-sm text-slate-600 mt-1">File uploaded successfully</p>
            </div>
            <label className="inline-block">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={parsing}
              />
              <span className="text-sm text-primary-500 hover:text-primary-600 cursor-pointer font-medium">
                Upload a different file
              </span>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className={`w-16 h-16 mx-auto ${isDragging ? 'text-primary-500' : 'text-slate-400'}`} />
            <div>
              <p className="text-lg font-medium text-slate-900 mb-2">
                {parsing ? 'Parsing CSV...' : 'Drop your CSV file here'}
              </p>
              <p className="text-sm text-slate-600 mb-4">
                or click to browse
              </p>
              <label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={parsing}
                />
                <span className="inline-block bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white px-6 py-2 rounded-lg cursor-pointer font-medium">
                  {parsing ? 'Parsing...' : 'Select CSV File'}
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <p className="text-sm font-medium text-slate-700 mb-2">Required CSV Columns:</p>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li><strong>Risk ID</strong> or <strong>ID</strong> - Unique identifier</li>
          <li><strong>Description</strong> - Risk description</li>
          <li><strong>Mitigation</strong> - Mitigation plan or response</li>
          <li><strong>Probability</strong> or <strong>Likelihood</strong> - Rating from 1-5</li>
          <li><strong>Impact</strong> or <strong>Severity</strong> - Rating from 1-5</li>
        </ul>
        <p className="text-sm text-slate-500 mt-3">
          Optional: Category, Owner/Responsible
        </p>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Upload Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
