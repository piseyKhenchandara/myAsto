import React from 'react';
import ProductCard from './ProductCard';


const ProductList = ({ 
  products, 
  loading, 
  visible, 
  category_slug, 
  brand_slug, 
  onDelete,
  message 
}) => {
  return (
    <div className="flex justify-center w-full">
      <div className={`grid grid-cols-2 sm:grid-cols-3 ${
        visible ? "lg:grid-cols-4 md:grid-cols-3" : "lg:grid-cols-5 xl:grid-cols-6 md:grid-cols-4"
      } gap-3 justify-items-center px-6 py-6`}>
        
        {/* Message Display */}
        {message.text && (
          <p className={`col-span-full ${
            message.type === 'error' ? 'text-red-600' : 'text-green-600'
          }`}>
            {message.text}
          </p>
        )}

        {/* Loading State */}
        {loading && (
          <div className="col-span-full text-center text-gray-500">
            Loading products...
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            No products found. Click "Add" to create your first product.
          </div>
        )}

        {/* Products Grid */}
        {products.map((product, index) => (
          <ProductCard
            key={product.id || index}
            product={product}
            category_slug={category_slug}
            brand_slug={brand_slug}
            onDelete={onDelete}
          />
        ))}
        
      </div>
    </div>
  );
};

export default ProductList;