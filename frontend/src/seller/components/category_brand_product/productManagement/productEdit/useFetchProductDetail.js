import { useState, useEffect } from 'react';
import { getProductDetail } from '../../../../../api/Product.api';



export const useFetchProductDetail = (id) => {
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProductDetail(id);
      setProductDetail(data || null);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch product detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  return { productDetail, loading, error, refetch: fetchProductDetail };
};