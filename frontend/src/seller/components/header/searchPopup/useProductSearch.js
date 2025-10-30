import { useState, useEffect } from 'react';
import {getAllProduct} from '../../../../api/Product.api'

export const useProductSearch = (searchPopup) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: "" });

  // Fetch products when popup opens
  useEffect(() => {
    if (searchPopup) {
      getProductsName();
    }
  }, [searchPopup]);

  // Filter products when search term changes
  useEffect(() => {
    const filtered = getFilteredItems();
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const getProductsName = async () => {
    setIsLoading(true);
    try {
      const page = 1;
      const limit = 100;
      const data = await getAllProduct({ page, limit });
      
      setProducts(data.products || []);
      setMsg({ type: '', text: '' });
    } catch (error) {
      console.error('Fetch error:', error);
      setMsg({
        type: 'error',
        text: error.response?.data?.message || 'Error fetching products for search!'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredItems = () => {
    if (!searchTerm.trim()) return [];

    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    return filteredProducts;
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredProducts([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredProducts,
    isLoading,
    msg,
    resetSearch,
  };
};