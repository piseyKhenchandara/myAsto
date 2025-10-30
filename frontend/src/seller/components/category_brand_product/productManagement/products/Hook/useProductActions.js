import { useState } from 'react';
import { createProduct } from '../../../../../../api/Product.api';


export const useProductActions = (category_slug, brand_slug, getProducts, setMessage) => {
  const [submit, setSubmit] = useState({ process: false, formName: '' });
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState({ open: false, formName: '' });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Validate form data
  const validateProduct = (formData) => {
    if (!formData.name.trim()) return "Product name is required.";
    if (!formData.price || Number.isNaN(Number(formData.price))) return "Valid price is required.";

    const validStockValues = ['Available', 'Low Stock', 'Out of Stock'];
    if (!formData.stock || !validStockValues.includes(formData.stock)) {
      return "Valid stock status is required.";
    }

    if (!brand_slug) return "Brand is required.";
    if (!category_slug) return "Category is required.";
    if (!formData.files || formData.files.length === 0) return 'At least one image is required!';
    return "";
  };

  // Upload product
  const uploadProduct = async (formData) => {
    const validationError = validateProduct(formData);
    if (validationError) {
      setMessage({ text: validationError, type: 'error' });
      return;
    }

    try {
      const payload = {
        ...formData,
        brand_slug,
        category_slug,
      };

      setSubmit({ process: true, formName: 'add' });
      setProgress(0);

      await createProduct(payload, (evt) => {
        if (!evt.total) return;
        const pct = Math.round((evt.loaded * 100) / evt.total);
        setProgress(pct);
      });

      setMessage({ text: 'Product uploaded successfully!', type: 'success' });

      setTimeout(() => {
        setOpen({ open: false, formName: '' });
        setMessage({ text: '', type: '' });
      }, 1500);

      await getProducts();
    } catch (error) {
      setMessage({
        text: error.response?.data.message || "Upload failed!",
        type: 'error'
      });
    } finally {
      setSubmit({ process: false, formName: '' });
    }
  };

  // Delete product
  const deleteProductWrapper = async () => {
    try {
      setSubmit({ process: true, formName: 'delete' });
      await deleteProduct(selectedProductId);
      setMessage({ text: 'Product deleted successfully!', type: 'success' });
      await getProducts();

      setTimeout(() => {
        handleClose();
        setSubmit({ process: false, formName: '' });
      }, 1500);
    } catch (error) {
      setMessage({
        text: error?.response?.data?.message || 'Failed to delete product',
        type: 'error'
      });
      setSubmit({ process: false, formName: '' });
    }
  };

  // Event handlers
  const handleOpen = () => setOpen({ open: true, formName: 'add' });

  const handleOpenDelete = (product) => {
    setSelectedProductId(product.id);
    setSelectedProduct(product);
    setOpen({ open: true, formName: 'delete' });
  };

  const handleClose = () => {
    setOpen({ open: false, formName: '' });
    setMessage({ text: '', type: '' });
  };

  return {
    submit,
    progress,
    open,
    selectedProduct,
    uploadProduct,
    deleteProductWrapper,
    handleOpen,
    handleOpenDelete,
    handleClose
  };
};