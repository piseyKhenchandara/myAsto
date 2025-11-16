import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import EditForm from "../productManagement/products/EditForm.jsx";
import DeleteForm from "../productManagement/products/DeleteForm.jsx";
import CarouselView from './CarouselView';
import AddREditForm from "../productManagement/products/AddForm.jsx";
import { useUser } from "../../../../../context/UserContext.jsx";
import CategoryHeader from "./CategoryHeader.jsx";
import { useCategoryOperations } from "./Hook/useCategoryOperations.js";
import { useCarouselPagination } from "./Hook/useCarouselPagination.js";


const CategoryManagement = ({ category_slug }) => {
  const context = useOutletContext();
  const { visible = false } = context || {};
  const { user: whoami, loading: loadingUserRole } = useUser();

  
  //CRUD cateogry
  const {
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
    open,
    handleOpenAdd,
    handleClose,
  } = useCategoryOperations();
  


  const {
    currentIndex,
    setCurrentIndex,
    itemsPerView,
    goToPrevious,
    goToNext,
    canGoPrevious,
    canGoNext,
  } = useCarouselPagination(categories,visible);


  useEffect(() => {
    fetchCategories();
  }, []);


  return (
    <section className="w-full">
      <CategoryHeader
        loadingUserRole={loadingUserRole}
        whoami={whoami}
        handleOpenAdd={handleOpenAdd}
      />
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
      {open.open && open.formName === 'add' && (
        <AddREditForm
          type_name="Add new category"
          setOpen={handleClose}
          submit={submit}
          progress={progress}
          msg={msg}
          uploadCategories={uploadCategories}
          name={name}
          file={file}
          setName={setName}
          setFile={setFile}
        />
      )}

     
    </section>
  );
};

export default CategoryManagement;
