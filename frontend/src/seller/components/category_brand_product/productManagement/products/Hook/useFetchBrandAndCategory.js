import { useState, useEffect } from 'react';
import { getCategoriesAPI } from '../../../../../../api/CategoryProduct.api';
import { getBrandsByCategoryAPI } from '../../../../../../api/BrandProduct.api';

export const useFetchBrandAndCategory = (category_slug, brand_slug) => {
  const [categoryName, setCategoryName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

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

  useEffect(() => {
    if (category_slug && brand_slug) {
      getBrandAndCategory();
    }
  }, [category_slug, brand_slug]);

  return {
    categoryName,
    brandName,
    message,
    setMessage
  };
};