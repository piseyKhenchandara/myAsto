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
    <aside>
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Cart Items ({getCartCount()})
        </h4>
        
        <div className="space-y-3 sm:space-y-4">
          {cart.map((item) => (
            <article 
              key={item.id} 
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 border-b-2 border-green-500"
            >

              <figure className="flex-shrink-0">
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
              </figure>

              <div className="flex-grow min-w-0 flex flex-col gap-2">
                <h5 className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                  {item.name || "Unknown Product"}
                </h5>
                
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm sm:text-base text-gray-600">
                    ${item.price || "0.00"}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => decreaseFromCart(item.id)}
                      type='button'
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-md transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                    
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 rounded-md font-medium min-w-[35px] sm:min-w-[40px] text-center text-sm">
                      {item.quantity || 1}
                    </span>
                    
                    <button
                      onClick={() => increaseFromCart(item.id)}
                      type='button'
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-md transition-colors"
                      aria-label="Increase quantity"
                    >
                      <FaPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </div>
                </div>
                <footer className="flex items-center justify-between">
                  <p className="font-semibold text-base sm:text-lg text-gray-800">
                    Total: ${calculateItemTotal(item.price, item.quantity)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    type='button'
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                    title="Remove item"
                    aria-label="Remove item from cart"
                  >
                    <CiTrash className="w-5 h-5" />
                  </button>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default CartItems;