import React, { useState, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useOutletContext, useParams } from "react-router-dom";
import { createProduct, getProductsByBrandNCategory, deleteProduct } from "../../../../api/Product.api";
import { getBrandsByCategoryAPI } from "../../../../api/BrandProduct.api";
import { getCategoriesAPI } from "../../../../api/CategoryProduct.api";

import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import Pagination from "./Pagination";
import ProductBanner from "./productBanner/ProductBanner";
import BrandManagement from "../brandManagement/BrandManagement";
import DeleteForm from "../DeleteForm";
import { useUser } from "../../../../../context/UserContext";
import BrandsHorizontally from "../brandManagement/BrandsHorizontally";

const Products = () => {
  const { visible = false } = useOutletContext() || {};
  const { category_slug, brand_slug } = useParams();
  const {user : whoami, loading : loadingUserRole} = useUser();

    
  // State
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [submit, setSubmit] = useState({ process: false, formName: '' });
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState({ open: false, formName: '' });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0, 
    totalPages: 0
  });

  // Fetch category and brand names for display
  const getBrandAndCategory = async () => {
    try {
      const categoryResponse = await getCategoriesAPI();
      const categories = categoryResponse.categories || categoryResponse || [];
      const currentCategory = categories.find(cat => cat.slug === category_slug);

      if (currentCategory) {
        setCategoryName(currentCategory.name);
      } else {
        return setMessage({ type: 'error', text: "Category not found!" });
      }

      const brandResponse = await getBrandsByCategoryAPI(category_slug);
      const brands = brandResponse.brands || brandResponse || [];
      const currentBrand = brands.find(brand => brand.slug === brand_slug);
      
      if (currentBrand) {
        setBrandName(currentBrand.name);
      } else {
        return setMessage({ type: 'error', text: "Brand not found!" });
      }
    } catch (error) {
      setMessage({
        text: error?.response?.data?.message || "Failed fetching brand/category data", 
        type: 'error'
      });
    }
  };

  // Fetch products
  const getProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsByBrandNCategory(
        category_slug,
        brand_slug,
        {
          page: pagination.page, 
          limit: pagination.limit
        }
      );
      
      setProducts(data.products || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalpages || 0
      }));
    } catch (error) {
      setMessage({
        text: error?.response?.data?.message || "Failed fetching data", 
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Effects
  useEffect(() => {
    if (category_slug && brand_slug) {
      getBrandAndCategory();
    }
  }, [category_slug, brand_slug]);

  useEffect(() => {
    if (category_slug && brand_slug) {
      getProducts();
    }
  }, [category_slug, brand_slug, pagination.page]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000); 
      
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  return (
    <div className="w-full min-h-screen">
      {loadingUserRole ? <p className="text-gray-300 text-center">loading permission...</p> : 
        <>
              {/* Top Context */}
          <ProductBanner />
          <BrandsHorizontally/>
       
          <BrandManagement brand_slug={brand_slug} visible={visible} />

          
          {(whoami?.role === 'admin' || whoami?.role === 'seller') && 
          <div className="px-6 bg-gray-200">
            <div className="flex justify-between items-center md:w-[50%] py-1">
              <h4>Products-section</h4>
              <button
                className="rounded-[10px] flex items-center shadow-md shadow-green-400 cursor-pointer transition duration-200 bg-green-500 hover:bg-green-500 text-white py-1 px-3 gap-2"
                onClick={handleOpen}
              >
                Add
                <IoIosAddCircleOutline className="text-2xl sm:text-3xl ml-1" />
              </button>
            </div>
          </div>
}
          {/* Products List */}
          <ProductList 
            products={products}
            loading={loading}
            visible={visible}
            category_slug={category_slug}
            brand_slug={brand_slug}
            onDelete={handleOpenDelete}
            message={message}
          />

          {/* Pagination */}
          <Pagination 
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />

          {/* Add Product Modal */}
          {open.open && open.formName === 'add' && (
            <ProductForm
              open={open}
              onClose={handleClose}
              onSubmit={uploadProduct}
              categoryName={categoryName}
              brandName={brandName}
              submit={submit}
              progress={progress}
              message={message}
            />
          )}

          {/* Delete Product Modal */}
          {open.open && open.formName === 'delete' && (
            <DeleteForm
              setOpen={handleClose}
              deleteCate={deleteProductWrapper}
              msg={message}
              name={selectedProduct?.name}
              submit={submit.process && submit.formName === 'delete'}
              typeData={selectedProduct}
            />
          )}
        </>
      }
    </div>
  );
};

export default Products;