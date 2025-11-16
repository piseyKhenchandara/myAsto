import React, { useEffect, useState } from 'react'
import { getProductDetail, updateProduct } from '../../../../../api/Product.api';
import { useParams, useNavigate } from 'react-router-dom';
import { CiTrash } from "react-icons/ci";
import ProductImageSection from './ProductImageSectoin';

const ProductEdit = () => {
    const [productDetail, setProductDetail] = useState(null);
    const [load, setLoad] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [msg, setMsg] = useState({type: '', text: ''});

    // Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState('');
    const [warranty, setWarranty] = useState('');
    const [features, setFeatures] = useState([
        { feature_name: "", feature_value: "" },
    ]);

    // Image handling states
    const [existingImages, setExistingImages] = useState([]);
    const [finalImages, setFinalImages] = useState({});

    const { id, category_slug, brand_slug } = useParams();
    const navigate = useNavigate();

    const fetchProductDetail = async () => {
        try {
            setLoad(true);
            setMsg({type: '', text: ""});
            const data = await getProductDetail(id);
            setProductDetail(data || null);
            
            setName(data.name || '');
            setPrice(data.price?.toString() || '');
            setStock(data.stock?.toString() || '');
            setDescription(data.description || '');
            setWarranty(data.warranty || '');
            setFeatures(data.ProductFeatures?.length > 0 ? data.ProductFeatures : [{ feature_name: "", feature_value: "" }]);
            setExistingImages(data.ProductImages || []);

        } catch (error) {
            setMsg({type: 'error', text: error?.response?.data?.message || "Failed to fetch product detail"});
        } finally {
            setLoad(false);
        }
    }

    // Form validation
    const validateForm = () => {
        if (!name.trim()) {
            setMsg({type: 'error', text: 'Product name is required'});
            return false;
        }
        if (!description.trim()) {
            setMsg({type: 'error', text: 'Product description is required'});
            return false;
        }
        if (!price || isNaN(price) || parseFloat(price) <= 0) {
            setMsg({type: 'error', text: 'Valid price is required'});
            return false;
        }
        if (!stock.trim()) {
            setMsg({type: 'error', text: 'Stock information is required'});
            return false;
        }

        // Validate features - only check filled features
        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            if (feature.feature_name?.trim() || feature.feature_value?.trim()) {
                if (!feature.feature_name?.trim() || !feature.feature_value?.trim()) {
                    setMsg({type: 'error', text: `Feature ${i + 1} must have both name and value`});
                    return false;
                }
            }
        }

        return true;
    };
    
    const editProduct = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setSubmitLoading(true);
        setMsg({type: '', text: ''});

        try {
            // Filter out empty features
            const validFeatures = features.filter(f => 
                f.feature_name?.trim() && f.feature_value?.trim()
            );
            
            // Prepare files array: send replacement files OR original files
            const filesToSend = await Promise.all(
                existingImages.map(async (img, idx) => {
                    // If image was replaced, send the new file
                    if (finalImages[idx]) {
                        return finalImages[idx].file;
                    }
                    
                    // If image wasn't replaced, fetch and send the original file
                    try {
                        const response = await fetch(img.image_url);
                        const blob = await response.blob();
                        
                        // Extract filename from URL or use default
                        const urlParts = img.image_url.split('/');
                        const filename = urlParts[urlParts.length - 1] || `image_${idx}.jpg`;
                        
                        // Create File object from blob
                        const file = new File([blob], filename, { type: blob.type });
                        return file;
                    } catch (error) {
                        console.error(`Failed to fetch image ${idx}:`, error);
                        return null;
                    }
                })
            );

            // Filter out any null values (failed fetches)
            const files = filesToSend.filter(file => file !== null);

            const payload = {
                id,
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                stock: stock.trim(),
                warranty: warranty.trim(),
                features: validFeatures,
                files: files
            } 
            
            console.log('Submitting payload:', payload);
            console.log('Files to send:', files.map(f => f.name));
            
            await updateProduct(payload);
            
            setMsg({type: 'success', text: 'Product updated successfully!'});
            
           /*  // Optionally navigate back after success
            setTimeout(() => {
                if (category_slug && brand_slug) {
                    navigate(`/dashboard/category/${category_slug}/brand/${brand_slug}/product/detail/${product.id}/${product.slug}`);
                } else {
                    navigate(-1);
                }
            }, 1500); */

        } catch (error) {
            console.error('Update error:', error);
            setMsg({type: 'error', text: error.response?.data?.message || "Failed to update product!"});
        } finally {
            setSubmitLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            fetchProductDetail();
        }
    }, [id]);

    const handleAddNewRow = () => {
        setFeatures(prev => [...prev, {feature_name: '', feature_value: ''}]);
    }

    const setFeatureForm = (idx, field, value) => {
        setFeatures(prev => {
            const next = [...prev];
            next[idx] = {...next[idx], [field]: value};
            return next;
        });
    }

    const removeFeatureRow = (idx) => {
        setFeatures(prev => prev.filter((_, i) => i !== idx));
    }

    if (load) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!productDetail) {
        return <p className='text-gray-500 text-center'>Product not found</p>;
    }

    return (
        <div className='w-full p-2 sm:p-4 flex flex-col lg:flex-row lg:justify-center gap-3 sm:gap-5'>
            {/* Images Section */}
            <ProductImageSection 
                existingImages={existingImages}
                setExistingImages={setExistingImages}
                finalImages={finalImages}
                setFinalImages={setFinalImages}
                productDetail={productDetail}
            />

            {/* Product Info Section */}
            <div className='w-full lg:w-[55%]'>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h4 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h4>
                    
                    <form onSubmit={editProduct} className='flex flex-col gap-6'>
                        {/* Basic Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name *
                                </label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price ($) *
                                </label>
                                <input 
                                    type="number"
                                    value={price}
                                    step="0.01"
                                    min="0"
                                    onChange={(e) => setPrice(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Status *
                                </label>
                                <select
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                                    required
                                >
                                    <option value="">Select stock status</option>
                                    <option value="Available">Available</option>
                                    <option value="Low Stock">Low Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                    <option value="Discontinued">Discontinued</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Warranty
                                </label>
                                <input 
                                    type="text"
                                    value={warranty}
                                    onChange={(e) => setWarranty(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                                    placeholder="e.g., 1 year, 6 months, none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                                placeholder="Enter product description"
                                required
                            />
                        </div>
                        
                        {/* Features Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-md font-medium text-gray-700">Product Features</h4>
                                <button 
                                    type="button"
                                    onClick={handleAddNewRow}
                                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
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
                                            className="text-red-500 hover:text-red-700 p-2"
                                        >
                                            <CiTrash className="text-xl" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Message Display */}
                        {msg.text && (
                            <div className={`p-3 rounded ${
                                msg.type === 'success' 
                                    ? 'bg-green-100 text-green-700 border border-green-300' 
                                    : 'bg-red-100 text-red-700 border border-red-300'
                            }`}>
                                {msg.text}
                            </div>
                        )}
                        
                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                disabled={submitLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitLoading ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProductEdit;