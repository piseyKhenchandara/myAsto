import { useState } from 'react';
import {
  uploadCategoriesAPI,
  getCategoriesAPI,
  deleteCategoryAPI,
  editCategoryAPI,
} from '../../../../api/CategoryProduct.api.js';

export const useCategoryOperations = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [submit, setSubmit] = useState({ formName: '', process: false });
  const [progress, setProgress] = useState(0);

  const [open, setOpen] = useState({ formName: '', open: false });
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesAPI();
      setCategories(data);
    } catch (error) {
      setMsg({
        type: 'error',
        text: error.response?.data.message || "Failed to fetch categories"
      });
    }
  };

  const uploadCategories = async (e) => {
    e.preventDefault();
    if (!name || !file) {
      return setMsg({ type: 'error', text: 'Both fields are required' });
    }
    setProgress(0);

    try {
      setSubmit({ formName: 'add', process: true });
      await uploadCategoriesAPI({
        name,
        file,
        onProgress: (evt) => {
          const percentage = Math.round((evt.loaded * 100) / evt.total);
          setProgress(percentage);
        }
      });
      await fetchCategories();
      setMsg({ type: 'success', text: 'Category uploaded successfully ✅' });
      setTimeout(() => {
        resetForm();

      },1500)

      return true;
    } catch (error) {
      setMsg({
        type: 'error',
        text: error.response?.data?.message || "Failed to upload category"
      });
      return false;
    } finally {
      setSubmit({ formName: '', process: false });
    }
  };

  const updateCategory = async (e, id) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setProgress(0);
    setSubmit({ formName: 'edit', process: true });

    try {
      await editCategoryAPI(name, id, file, (evt) => {
        if (!evt) return;
        const pct = Math.round((evt.loaded * 100) / evt.total);
        setProgress(pct);
        return pct;
      });
      setMsg({ type: 'success', text: 'Category updated successfully ✅' });
       setTimeout(() => {
        resetForm();

      },1500)

      await fetchCategories();
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

  const deleteCate = async (id) => {
    try {
      setSubmit({ formName: 'delete', process: true });
      await deleteCategoryAPI(id);
      setMsg({ type: 'success', text: 'Category deleted successfully ✅' });
       setTimeout(() => {
        resetForm();

      },1500)

      await fetchCategories();
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

  const handleClose = () => {
    setOpen({ formName: '', open: false });
    setSelectedCategoryId(null);
    setSelectedCategory(null);
    resetForm();
  };


  return {
    categories,
    name,
    setName,
    file,
    setFile,
    msg,
    submit,
    progress,
    fetchCategories,
    uploadCategories,
    updateCategory,
    deleteCate,
    resetForm,

    open,
    selectedCategoryId,
    selectedCategory,
    handleOpenAdd,
    handleClose,
  };
};