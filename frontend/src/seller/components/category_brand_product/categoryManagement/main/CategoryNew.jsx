import React, { useEffect, useState } from "react";
import {
  uploadCategoriesAPI,
  getCategoriesAPI,
  deleteCategoryAPI,
  editCategoryAPI,
} from '../../../../../api/CategoryProduct.api.js'
import { IoIosAddCircleOutline } from "react-icons/io";

import AddREditForm from "../../productManagement/products/AddForm.jsx";
import EditForm from "../../productManagement/products/EditForm.jsx";
import DeleteForm from "../../productManagement/products/DeleteForm.jsx";
import GridView from "../GridView.jsx";
import { useUser } from "../../../../../../context/UserContext.jsx";


const CategoryNew = ({ category_slug, visible}) => {

  const {user : whoami, loading: loadingUserRole} = useUser();
  
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState({type : '', text : ''});
  
  const [open, setOpen] = useState({formName: '', open: false});
  
  const [submit, setSubmit] = useState({formName: '', process: false});
  const [progress, setProgress] = useState(0);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null)
  


  

  const fetchCategories = async () => {
    try{
      const data = await getCategoriesAPI();
      setCategories(data);
    }
    catch(error) {
      setMsg({   
        type: 'error', 
        text: error.response?.data.message || "Failed to fetch categories"
      });
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const uploadCategories = async (e) => {
    e.preventDefault(); 
    if (!name || !file) return setMsg({type : 'error', text : 'both fields are required'})
    setMsg({type : '', text : ''});
    setSubmit({formName: 'add', process: false});
    setProgress(0);

    try{
      setSubmit({formName: 'add', process: true});
      await uploadCategoriesAPI({
        name,
        file,
        onProgress : (evt) => {
          const percentage = Math.round((evt.loaded * 100)/evt.total);
          setProgress(percentage);
        }
      });

      setName('');
      setFile(null);
      setMsg({type : 'success', text : 'Category uploaded successfully'});
      fetchCategories(); 

      setTimeout(() =>{
        setOpen({formName: '', open: false});
      },3000)
    }
    catch(error){
      setMsg({
        type: 'error',
        text: error.response?.data?.message || "Failed to upload category"
      });
    }

  }

  const updateCategory = async (e, id) => {
    e.preventDefault();
    setMsg({type : '', text : ''});
    setSubmit({formName: 'edit', process: true});
    setProgress(0);

    try{
      await editCategoryAPI(
        name,
        id,
        file,
        (evt) => {
          if(!evt) return;
          const pct = Math.round((evt.loaded * 100)/evt.total);
          setProgress(pct);
          return pct;
        }
      );
      
      setMsg({type: 'success', text: 'Category updated successfully '});
      await fetchCategories();

      setTimeout(() => {
        setName('');
        setFile(null);
        setOpen({formName: '', open: false});
        setSubmit({formName: '', process: false});

      }, 1500);
    }
    catch(error){
      setMsg({type : 'error', text : error.response?.data?.message || error.message});
    }

  }

  const deleteCate = async (id) => {
    
    try{

       setSubmit({formName: 'delete', process: true});
      await deleteCategoryAPI(
        id 
      )

       setMsg({type: 'success', text: 'Category deleted successfully '});
      await fetchCategories();

      setTimeout(() => {
        setOpen({formName: '', open: false});
        setSubmit({formName : "", process : false});
        setMsg({type : '', text : ''})
        
        
      }, 1500);
    }
    catch(error) {
      setMsg({type : 'error', text : error.response?.data?.message || error.message});
    }

  }

  const handleOpenAdd = () => {
    setOpen({formName: 'add', open: true});
  }

  const handleOpenEdit = (category) => {
    setSelectedCategoryId(category.id);
    setOpen({formName: 'edit', open: true});
    setName(category.name || '');
    setFile(null); 
  }

  const handleOpenDelete = (category) => {
    setSelectedCategoryId(category.id);
    setSelectedCategory(category);
    setOpen({formName: 'delete', open: true});
  }

  const handleClose = () => {
    setOpen({formName: '', open: false});
  }

  return (
    <section className="w-full ">
      
      {(whoami?.role === 'admin' || whoami?.role === 'seller') &&
      
        <header className=' px-6 bg-gray-200 mx-auto'>
          <div className="flex justify-between items-center md:w-[50%]  py-1">
            <h4 >Categories-section</h4>
      
            <button 
                className="rounded-[10px] flex items-center shadow-md shadow-green-400 cursor-pointer hover:text-white transition duration-200 bg-green-500 hover:bg-green-500 text-white  py-1 p-5" 
                onClick={handleOpenAdd}
              >
                Add 
                <IoIosAddCircleOutline className="text-2xl sm:text-3xl"/>
            </button>
          </div>
        </header>
      }

     
      <GridView 
        categories={categories}
        visible={visible}
        handleOpenEdit={handleOpenEdit}
        handleOpenDelete={handleOpenDelete}
        whoami={whoami}
        loadingUserRole = {loadingUserRole}

      />

      { open.open && open.formName === 'add' && (
        <AddREditForm
          type_name={'Add new category'}
          setOpen={handleClose}
          submit={submit}
          progress={progress}
          msg={msg}
          uploadCategories={uploadCategories}
          name={name}
          setName={setName}
          setFile={setFile}
          file = {file}
        />
      )}
      
      { open.open && open.formName === 'edit' && (
        <EditForm
          type_name={'Edit category'}
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

      {
        open.open && open.formName === 'delete' && (
          <DeleteForm
            setOpen={handleClose}
            deleteCate={() => deleteCate(selectedCategoryId)}
            msg={msg}
            name={selectedCategory?.name}
            submit={submit}
            typeData={selectedCategory}
          />
        )
      }
    </section>
  );
};

export default CategoryNew;