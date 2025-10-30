import { useEffect } from 'react';
import {useParams } from 'react-router-dom';
import CategoryManagement from '../categoryManagement/CategoryManagement';
import AddForm from '../AddForm';
import EditForm from '../EditForm';
import DeleteForm from '../DeleteForm';
import { useUser } from '../../../../../context/UserContext';
import { useBrandOperations } from './useBrandOperations';
import { useBrandNavigation } from './useBrandNavigation';
import BrandHeader from './brandManagementHtmlFormat/Brandheader';
import BrandGrid from './brandManagementHtmlFormat/BrandGrid';

const BrandManagement = ({ brand_slug }) => {
  const { user: whoami, loading: loadingUserRole, error: userError } = useUser();
  const params = useParams();
  const { category_slug } = params;

  const checkUserRole = whoami?.role === 'admin' || whoami?.role === 'seller';

  const {
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
    open,
    selectedBrandId,
    selectedBrand,
    showname,
    setShowName,
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDelete,
    handleClose,
  } = useBrandOperations(category_slug);

  const { navigateToNoBrands, getBrandPath } = useBrandNavigation(
    category_slug,
    brand_slug,
    brands,
    checkUserRole,
    loadingUserRole
  );

  useEffect(() => {
    if (category_slug && !loadingUserRole) {
      getBrandsByCategory().then(brandData => {
        if (brandData.length > 0) {
          setShowName(brandData[0].name);
        } else {
          navigateToNoBrands();
        }
      });
    }
  }, [category_slug, loadingUserRole]);


  const handleUpload = async (e) => {
    await uploadBrand(e);
  };

  const handleUpdate = async (e) => {
    await updateBrand(e, selectedBrandId);
  };

  const handleDelete = async () => {
    await deleteBrand(selectedBrandId);
  };

  return (
    <section className='w-full'>
      {loadingUserRole ? (
        <p className='text-gray-300 text-center'>Loading permission...</p>
      ) : (
        <>
        
          <CategoryManagement category_slug={category_slug} />

          <BrandHeader checkUserRole={checkUserRole} handleOpenAdd={handleOpenAdd}/>
         
          <BrandGrid
            loading={loading}
            brands={brands}
            brand_slug={brand_slug}
            showname={showname}
            checkUserRole={checkUserRole}
            getBrandPath={getBrandPath}
            setShowName={setShowName}
            handleOpenEdit={handleOpenEdit}
            handleOpenDelete={handleOpenDelete}
          />

          {open.open && open.formName === 'add' && (
            <AddForm
              type_name="Add New Brand"
              setOpen={handleClose}
              submit={submit}
              progress={progress}
              msg={msg}
              uploadCategories={handleUpload}
              name={name}
              setName={setName}
              file={file}
              setFile={setFile}
            />
          )}

          {open.open && open.formName === 'edit' && (
            <EditForm
              type_name="Edit brand"
              setOpen={handleClose}
              submit={submit}
              progress={progress}
              msg={msg}
              updateType={handleUpdate}
              name={name}
              setName={setName}
              file={file}
              setFile={setFile}
            />
          )}

          {open.open && open.formName === 'delete' && (
            <DeleteForm
              setOpen={handleClose}
              deleteCate={handleDelete}
              msg={msg}
              name={selectedBrand?.name}
              submit={submit}
              typeData={selectedBrand}
            />
          )}
        </>
      )}
    </section>
  );
};

export default BrandManagement;