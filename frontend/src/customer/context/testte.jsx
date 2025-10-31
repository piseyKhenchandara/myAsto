import React, { useState } from 'react';
import { CiTrash } from 'react-icons/ci';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useUser } from '../../../context/UserContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { user: whoami } = useUser();
  const { cart, removeFromCart, decreaseFromCart, increaseFromCart, getCartCount } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate total price
  const productTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Calculate subtotal for individual items
  const calculateItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  // Handle checkout process
  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate checkout process
    try {
      // Here you would typically make an API call to process the order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Order placed successfully!');
      // You might want to clear the cart after successful checkout
      // clearCart(); // You'd need to implement this function in CartContext
      
    } catch (error) {
      alert('Error processing order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!whoami) {
    return (
      <div className='w-full'>
        <div className='max-w-[1920px] mx-auto px-6 py-8'>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Sign in to continue</h2>
            <p className="text-gray-600">You need to be signed in to view your cart and checkout</p>
          </div>
          <Signup />
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-gray-50'>
      <div className='max-w-[1200px] mx-auto px-6 py-8'>
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>
        
        {cart && cart.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Cart Items ({getCartCount()})</h2>
                
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.ProductImages && item.ProductImages.length > 0 ? (
                          <img 
                            src={item.ProductImages[0].image_url} 
                            alt={item.name || "Product"} 
                            className='w-20 h-20 object-contain rounded-md' 
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md">
                            <span className="text-gray-500 text-sm">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {item.name || "Unknown Product"}
                        </h3>
                        <p className="text-gray-600 mb-2">${item.price || "0.00"}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
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
                      </div>

                      {/* Item Total & Remove Button */}
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-semibold text-lg text-gray-800">
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

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({getCartCount()})</span>
                    <span>${productTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>${productTotalPrice()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || cart.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    isProcessing || cart.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover: text-white'
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Secure checkout powered by SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-md p-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some products to your cart to get started</p>
              <button 
                onClick={() => window.history.back()} 
                className="bg-green-600 hover: text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;