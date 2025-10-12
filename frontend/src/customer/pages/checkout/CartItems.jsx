import React from 'react';
import { CiTrash } from 'react-icons/ci';
import { FaPlus, FaMinus } from 'react-icons/fa';

const CartItems = ({ 
  cart, 
  getCartCount, 
  removeFromCart, 
  decreaseFromCart, 
  increaseFromCart 
}) => {
  
  // Calculate subtotal for individual items
  const calculateItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Cart Items ({getCartCount()})
        </h4>
        
        <div className="space-y-3 sm:space-y-4">
          {cart.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b-2 sm:border-b-3 border-green-500"
            >
              {/* Product Image & Details Container */}
              <div className="flex items-center gap-3 sm:gap-4 flex-grow">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {item.ProductImages && item.ProductImages.length > 0 ? (
                    <img 
                      src={item.ProductImages[0].image_url} 
                      alt={item.name || "Product"} 
                      className='w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md' 
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-gray-500 text-xs sm:text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-grow min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-1 line-clamp-2 sm:line-clamp-1">
                    {item.name || "Unknown Product"}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">
                    ${item.price || "0.00"}
                  </p>
                  
                  {/* Quantity Controls - Mobile */}
                  <div className="flex items-center gap-2 sm:gap-3 sm:hidden">
                    <button
                      onClick={() => decreaseFromCart(item.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-md transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus className="w-2.5 h-2.5" />
                    </button>
                    
                    <span className="px-2 py-1 bg-gray-100 rounded-md font-medium min-w-[35px] text-center text-sm">
                      {item.quantity || 1}
                    </span>
                    
                    <button
                      onClick={() => increaseFromCart(item.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-md transition-colors"
                    >
                      <FaPlus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quantity Controls - Desktop */}
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => decreaseFromCart(item.id)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded-md transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <FaMinus className="w-3 h-3" />
                </button>
                
                <span className="px-3 py-1 bg-gray-100 rounded-md font-medium min-w-[40px] text-center">
                  {item.quantity || 1}
                </span>
                
                <button
                  onClick={() => increaseFromCart(item.id)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded-md transition-colors"
                >
                  <FaPlus className="w-3 h-3" />
                </button>
              </div>

              {/* Item Total & Remove Button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2">
                <p className="font-semibold text-base sm:text-lg text-gray-800">
                  ${calculateItemTotal(item.price, item.quantity)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                  title="Remove item"
                >
                  <CiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartItems;