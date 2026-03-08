import React, { useState } from 'react';
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const ProductImageSection = ({
    existingImages,
    setExistingImages,
    finalImages,
    setFinalImages,
    additionalImages,
    setAdditionalImages,
    productDetail
}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    const handleAddMoreImages = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const valid = files.filter(f => {
            if (!f.type.startsWith('image/')) { alert(`${f.name} is not an image`); return false; }
            if (f.size > 5 * 1024 * 1024) { alert(`${f.name} exceeds 5MB`); return false; }
            return true;
        });

        const newEntries = valid.map(f => ({ file: f, previewUrl: URL.createObjectURL(f) }));
        setAdditionalImages(prev => [...prev, ...newEntries]);
        e.target.value = '';
    };

    const removeAdditionalImage = (idx) => {
        setAdditionalImages(prev => {
            URL.revokeObjectURL(prev[idx].previewUrl);
            return prev.filter((_, i) => i !== idx);
        });
    };

    const handleImageReplacement = (e, idx) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }
        const previewUrl = URL.createObjectURL(file);

        setFinalImages(prev => ({
            ...prev,
            [idx]: { file, previewUrl }
        }));

        setExistingImages(prev => prev.map((img, index) => 
            index === idx ? { ...img, image_url: previewUrl, isReplaced: true } : img
        ));
    };

    const cancelImageReplacement = (idx) => {
        setFinalImages(prev => {
            const updated = { ...prev };
            delete updated[idx];
            return updated;
        });

        if (productDetail?.ProductImages?.[idx]) {
            setExistingImages(prev => prev.map((img, index) => 
                index === idx ? { ...productDetail.ProductImages[idx], isReplaced: false } : img
            ));
        }
    };

    return (
        <section className='flex flex-col md:flex-row gap-4 lg:gap-6 w-full lg:w-[45%]'>
            <div className="w-full space-y-6">
                <header className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Product Images</h3>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-gray-800 px-3 py-1 border rounded"
                    >
                        ← Back
                    </button>
                </header>
                
                {existingImages.length > 0 ? (
                    <div className="space-y-4">
                        {/* Current Images Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {existingImages.map((img, idx) => (
                                <figure key={idx} className="relative group border rounded-lg p-2 bg-white shadow-sm">
                                    <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                                        <img 
                                            src={img.image_url} 
                                            alt={`Product ${idx + 1}`}
                                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => setSelectedImage(img)}
                                        />
                                    </div>
                                    
                                    {/* Replace Button */}
                                    <div className="absolute -top-2 -right-2">
                                        <div className="relative">
                                            <MdOutlineSwapHorizontalCircle className="text-2xl text-green-500 bg-white rounded-full cursor-pointer hover:text-green-600 border border-gray-200 shadow-sm" />
                                            <input 
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => handleImageReplacement(e, idx)}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Cancel replacement button */}
                                    {img.isReplaced && (
                                        <button
                                            type="button"
                                            onClick={() => cancelImageReplacement(idx)}
                                            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    
                                    {/* Main image indicator */}
                                    {img.is_main && (
                                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                            Main
                                        </span>
                                    )}

                                    {/* Replacement indicator */}
                                    {img.isReplaced && (
                                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                            New
                                        </span>
                                    )}
                                </figure>
                            ))}
                        </div>

                        {/* Replacement Summary */}
                        {Object.keys(finalImages).length > 0 && (
                            <aside className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="text-md font-medium text-green-800 mb-2">Images to be replaced:</h4>
                                <ul className="text-sm text-green-700">
                                    {Object.keys(finalImages).map(idx => (
                                        <li key={idx}>
                                            • Image {parseInt(idx) + 1}: {finalImages[idx].file.name}
                                        </li>
                                    ))}
                                </ul>
                            </aside>
                        )}

                        {/* Add More Images */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-gray-700">Add more images</span>
                                <label className="cursor-pointer bg-green-500 text-white text-xs px-3 py-1.5 rounded hover:bg-green-600 transition-colors">
                                    + Choose Files
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleAddMoreImages}
                                    />
                                </label>
                            </div>

                            {additionalImages.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {additionalImages.map((item, idx) => (
                                        <figure key={idx} className="relative border rounded-lg p-1 bg-white shadow-sm">
                                            <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                                                <img
                                                    src={item.previewUrl}
                                                    alt={`New ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAdditionalImage(idx)}
                                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                            <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                                New
                                            </span>
                                        </figure>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-2">No new images selected</p>
                            )}
                        </div>

                        {/* Selected Image Preview */}
                        {selectedImage && (
                            <aside className="mt-6">
                                <h4 className="text-md font-medium text-gray-600 mb-3">Image Preview</h4>
                                <figure className="bg-gray-50 rounded-lg p-4 text-center">
                                    <img 
                                        src={selectedImage.image_url} 
                                        alt="Preview"
                                        className="max-h-64 mx-auto object-contain rounded shadow-sm"
                                    />
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Close Preview
                                    </button>
                                </figure>
                            </aside>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No images available for this product</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductImageSection;