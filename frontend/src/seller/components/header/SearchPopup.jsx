import React, { useEffect, useState, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { getAllProduct } from "../../../api/Product.api";

import { useNavigate, useParams } from "react-router-dom";

const SearchPopup = ({ toggleSearchPopup, searchPopup }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: "" });
  
  const navigate = useNavigate();

  const searchRef = useRef(null);

  // Fetch products when popup opens
  useEffect(() => {
    if (searchPopup) {
      getProductsName();
    }
  }, [searchPopup]);

  // Close search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        toggleSearchPopup();
      }
    };

    if (searchPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchPopup, toggleSearchPopup]);



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

  const handleProductClick = (product) => {
  //  Use the product's own category and brand slugs
  const productCategorySlug = product.Category?.slug;
  const productBrandSlug = product.Brand?.slug;
  
  if (productCategorySlug && productBrandSlug) {
    navigate(`/category/${productCategorySlug}/brand/${productBrandSlug}/product/detail/${product.id}`);
  } else {
    // Fallback: if product doesn't have category/brand info
    console.error('Product missing category or brand information:', product);
    navigate(`/product/${product.id}`); // Alternative route if you have one
  }
  
  toggleSearchPopup();
};
  // Handle pressing Enter or clicking "View all results"
  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/dashboard/results?search_query=${encodeURIComponent(searchTerm.trim())}`, {
        state: {
          searchTerm
        }
      });
      
      toggleSearchPopup();
    }
  };

  return (
    <>
      <button onClick={toggleSearchPopup} aria-label="Open search">
        <IoIosSearch className="cursor-pointer md:text-2xl" />
      </button>

      {searchPopup && (
        <div className="fixed left-0 right-0 top-12 md:top-15 flex justify-center z-10" ref={searchRef}>
          <div className="bg-white shadow-lg rounded-b-md p-4 w-full md:max-w-[1920px]">
            {/* Search Input */}
            <div className="flex flex-row items-center gap-2 border-b pb-2">
              <IoIosSearch className="text-gray-400 text-base cursor-pointer" />
              <input
                type="text"
                className="w-full text-gray-600 focus:outline-none font-medium text-sm"
                placeholder="Search products..."
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              />
              {isLoading && (
                <span className="text-xs text-gray-500">Loading...</span>
              )}
            </div>

            {/* Error Message */}
            {msg.type === 'error' && (
              <div className="text-red-500 text-xs mt-2 px-2">
                {msg.text}
              </div>
            )}

            {/* Search Results */}
            <div className="overflow-y-auto max-h-80 mt-2">
              {filteredProducts.length > 0 ? (
                <>
                  <p className="font-semibold text-gray-400 text-xs mb-2 px-2">
                    Search Results ({filteredProducts.length})
                  </p>
                  <div className="space-y-1">
                    {filteredProducts.slice(0, 8).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="flex justify-between items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {product.name}
                        </p>
                        <IoIosSearch className="text-gray-400 text-sm flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                // No results message
                searchTerm.trim() && !isLoading && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">
                      No products found for "<span className="font-medium">{searchTerm}</span>"
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try different keywords or check spelling
                    </p>
                  </div>
                )
              )}
              
              {/* Loading state */}
              {isLoading && searchTerm.trim() && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">Searching...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchPopup;