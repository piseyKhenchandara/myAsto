
import React from 'react';
import { CiTrash } from "react-icons/ci";

const ProductFeaturesSection = ({ 
  features,
  handleAddNewRow,
  setFeatureForm,
  removeFeatureRow
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-medium text-gray-700">Product Features</h4>
        <button 
          type="button"
          onClick={handleAddNewRow}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 cursor-pointer transition-colors duration-200"
        >
          + Add Feature
        </button>
      </div>
      
      <div className="space-y-3">
        {features.map((feature, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              type="text"
              value={feature.feature_name || ''}
              onChange={(e) => setFeatureForm(idx, 'feature_name', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Feature name"
            />
            <input
              type="text"
              value={feature.feature_value || ''}
              onChange={(e) => setFeatureForm(idx, 'feature_value', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Feature value"
            />
            <button
              type="button"
              onClick={() => removeFeatureRow(idx)}
              className="text-red-500 hover:text-red-700 p-2 cursor-pointer transition-colors duration-200"
            >
              <CiTrash className="text-xl" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFeaturesSection;