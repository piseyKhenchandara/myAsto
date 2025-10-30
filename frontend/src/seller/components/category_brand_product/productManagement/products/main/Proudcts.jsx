import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useOutletContext, useParams } from "react-router-dom";
import ProductList from "../../ProductList";
import ProductForm from "../../ProductForm";
import Pagination from "../../Pagination";
import ProductBanner from "../../productBanner/ProductBanner";
import BrandManagement from "../../../brandManagement/BrandManagement";
import DeleteForm from "../../../DeleteForm";
import { useUser } from "../../../../../../../context/UserContext";
import BrandsHorizontally from "../../../brandManagement/BrandsHorizontally";

import { useFetchBrandAndCategory } from "../Hook/useFetchBrandAndCategory";
import { useProductActions } from "../Hook/useProductActions";
import { useMessageAutoClose } from "../Hook/useMessageAutoClose";
import { useFetchProducts } from "../Hook/useFetchProducts";

const Products = () => {
  const { visible = false } = useOutletContext() || {};
  const { category_slug, brand_slug } = useParams();
  const { user: whoami, loading: loadingUserRole } = useUser();
  

  // Fetch products
  const {
    products,
    loading,
    message: productMessage,
    setMessage: setProductMessage,
    pagination,
    getProducts,
    handlePageChange
  } = useFetchProducts(category_slug, brand_slug, 1, 12);

  // Fetch brand and category names
  const {
    categoryName,
    brandName,
    message: brandCategoryMessage,
    setMessage: setBrandCategoryMessage
  } = useFetchBrandAndCategory(category_slug, brand_slug);

  // Product actions (add, delete)
  const {
    submit,
    progress,
    open,
    selectedProduct,
    message: actionMessage,
    setMessage: setActionMessage,
    uploadProduct,
    deleteProductWrapper,
    handleOpen,
    handleOpenDelete,
    handleClose
  } = useProductActions(category_slug, brand_slug, getProducts);

  // Combine messages from different hooks
  const message = productMessage.text 
    ? productMessage 
    : brandCategoryMessage.text 
    ? brandCategoryMessage 
    : actionMessage ? " " : "";

  useMessageAutoClose(message,setMessage);



  return (
    <div className="w-full min-h-screen">
      {loadingUserRole ? (
        <p className="text-gray-300 text-center">loading permission...</p>
      ) : (
        <>
          {/* Top Context */}
          <ProductBanner />
          <BrandsHorizontally />

          <BrandManagement brand_slug={brand_slug} visible={visible} />

          {(whoami?.role === 'admin' || whoami?.role === 'seller') && (
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
          )}

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
      )}
    </div>
  );
};

export default Products;