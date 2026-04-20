import { useNavigate } from 'react-router-dom';

export const useSearchNavigation = (toggleSearchPopup) => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    // Use the product's own category and brand slugs
    const productCategorySlug = product.Category?.slug;
    const productBrandSlug = product.Brand?.slug;
    
    if (productCategorySlug && productBrandSlug) {
      navigate(`/category/${productCategorySlug}/brand/${productBrandSlug}/product/detail/${product.id}/${product.slug}`);
    } else {
      // Fallback: if product doesn't have category/brand info
      console.error('Product missing category or brand information:', product);
      navigate(`/product/${product.id}`); // Alternative route if you have one
    }
    
    toggleSearchPopup();
  };

  const handleSearchSubmit = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/dashboard/results?search_query=${encodeURIComponent(searchTerm.trim())}`, {
        state: {
          searchTerm
        }
      });
      
      toggleSearchPopup();
    }
  };

  return {
    handleProductClick,
    handleSearchSubmit,
  };
};