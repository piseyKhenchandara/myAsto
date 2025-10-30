import { useState, useEffect } from 'react';
import { getProductsByBrandNCategory } from '../../../../../../api/Product.api';


export const useFetchProducts = (category_slug, brand_slug, page, limit) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pagination, setPagination] = useState({
    page: page,
    limit: limit,
    total: 0,
    totalPages: 0
  });

  const getProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsByBrandNCategory(
        category_slug,
        brand_slug,
        {
          page: pagination.page,
          limit: pagination.limit
        }
      );

      setProducts(data.products || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalpages || 0
      }));
    } catch (error) {
      setMessage({
        text: error?.response?.data?.message || "Failed fetching data",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    if (category_slug && brand_slug) {
      getProducts();
    }
  }, [category_slug, brand_slug, pagination.page]);

  return {
    products,
    loading,
    message,
    setMessage,
    pagination,
    getProducts,
    handlePageChange
  };
};