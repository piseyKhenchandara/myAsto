import React from "react";
import { IoIosSearch } from "react-icons/io";

import { useClickOutside } from './useClickOutside';
import { useSearchNavigation } from './useSearchNavigation';
import { useProductSearch } from "./useProductSearch";

const SearchPopup = ({ toggleSearchPopup, searchPopup }) => {
  // Custom hooks
  const {
    searchTerm,
    setSearchTerm,
    filteredProducts,
    isLoading,
    msg,
  } = useProductSearch(searchPopup);

  const searchRef = useClickOutside(searchPopup, toggleSearchPopup);

  const {
    handleProductClick,
    handleSearchSubmit,
  } = useSearchNavigation(toggleSearchPopup);

  const onSearchSubmit = () => {
    handleSearchSubmit(searchTerm);
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
                onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
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