import { useState } from "react";
import { getBannersByCategory } from "../../../../../../api/ProductBanner.api";

export const useFetchBanner = (category_slug) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
 

  const getBannersByCate = async () => {
    try {
      setLoading(true);
     
      
      const data = await getBannersByCategory(category_slug);
      setBanners(data || []);
      
    } catch(error) {
    
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    banners,
    loading,
    getBannersByCate,
    
  };
};