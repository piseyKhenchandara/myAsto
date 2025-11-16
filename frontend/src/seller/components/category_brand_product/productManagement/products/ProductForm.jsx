import React, { useState, useEffect } from 'react';
import { CiTrash } from 'react-icons/ci';

const ProductForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  categoryName, 
  brandName, 
  submit, 
  progress, 
  message 
}) => {
  const STORAGE_KEY = `product_feature_names_${categoryName}_${brandName}`;
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [warranty, setWarranty] = useState("");
  const [features, setFeatures] = useState([
    { feature_name: "", feature_value: "" },
  ]);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  // Load feature NAMES ONLY from localStorage when modal opens
  useEffect(() => {
    if (open.open) {
      const savedNames = localStorage.getItem(STORAGE_KEY);
      if (savedNames) {
        try {
          const names = JSON.parse(savedNames);
          setFeatures(names.map(name => ({
            feature_name: name,
            feature_value: ''
          })));
        } catch (error) {
          console.error('Failed to load feature names:', error);
        }
      }
    }
  }, [open.open, STORAGE_KEY]);

  // Save feature NAMES ONLY to localStorage whenever they change
  useEffect(() => {
    const names = features.map(f => f.feature_name).filter(n => n.trim());
    if (names.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    }
  }, [features, STORAGE_KEY]);

  // Reset values after successful submit
  useEffect(() => {
    if (message.type === 'success' && message.text) {
      resetFormValues();
    }
  }, [message]);

  const addNewRowFeature = () => {
    setFeatures(prev => [...prev, {feature_name: '', feature_value: ''}]);
  };

  const updateFeatureField = (index, field, value) => {
    setFeatures(prev => {      
      const next = [...prev];
      next[index] = {...next[index], [field]: value};
      return next;
    });
  };

  const removeFeatureRow = (index) => {
    setFeatures(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleImageFiles = (e) => {
    const getFiles = Array.from(e.target.files || []);
    if(getFiles.length > 5) {
      return;
    }
    setImageFiles(getFiles);
  };

  const handleVideoFiles = (e) => {
    const getFiles = Array.from(e.target.files || []);
    if(getFiles.length > 3) {
      return;
    }
    setVideoFiles(getFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      name,
      description,
      price,
      stock,
      warranty,
      features: features.filter(f => f.feature_name.trim() || f.feature_value.trim()),
      files: [...imageFiles, ...videoFiles],
    };
    
    onSubmit(formData);
  };

  // Reset only VALUES, keep feature NAMES
  const resetFormValues = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setWarranty('');
    setFeatures(prev => prev.map(f => ({
      feature_name: f.feature_name, 
      feature_value: ''
    })));
    setImageFiles([]);
    setVideoFiles([]);
  };


  const handleClose = () => {
    
    onClose();
  };

  const isProcessing = submit.process && submit.formName === 'add';

  if (!open.open) return null;

  return (
    <div className="fixed flex items-center justify-center inset-0 bg-black/50 z-50 p-4">
      <div className="bg-white rounded-[20px] shadow-lg shadow-green-600 py-4 px-6 sm:p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Product</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            disabled={isProcessing}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Context Display */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            Category: <b>{categoryName || "—"}</b>
          </span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            Brand: <b>{brandName || "—"}</b>
          </span>
        </div>

        {/* Message Display */}
        {message.text && (
          <p className={`mb-3 ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {message.text}
          </p>
        )}

        {/* Progress Bar */}
        {isProcessing && (
          <div className="w-full mb-3">
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className="h-2 rounded bg-green-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Uploading… {progress}%
            </div>
          </div>
        )}
        
        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2 outline-none focus:ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Logitech G102"
              disabled={isProcessing}
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded px-3 py-2 outline-none focus:ring"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 29.99"
                disabled={isProcessing}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Stock Status</label>
              <select
                className="w-full border rounded px-3 py-2 outline-none focus:ring"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                disabled={isProcessing}
                required
              >
                <option value="">Select status</option>
                <option value="Available">Available</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Warranty */}
          <div>
            <label className="block text-sm mb-1">Warranty</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 outline-none focus:ring"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              placeholder="e.g., 1 year, 6 months, none"
              disabled={isProcessing}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2 outline-none focus:ring min-h-[90px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short product description…"
              disabled={isProcessing}
            />
          </div>

          {/* Features */}
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <p>Features</p>
              <button 
                className="bg-green-600 px-2 py-2 text-xs text-white rounded-[10px] shadow-sm shadow-green-400 hover: hover:scale-105 transition-transform hover:cursor-pointer" 
                onClick={addNewRowFeature}
                disabled={isProcessing}
                type="button"
              > 
                + Add feature
              </button>
            </div>
            
            <div>
              {features.map((feature, index) => (
                <div className="grid grid-cols-10 gap-3 my-3" key={index}>
                  <input 
                    type="text"
                    placeholder="Feature name"
                    value={feature.feature_name}
                    onChange={(e) => updateFeatureField(index, "feature_name", e.target.value)}
                    className="border col-span-4 p-1 rounded"
                    disabled={isProcessing}
                    required   
                  />
                  <input 
                    type="text"
                    placeholder="Feature value"
                    value={feature.feature_value}
                    onChange={(e) => updateFeatureField(index, "feature_value", e.target.value)}
                    className="border col-span-4 p-1 rounded"
                    disabled={isProcessing}
                    required
                  />
                  <button 
                    className="col-span-2 text-red-600 border border-red-500 text-center flex items-center justify-center rounded hover:scale-105 transition-transform"  
                    onClick={() => removeFeatureRow(index)}
                    disabled={isProcessing}
                    type="button"
                    aria-label="Remove feature"
                  >
                    <CiTrash className="text-xl cursor-pointer"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Images */}
          <div className="mt-2">
            <label className="block text-sm mb-1">Images (Max 5)</label>
            <div className="relative">
              <button 
                type="button"
                className="bg-gray-300 hover:bg-gray-400 border-dashed border-2 relative flex flex-col justify-center items-center p-5 rounded-[15px] text-gray-700 w-full"
                disabled={isProcessing}
              >
                <h5>Choose images up to 5</h5>
                <p className="text-sm">image/jpeg, image/png, image/webp</p>
                
                <input 
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageFiles}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isProcessing}
                  required
                />
              </button>
              
              {imageFiles.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {imageFiles.length} file(s) selected: {imageFiles.map(f => f.name).join(", ")}
                </div>
              )}
            </div>
          </div>

          {/* Videos */}
          <div className="mt-2">
            <label className="block text-sm mb-1">Videos (Max 3)</label>
            <div className="relative">
              <button 
                type="button"
                className="bg-gray-300 hover:bg-gray-400 border-dashed border-2 relative flex flex-col justify-center items-center p-5 rounded-[15px] text-gray-700 w-full"
                disabled={isProcessing}
              >
                <h5>Choose videos up to 3</h5>
                <p className="text-sm">video/mp4, video/webm, video/ogg, video/mpeg, video/quicktime, video/avi</p>
                
                <input 
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoFiles}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isProcessing}
                />
              </button>
              
              {videoFiles.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {videoFiles.length} file(s) selected: {videoFiles.map(f => f.name).join(", ")}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className={`flex-1 px-4 py-2 rounded-lg transition duration-200 ${
                isProcessing 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer"
              }`}
              disabled={isProcessing}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className={`flex-1 px-4 py-2 rounded-lg transition duration-200 ${
                isProcessing 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : "bg-green-600 text-white hover: cursor-pointer"
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;