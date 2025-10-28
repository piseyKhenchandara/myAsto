import React, { useState } from 'react';
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const ProductImageSection = ({ 
    existingImages, 
    setExistingImages, 
    finalImages, 
    setFinalImages,
    productDetail 
}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    // Image replacement handler
    const handleImageReplacement = (e, idx) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        
        // Store the replacement
        setFinalImages(prev => ({
            ...prev,
            [idx]: { file, previewUrl }
        }));

        // Update the display
        setExistingImages(prev => prev.map((img, index) => 
            index === idx ? { ...img, image_url: previewUrl, isReplaced: true } : img
        ));
    };

    const cancelImageReplacement = (idx) => {
        // Remove from replacements
        setFinalImages(prev => {
            const updated = { ...prev };
            delete updated[idx];
            return updated;
        });

        // Restore original image
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