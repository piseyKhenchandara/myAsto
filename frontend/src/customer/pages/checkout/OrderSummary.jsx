import React, { useState, useEffect } from 'react';
import asto_logo from '../../../assets/logoes/asto_logo.png'
import ReciptHeader from '../../components/recipt/reciptHeader';
import ReciptBody from '../../components/recipt/ReciptBody';

const OrderSummary = ({ 
  cart, 
  getCartCount, 
  calculateTotal,
  handleOrder,
  submit,
  isProcessing,
  whoami,
  phoneNumber,
  selectedLocation,
  selectedDeliveryCompany,
  setQrPopup
}) => {
  
  const [isTyping, setIsTyping] = useState(false);
  const [debouncedPhoneNumber, setDebouncedPhoneNumber] = useState(phoneNumber);
  
  // Debounce phone number input - wait for user to stop typing
  useEffect(() => {
    setIsTyping(true); 
    
    const timer = setTimeout(() => {
      setDebouncedPhoneNumber(phoneNumber);
      setIsTyping(false);

    }, 1000);
    
    return () => clearTimeout(timer);
  }, [phoneNumber]);
  
  // Validate if phone number has 9-10 digits
  const isPhoneNumberValid = () => {
    if (!debouncedPhoneNumber) return false;
    
    const cleanedPhone = debouncedPhoneNumber.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parentheses
    const digitCount = cleanedPhone.replace(/\D/g, '').length; // Count only digits
    
    return digitCount >= 9 && digitCount <= 10;
  };

  const allFieldsCompleted = !isTyping && isPhoneNumberValid() && selectedLocation && selectedDeliveryCompany;
  
  if (!allFieldsCompleted) {
    return null;
  }


  
  return (
    <section>
      <div className="bg-white rounded-lg shadow-md py-5 px-4 md:px-8 sticky top-4 space-y-5 animation_form_popup">
      
        <ReciptHeader asto_logo={asto_logo}/>

        <ReciptBody 
          cart={cart}
          date = {new Date()}
          getCartCount={getCartCount}
          handleOrder={handleOrder}
          isProcessing={isProcessing}
          whoami={whoami}
          phoneNumber={debouncedPhoneNumber}
          selectedLocation={selectedLocation}
          selectedDeliveryCompany={selectedDeliveryCompany}
          calculateTotal={calculateTotal}
        />

        <button
          onClick={handleOrder}
          disabled={isProcessing || cart.length === 0}

          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            isProcessing || cart.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } ${submit ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
        >
          {isProcessing ? 'Processing...' : 'Proceed to Order'}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Secure Order powered by SSL encryption
          </p>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;