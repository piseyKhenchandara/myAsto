import React, { use, useState } from 'react';
import CartItems from './CartItems';
import OrderSummary from './OrderSummary';
import { useUser } from '../../../../context/UserContext';
import { useCart } from '../../context/CartContext';
import Signup from '../../../auth/pages/Signup';
import Address from './Address';
import { orderAPI } from '../../../api/order.api';
import KhqrGenerator from './KhqrGenerator';
import { createKHQRPaymentAPI } from '../../../api/payment.api';




const Order = () => {
  const { user: whoami } = useUser();
  const { cart, removeFromCart, decreaseFromCart, increaseFromCart, getCartCount } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [message, setMessage] =useState({type :'', text :""});


   //whoami
  const [phoneNumber, setPhoneNumber] = useState('');
  //address + ordernotes
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  //cart
  //payment method
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDeliveryCompany, setSelectedDeliveryCompany] = useState('');
  const [qrPopup, setQrPopup] = useState(false);
  const [resFromOrder, setResFromOrder] = useState(null);
  const [resFromKHQR, setResFromKHQR] = useState(null);


  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };
  const finalAddress = address +"(" + orderNotes + ")";

  const handleOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Here you would typically make an API call to process the order
      await new Promise(resolve => setTimeout(resolve, 2000));


      setSubmit(true);

      const payload = {
        customer_name : whoami.name,
        phone_number : phoneNumber,
        shipping_address : finalAddress,
        delivery_company : selectedDeliveryCompany,
        amount : calculateTotal(),
        cart : cart,
        discount_amount : 0,
      }

      const response = await orderAPI({payload});
      console.log('Response:', response);
        
        if (response.success) {
          alert('Order placed successfully!');
          const khqrResponse = await createKHQRPaymentAPI(response.data.order_id);
          setResFromKHQR(khqrResponse);
          setQrPopup(true);
        }

      
      setTimeout(() => {
        setSubmit(false);
        setQrPopup(true)

      }, 2000);


      
    } catch (error) {
      alert(error.response?.data.message || 'Error processing order. Please try again.' );
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
            <p className="text-gray-600">You need to be signed in to view your cart and Order</p>
          </div>
          <Signup />
        </div> 
      </div>
    );
  }



  return (
    <div className='w-full min-h-screen bg-gray-50'>
      <div className='max-w-[1300px] mx-auto px-6 py-8'>
        
        
        {cart && cart.length > 0 ? (
          <form className="grid lg:grid-cols-7 gap-4">
            <div className='lg:col-span-3'>
              <CartItems
                cart={cart}
                getCartCount={getCartCount}
                removeFromCart={removeFromCart}
                decreaseFromCart={decreaseFromCart}
                increaseFromCart={increaseFromCart}
              />

            </div>
            <div className='lg:col-span-4'>
              <Address
        
                setPhoneNumber = {setPhoneNumber}
                setAddress = {setAddress}
                setSelectedLocation = {setSelectedLocation}
                whoami = {whoami}
                phoneNumber = {phoneNumber}
                address = {address}
                selectedLocation = {selectedLocation}
                setSelectedDeliveryCompany = {setSelectedDeliveryCompany}
                selectedDeliveryCompany = {selectedDeliveryCompany}
                setOrderNotes = {setOrderNotes}
              />
              
              <OrderSummary
                cart={cart}
                getCartCount={getCartCount}
                calculateTotal={calculateTotal}
                handleOrder={handleOrder}
                submit = {submit}
                isProcessing={isProcessing}
                whoami = {whoami}
                phoneNumber = {phoneNumber}
                selectedLocation = {selectedLocation}
                selectedDeliveryCompany = {selectedDeliveryCompany}
                setOrderNotes = {setOrderNotes}
            
                
              />
            </div>
          </form>
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
      {qrPopup && 
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/50'>
          <KhqrGenerator resFromKHQR = {resFromKHQR} onClose={() => setQrPopup(false)}/>
        
          
        </div>
      }

    </div>


  );
};

export default Order;