import { useState, useEffect } from 'react';

export const useProductForm = (productDetail) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState('');
    const [warranty, setWarranty] = useState('');
    const [features, setFeatures] = useState([
        { feature_name: "", feature_value: "" }
    ]);

    // Populate form when product data loads
    useEffect(() => {
        if (productDetail) {
        setName(productDetail.name || '');
        setPrice(productDetail.price?.toString() || '');
        setStock(productDetail.stock?.toString() || '');
        setDescription(productDetail.description || '');
        setWarranty(productDetail.warranty || '');
        setFeatures(
            productDetail.ProductFeatures?.length > 0 
            ? productDetail.ProductFeatures 
            : [{ feature_name: "", feature_value: "" }]
        );
        }
    }, [productDetail]);

    const handleAddNewRow = () => {
        setFeatures(prev => [...prev, { feature_name: '', feature_value: '' }]);
    };

    const setFeatureForm = (idx, field, value) => {
        setFeatures(prev => {
        const next = [...prev];
        next[idx] = { ...next[idx], [field]: value };
        return next;
        });
    };

    const removeFeatureRow = (idx) => {
        setFeatures(prev => prev.filter((_, i) => i !== idx));
    };

    const validateForm = () => {
        if (!name.trim()) {
        return { valid: false, error: 'Product name is required' };
        }
        if (!description.trim()) {
        return { valid: false, error: 'Product description is required' };
        }
        if (!price || isNaN(price) || parseFloat(price) <= 0) {
        return { valid: false, error: 'Valid price is required' };
        }
        if (!stock.trim()) {
        return { valid: false, error: 'Stock information is required' };
        }

        for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        if (feature.feature_name?.trim() || feature.feature_value?.trim()) {
            if (!feature.feature_name?.trim() || !feature.feature_value?.trim()) {
            return { valid: false, error: `Feature ${i + 1} must have both name and value` };
            }
        }
        }

            return { valid: true };
    };

    const getFormData = () => {
        const validFeatures = features.filter(f => 
        f.feature_name?.trim() && f.feature_value?.trim()
        );

        return {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        stock: stock.trim(),
        warranty: warranty.trim(),
        features: validFeatures
        };
    };

    return {
        // Form state
        name, setName,
        description, setDescription,
        price, setPrice,
        stock, setStock,
        warranty, setWarranty,
        features, setFeatures,
        
        // Feature handlers
        handleAddNewRow,
        setFeatureForm,
        removeFeatureRow,
        
        // Utilities
        validateForm,
        getFormData
    };
};