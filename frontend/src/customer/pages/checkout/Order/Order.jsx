import React, { useState } from 'react';
import CartSection from './CartSection';
import SummarySection from './SummarySection';
import EmptyCart from './EmptyCart';
import { useUser } from '../../../../../context/UserContext';
import { useCart } from '../../../context/CartContext';
import Signup from '../../../../auth/pages/Signup';
import { orderAPI } from '../../../../api/order.api';
import { createKHQRPaymentAPI } from '../../../../api/payment.api';
import KhqrGenerator from '../KHQR/KhqrGenerator';

const Order = () => {
  const { user: whoami } = useUser();
  const { cart, removeFromCart, decreaseFromCart, increaseFromCart, getCartCount } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(whoami?.phone || '');
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(whoami?.address || '');
  const [selectedDeliveryCompany, setSelectedDeliveryCompany] = useState('');
  const [qrPopup, setQrPopup] = useState(false);
  const [resFromKHQR, setResFromKHQR] = useState(null);

  const productTotalPrice = () => (cart.reduce((total, item) => total + item.price * item.quantity, 0));
  const finalAddress = orderNotes ? selectedLocation + '(' + orderNotes + ')' : selectedLocation;

  /* const totalPrice = (productTotalPrice() + 2).toFixed(2); */
  const totalPrice = 0.1; 



  const handleOrder = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmit(true);
      const payload = {
        customer_name: whoami.name,
        phone_number: phoneNumber,
        shipping_address: finalAddress,
        delivery_company: selectedDeliveryCompany,
        amount: totalPrice,
        cart: cart,
        discount_amount: 0,
      };

      const response = await orderAPI({ payload });
      console.log('Response:', response);

      if (response.success) {
        alert('Order placed successfully!');
        const khqrResponse = await createKHQRPaymentAPI(response.data.order_id);
        setResFromKHQR(khqrResponse);
        setQrPopup(true);
        setSubmit(false);
      }

    } catch (error) {
      alert(error.response?.data.message || 'Error processing order. Please try again.');
    } finally {
      setIsProcessing(false);
      setSubmit(false);
    }
  };

  if (!whoami)
    return (
      <div className="w-full">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 sm:py-8 ">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Sign in to continue</h2>
            <p className="text-sm sm:text-base text-gray-600">You need to be signed in to view your cart and Order</p>
          </div>
          <Signup />
        </div>
      </div>
    );

  return (
    <div className="w-full h-auto">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-6 sm:py-8 h-auto">
        {cart && cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 sm:gap-6 h-auto">
            <div className="lg:col-span-3 h-full p-2 ">
              <CartSection
              cart={cart}
              getCartCount={getCartCount}
              removeFromCart={removeFromCart}
              decreaseFromCart={decreaseFromCart}
              increaseFromCart={increaseFromCart}
            />
            </div>

            <div className='lg:col-span-4'>
              <SummarySection
                address={address}
                setAddress={setAddress}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedDeliveryCompany={selectedDeliveryCompany}
                setSelectedDeliveryCompany={setSelectedDeliveryCompany}
                orderNotes={orderNotes}
                setOrderNotes={setOrderNotes}
                cart={cart}
                getCartCount={getCartCount}
                productTotalPrice={productTotalPrice}
                handleOrder={handleOrder}
                submit={submit}
                isProcessing={isProcessing}
                whoami={whoami}
                totalPrice = {totalPrice}
              />
            </div>
            
            
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>

      {qrPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
          <div className="max-w-md">
            <KhqrGenerator resFromKHQR={resFromKHQR} onClose={() => setQrPopup(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
