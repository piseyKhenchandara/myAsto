import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBrandNavigation = (
  category_slug, 
  brand_slug, 
  brands, 
  checkUserRole,
  loadingUserRole
) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!category_slug || loadingUserRole || brands.length === 0) return;

    // Navigate to first brand if no brand is selected
    if (!brand_slug && brands.length > 0) {
      const firstBrand = brands[0];
      const path = checkUserRole 
        ? `/dashboard/category/${category_slug}/brand/${firstBrand.slug}/products`
        : `/category/${category_slug}/brand/${firstBrand.slug}/products`;
      navigate(path, { replace: true });
    }
  }, [category_slug, brand_slug, brands, checkUserRole, loadingUserRole, navigate]);

  const navigateToNoBrands = () => {
    const path = checkUserRole
      ? `/dashboard/category/${category_slug}/brands`
      : `/category/${category_slug}/brands`;
    navigate(path, { replace: true });
  };

  const getBrandPath = (brandSlug) => {
    return checkUserRole 
      ? `/dashboard/category/${category_slug}/brand/${brandSlug}/products`
      : `/category/${category_slug}/brand/${brandSlug}/products`;
  };

  return {
    navigateToNoBrands,
    getBrandPath,
  };
};