import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import Papa from 'papaparse';
import type { FileUploadResult } from '../../lib/types';
import Alert from './Alert';

interface FileUploadProps {
  onUpload: (result: FileUploadResult) => void;
  accept?: string;
  maxPreviewRows?: number;
}

export default function FileUpload({ onUpload, accept = '.csv', maxPreviewRows = 5 }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<unknown[]>([]);

  const handleFile = useCallback(
    (selectedFile: File) => {
      setError('');
      setFile(selectedFile);

      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }

      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError(`CSV parsing error: ${results.errors[0].message}`);
            return;
          }

          const headers = results.meta.fields || [];
          const data = results.data;

          setPreview(data.slice(0, maxPreviewRows));

          onUpload({
            data,
            fileName: selectedFile.name,
            headers,
          });
        },
        error: (err) => {
          setError(`Error reading file: ${err.message}`);
        },
      });
    },
    [onUpload, maxPreviewRows]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  const clearFile = () => {
    setFile(null);
    setPreview([]);
    setError('');
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-primary-600 hover:text-primary-700">
              Click to upload
            </span>{' '}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">CSV files only</p>
        </label>
      </div>

      {error && (
        <Alert type="error" dismissible onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}

      {file && !error && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">{file.name}</span>
            </div>
            <button
              onClick={clearFile}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {preview.length > 0 && (
            <div className="border border-gray-200 rounded overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(preview[0] as Record<string, unknown>).map((header) => (
                      <th
                        key={header}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row as Record<string, unknown>).map((value, cellIdx) => (
                        <td key={cellIdx} className="px-3 py-2 whitespace-nowrap text-gray-900">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
