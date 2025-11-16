import { useState } from 'react';
import { 
  getBrandsByCategoryAPI, 
  uploadBrandsAPI, 
  updateBrandAPI, 
  deleteBrandAPI 
} from '../../../../../api/BrandProduct.api';

export const useBrandOperations = (category_slug) => {
    
  const [brands, setBrands] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [submit, setSubmit] = useState({ formName: '', process: false });
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const [open, setOpen] = useState({ formName: '', open: false });
  const [selectedBrandId, setSelectedBrandId] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showname, setShowName] = useState('');

  const getBrandsByCategory = async () => {
    try {
      setLoading(true);
      const brands = await getBrandsByCategoryAPI(category_slug);
      
      const brandData = brands.brands || brands || [];
      setBrands(brandData);
      
      return brandData;
    } catch (error) {
      setMsg({
        type: 'error', 
        text: error.response?.data.message || "Failed to fetch brands by category"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const uploadBrand = async (e) => {
    e.preventDefault();

    if (!name || !file) {
      return setMsg({ type: 'error', text: "All fields are required!" });
    }        

    try {
      setMsg({ type: '', text: '' });
      setSubmit({ formName: 'add', process: true });
      setProgress(0);

      await uploadBrandsAPI({
        brand_name: name,
        file,
        category_slug: category_slug,
        onProgress: (evt) => {
          const percentage = Math.round((evt.loaded * 100) / evt.total);
          setProgress(percentage);
          return percentage;
        }
      });

      setMsg({ type: "success", text: "Brand uploaded successfully! ✅" });
      await getBrandsByCategory();
      setTimeout(() => {
        resetForm();
      }, 1500);

      return true;
    } catch (error) {
      setMsg({
        type: 'error', 
        text: error.response?.data.message || "Failed to upload brand to database"
      });
      return false;
    } finally {
      setSubmit({ formName: '', process: false });
    }
  };

  const updateBrand = async (e, selectedBrandId) => {
    e.preventDefault();
    setSubmit({formName : '', process : false});
    try {
      setSubmit({ formName: 'edit', process: true });

      await updateBrandAPI({
        brand_name: name || null,
        file: file || null,
        id: selectedBrandId,
        onUploadProgress: (evt) => {
          if (!evt) return;
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress(pct);
          return pct;
        }
      });

      setMsg({ type: 'success', text: "Brand updated successfully! ✅" });
      await getBrandsByCategory();
      setTimeout(() => {
        resetForm();
      }, 1500);

      return true;
    } catch (error) {
      setMsg({
        type: 'error', 
        text: error.response?.data.message || "Failed to update brand"
      });
      return false;
    } finally {
      setSubmit({ formName: '', process: false });
    }
  };

  const deleteBrand = async (selectedBrandId) => {
    try {
      setSubmit({ formName: 'delete', process: true });

      await deleteBrandAPI({ id: selectedBrandId });

      setMsg({ type: 'success', text: 'Brand deleted successfully ✅' });
      await getBrandsByCategory();
      setTimeout(() => {
        resetForm();
      }, 1500);

      return true;
    } catch (error) {
      setMsg({ 
        type: 'error', 
        text: error.response?.data?.message || error.message 
      });
      return false;
    } finally {
      setSubmit({ formName: '', process: false });
    }
  };

  const resetForm = () => {
    setName('');
    setFile(null);
    setMsg({ type: '', text: '' });
    setSubmit({ formName: '', process: false });
    setProgress(0);
    setOpen({ formName: '', open: false });
  };

  const handleOpenAdd = () => {
    setOpen({ formName: 'add', open: true });
  };

  const handleOpenEdit = (brand) => {
    setSelectedBrandId(brand.id);
    setOpen({ formName: 'edit', open: true });
    setSelectedBrand(brand);
    setName(brand.name || '');
  };

  const handleOpenDelete = (brand) => {
    setSelectedBrandId(brand.id);
    setOpen({ formName: 'delete', open: true });
    setSelectedBrand(brand);
  };

  const handleClose = () => {
    setOpen({ formName: '', open: false });
    setSelectedBrandId(0);
    setSelectedBrand(null);
    resetForm();
  };

  return {
    brands,
    msg,
    submit,
    loading,
    name,
    setName,
    file,
    setFile,
    progress,
    getBrandsByCategory,
    uploadBrand,
    updateBrand,
    deleteBrand,
    resetForm,

    open,
    selectedBrandId,
    selectedBrand,
    showname,
    setShowName,
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDelete,
    handleClose,
  };
};