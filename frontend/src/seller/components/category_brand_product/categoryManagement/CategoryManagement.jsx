import React, { useEffect, useState } from "react";
import {
  uploadCategoriesAPI,
  getCategoriesAPI,
  deleteCategoryAPI,
  editCategoryAPI,
} from '../../../../api/CategoryProduct.api.js'
import { IoIosAddCircleOutline } from "react-icons/io";
import { useLocation, useOutletContext } from "react-router-dom";
import EditForm from "../EditForm.jsx";
import DeleteForm from "../DeleteForm";
import CarouselView from './CarouselView';
import AddREditForm from "../AddForm.jsx";
import { useUser } from "../../../../../context/UserContext.jsx";




const CategoryManagement = ({ category_slug }) => {
  const context = useOutletContext();
  const { visible = false } = context || {};
  
  const {user : whoami , loading : loadingUserRole} =useUser();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  

  const [open, setOpen] = useState({ formName: '', open: false });
  
 
  const [submit, setSubmit] = useState({ formName: '', process: false });
  const [progress, setProgress] = useState(0);
 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  
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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      
      let items;
      if (width < 480) {
        items = visible ? 2 : 3;
      } else if (width < 640) {
        items = visible ? 3 : 4;
      } else if (width < 768) {
        items = visible ? 4 : 5;
      } else if (width < 1024) {
        items = visible ? 4 : 6;
      } else if (width < 1280) {
        items = visible ? 5 : 8;
      } else if (width < 1536) {
        items = visible ? 6 : 10;
      } else {
        items = visible ? 8 : 12;
      }
      
      setItemsPerView(items);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [visible]);

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - itemsPerView));
  };

  const goToNext = () => {
    const maxIndex = Math.max(0, categories.length - itemsPerView);
    setCurrentIndex(prev => Math.min(maxIndex, prev + itemsPerView));
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex + itemsPerView < categories.length;




  const uploadCategories = async (e) => {
    e.preventDefault(); 
    if (!name || !file) return setMsg({ type: 'error', text: 'Both fields are required' });
    

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

      fetchCategories(); 
      
      setMsg({ type: 'success', text: 'Category uploaded successfully ✅' });
      setTimeout(() => {
        setName('');
        setFile(null);
        setOpen({ formName: '', open: false });
        setMsg({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMsg({
        type: 'error',
        text: error.response?.data?.message || "Failed to upload category"
      });
      
    }
    finally{
      setSubmit({ formName: '', process: false });
    }
  };

  const updateCategory = async (e, id) => {
    e.preventDefault();

    setMsg({ type: '', text: '' });
    setProgress(0);

    setSubmit({ formName: 'edit', process: true });

    try {
      await editCategoryAPI(
        name,
        id,
        file,
        (evt) => {
          if (!evt) return;
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress(pct);
          return pct;
        }
      );
      
      setMsg({ type: 'success', text: 'Category updated successfully ✅' });
      await fetchCategories();

      setTimeout(() => {
        setName('');
        setFile(null);
        setOpen({ formName: '', open: false });
        setSubmit({ formName: '', process: false });
      }, 1500);
    } catch (error) {
      setMsg({ 
        type: 'error', 
        text: error.response?.data?.message || error.message 
      });
      setSubmit({ formName: '', process: false });
    }
  };

  const deleteCate = async (id) => {
    try {
      setSubmit({ formName: 'delete', process: true });
      await deleteCategoryAPI(id);

      setMsg({ type: 'success', text: 'Category deleted successfully ✅' });
      await fetchCategories();

      setTimeout(() => {
        setOpen({ formName: '', open: false });
        setSubmit({ formName: '', process: false });
        setMsg({ type: '', text: '' });
      }, 1500);
    } catch (error) {
      setMsg({ 
        type: 'error', 
        text: error.response?.data?.message || error.message 
      });
      
    }
    finally{
      setSubmit({ formName: '', process: false });
    }
  };

  // Modal handlers
  const handleOpenAdd = () => {
    setOpen({ formName: 'add', open: true });
    setName('');
    setFile(null);
    setMsg({ type: '', text: '' });
  };


  const handleClose = () => {
    setOpen({ formName: '', open: false });
    setName('');
    setFile(null);
    setMsg({ type: '', text: '' });
    setSubmit({ formName: '', process: false });
    setProgress(0);
  };

  return (
    <section className="w-full">
      {loadingUserRole ? <p className="text-center text-green-300">loading....permission</p> : 
      
        (whoami?.role === 'seller' || whoami?.role === 'admin') && 

          <header className="px-6 bg-gray-200 mx-auto">
          <div className="flex justify-between items-center md:w-[50%] py-1">
            <h4 className="text-lg font-semibold text-gray-700">
              Categories Section
            </h4>

            <button 
              className="rounded-[10px] flex items-center shadow-md shadow-green-400 cursor-pointer hover:text-white transition duration-200 bg-green-500 hover:bg-green-500 text-white py-1 px-3 gap-2" 
              onClick={handleOpenAdd}
            >
              Add 
              <IoIosAddCircleOutline className="text-2xl sm:text-3xl" />
            </button>
          </div>
        </header>
        }
     
      
      {/* Header Section */}
   
      {/* Carousel View */}
      <CarouselView
        categories={categories}
        category_slug={category_slug}
        currentIndex={currentIndex}
        itemsPerView={itemsPerView}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
        setCurrentIndex={setCurrentIndex}
        loadingUserRole={loadingUserRole}
        whoami={whoami}
        
      />

      {/* Modal Forms */}
      {open.open && open.formName === 'add' && (
        <AddREditForm
          type_name="Add new category"
          setOpen={handleClose}
          submit={submit}
          progress={progress}
          msg={msg}
          uploadCategories={uploadCategories}
          name={name}
          file = {file}
          setName={setName}
          setFile={setFile}
        />
      )}
      
      {open.open && open.formName === 'edit' && (
        <EditForm
          type_name="Edit category"
          setOpen={handleClose}
          submit={submit}
          progress={progress}
          msg={msg}
          updateType={(e) => updateCategory(e, selectedCategoryId)}
          name={name}
          setName={setName}
          setFile={setFile}
        />
      )}

      {open.open && open.formName === 'delete' && (
        <DeleteForm
          setOpen={handleClose}
          deleteCate={() => deleteCate(selectedCategoryId)}
          msg={msg}
          name={selectedCategory?.name}
          submit={submit}
          typeData={selectedCategory}
        />
      )}
    </section>
  );
};

export default CategoryManagement;