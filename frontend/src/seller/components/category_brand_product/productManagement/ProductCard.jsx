import React from 'react';
import { Link } from 'react-router-dom';
import { CiEdit, CiTrash } from 'react-icons/ci';
import { useUser } from '../../../../../context/UserContext';
import { FaCartArrowDown } from 'react-icons/fa6';
import { useCart } from '../../../../customer/context/CartContext';

const ProductCard = ({ 
  product, 
  category_slug, 
  brand_slug, 
  onDelete 
}) => {
  const { user: whoami } = useUser();
  const { addToCart } = useCart();
  const checkUserRole = whoami?.role === 'admin' || whoami?.role === 'seller';

  return (
    <div className="md:border shadow hover:shadow-md flex flex-col py-2 justify-between w-full max-w-xs hover:scale-105 transition duration-100 ease-in-out cursor-pointer hover:shadow-green-300 rounded-[15px] h-auto">
      {/* Image Section */}
      <div className="w-full flex flex-col items-center gap-2">
        {product.ProductImages?.[0] && (
          <Link 
            to={checkUserRole 
              ? `/dashboard/category/${category_slug}/brand/${brand_slug}/product/detail/${product.id}` 
              : `/category/${category_slug}/brand/${brand_slug}/product/detail/${product.id}`}
            className="w-full"
          >
            <img 
              src={product.ProductImages[0].image_url}
              alt={product.name}
              className="object-contain w-full h-full"
              loading="lazy"
            />
          </Link>
        )}
      </div>
      
      {/* Product Info Section */}
      <div className="flex flex-col px-3">
        {checkUserRole && (
          <span className="text-xs text-gray-500 mb-1">ID: {product.id}</span>
        )}
        
        <h6 className="font-bold text-base md:text-lg text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h6>

        {/* Price and Actions */}
        <div className="flex justify-between items-center w-full gap-2">
          <p className="font-bold ">
            ${product.price}
          </p>
          
          {whoami?.role === 'customer' && (
            <button 
              className="text-xs md:text-base font-bold text-white hover:bg-black cursor-pointer duration-200 ease-in-out border p-2 px-4 md:px-5 bg-green-500 rounded-[6px] flex items-center gap-1"
              onClick={() => addToCart(product)}
            >
              <FaCartArrowDown />
            
            </button>
          )}
        </div>

        {/* Admin/Seller Actions */}
        {checkUserRole && (
          <div className="flex gap-3 mt-3 text-2xl justify-center md:justify-start"> 
            <Link 
              className="text-green-600 shadow-lg p-2 rounded cursor-pointer hover:scale-110 transition-transform hover:text-white hover:bg-green-500" 
              to={`/dashboard/category/${category_slug}/brand/${brand_slug}/product/detail/edit/${product.id}`}
            >
              <CiEdit />
            </Link>
            <button 
              className="text-red-600 shadow-lg p-2 rounded cursor-pointer hover:scale-110 transition-transform hover:text-white hover:bg-red-600" 
              onClick={() => onDelete(product)}
            >
              <CiTrash />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;