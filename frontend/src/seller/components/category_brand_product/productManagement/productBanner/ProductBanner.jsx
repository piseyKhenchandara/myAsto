import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../../../../context/UserContext';
import { useFetchBanner } from './Hook/useFetchBanner';
import { useAutoSlide } from './Hook/useAutoSlide';
import { useBannerActions } from './Hook/useBannerActions';
import BannerHeader from '../productBanner/productBannerHTML/BannerHeader';
import EmptyState from '../productBanner/productBannerHTML/EmptyState';
import BannerSlider from '../productBanner/productBannerHTML/BannerSlider';
import AddBannerModal from '../productBanner/productBannerHTML/AddBannerModal';
import DeleteBannerModal from '../productBanner/productBannerHTML/DeleteBannerModal';

const ProductBanner = () => {
  const { user: whoami, loading: loadingUserRole } = useUser();
  const { category_slug, brand_slug } = useParams();

  // Fetch banners
  const { banners, getBannersByCate } = useFetchBanner(category_slug);

  useEffect(() => {
    getBannersByCate();
  }, [category_slug]);

  // Auto-slide functionality
  const {
    currentIndex,
    isAutoPlaying,
    goToPrevious,
    goToNext,
    goToSlide
  } = useAutoSlide(banners);

  const {
    open,
    productId,
    setProductId,
    submit,
    progress,
    file,
    setFile,
    msg,
    selectedBannerId,
    selectedBanner,
    handleUpload,
    handleOpenAdd,
    deleteBan,
    handleOpenDelete,
    handleClose,
  } = useBannerActions(category_slug, getBannersByCate);

  const checkUserRole = whoami?.role === 'admin' || whoami?.role === 'seller';

  if (loadingUserRole) {
    return <p className='text-gray-300 text-center'>loading permission...</p>;
  }

  return (
    <div className='overflow-x-hidden'>
      <BannerHeader 
        checkUserRole={checkUserRole} 
        handleOpenAdd={handleOpenAdd} 
      />

      {banners.length === 0 ? (
        <EmptyState />
      ) : (
        <BannerSlider
          banners={banners}
          currentIndex={currentIndex}
          isAutoPlaying={isAutoPlaying}
          goToPrevious={goToPrevious}
          goToNext={goToNext}
          goToSlide={goToSlide}
          checkUserRole={checkUserRole}
          category_slug={category_slug}
          brand_slug={brand_slug}
          handleOpenDelete={handleOpenDelete}
        />
      )}

      <AddBannerModal
        open={open}
        handleClose={handleClose}
        submit={submit}
        progress={progress}
        msg={msg}
        handleUpload={handleUpload}
        file={file}
        setFile={setFile}
        productId={productId}
        setProductId={setProductId}
      />

      <DeleteBannerModal
        open={open}
        handleClose={handleClose}
        deleteBan={deleteBan}
        msg={msg}
        selectedBannerId={selectedBannerId}
        selectedBanner={selectedBanner}
        submit={submit}
      />
    </div>
  );
};

export default ProductBanner;