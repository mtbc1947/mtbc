import React from 'react';

interface EditFormFieldsProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const EditFormFields: React.FC<EditFormFieldsProps> = ({ data, onChange }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 capitalize">{key}</label>
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(key, e.target.value)}
            className="mt-1 p-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200"
          />
        </div>
      ))}
    </div>
  );
};

export default EditFormFields;
