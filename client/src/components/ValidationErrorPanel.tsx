import React from 'react';

interface ValidationError {
  row: number | string;
  errors: string[];
}

interface ValidationErrorPanelProps {
  errors: ValidationError[];
}

const ValidationErrorPanel: React.FC<ValidationErrorPanelProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="mt-4 max-w-7xl mx-auto border border-red-300 bg-red-50 p-4 rounded">
      <h3 className="text-red-700 font-semibold mb-2">
        Validation Errors ({errors.length})
      </h3>
      <div className="overflow-auto max-h-64">
        <table className="w-full text-sm">
          <thead className="bg-red-100 sticky top-0 z-10">
            <tr className="text-left font-medium border-b">
              <th className="pr-4">Row</th>
              <th>Errors</th>
            </tr>
          </thead>
          <tbody>
            {errors.map(({ row, errors }, i) => (
              <tr key={i} className="border-b last:border-0 align-top">
                <td className="pr-4 text-red-700 font-mono">{row}</td>
                <td className="text-red-600">{errors.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidationErrorPanel;
