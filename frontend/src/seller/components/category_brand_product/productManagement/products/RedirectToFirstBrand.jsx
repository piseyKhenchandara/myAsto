import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBrandsByCategoryAPI } from '../../../../../api/BrandProduct.api';
import { useUser } from '../../../../../../context/UserContext';


const RedirectToFirstBrand = () => {

  const {user: whoami} = useUser();

  const { category_slug } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const redirectToFirstBrand = async () => {
      try {
        const brands = await getBrandsByCategoryAPI(category_slug);

        const brandData = brands.brands || brands || [];
        
        if (brandData.length > 0) {

          navigate((whoami.role === 'admin' || whoami.role === 'seller') ? `/dashboard/category/${category_slug}/brand/${brandData[0].slug}/products` : `/category/${category_slug}/brand/${brandData[0].slug}/products`, { replace: true });
        }
        else {
          navigate(`/dashboard/category/${category_slug}/brands`, { replace: true });
        }
      } catch (error) {
        navigate(`/dashboard/category/${category_slug}/brands`, { replace: true });
      }
    };
    
    redirectToFirstBrand();
  }, [category_slug, navigate]);
  
  return <p>Loading...</p>;
};

export default RedirectToFirstBrand;