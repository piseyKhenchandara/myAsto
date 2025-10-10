import React, { use, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { checkPaymentStatus } from '../../../api/payment.api';

const KhqrGenerator = ({ resFromKHQR, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [pollPayment, setPollPayment] = useState(null);
  const [message, setMessage] = useState({type : '',text : ""});




  useEffect(() => {
    console.log('KHQR Response:', resFromKHQR);
    if (!resFromKHQR?.qr_expiration) return;

    const calculateTimeLeft = () => {
      const expirationTime = new Date(resFromKHQR.qr_expiration).getTime();
      const now = Date.now();
      const difference = expirationTime - now;

      if (difference <= 0) {
        return { expired: true };
      }

      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { minutes, seconds, expired: false };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [resFromKHQR]);

  if (!resFromKHQR) {
    return (
      <div className='bg-white rounded-lg p-8 max-w-md w-full mx-4'>
        <div className='flex flex-col items-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4'></div>
          <p className='text-gray-600'>Generating KHQR code...</p>
        </div>
      </div>
    );
  }


  useEffect(() =>{
    
    const pollPayment = async () => {
      try{
        const response = await checkPaymentStatus(resFromKHQR.data.qr_md5, resFromKHQR.data.order_id);
        console.log(response);
        setPollPayment(response);
        
        if(response.success) {
          setMessage({type :"success", text : "payment successfully!✅"})
          clearInterval(pollInterval);
        }
      }

      catch(error) {
        setMessage({type :'error' , text  : error.response?.data.message || "failed to check payment transaction"});
      }
    }

    const pollInterval = setInterval(() => pollPayment(), 3000);
    const timeout = setTimeout(() => clearInterval(pollInterval), 5* 60 *1000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    }

  },[resFromKHQR?.data?.qr_md5, resFromKHQR?.data?.order_id])

  const isExpired = timeLeft?.expired;

  return (
    <div className='bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 relative'>
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      )}

      {/* Header */}
      <div className='text-center mb-6'>
        {message.type === 'error'? <p className='text-red-600'>{message.text}</p> : <p className='text-green-600'>{message.text}</p>}
        
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Scan to Pay</h2>
        <p className='text-gray-600'>Use your Bakong app to scan</p>
      </div>
    
      {/* QR Code */}
      <div className='bg-white p-4 rounded-lg border-2 border-gray-200 mb-6'>
        {isExpired ? (
          <div className='flex flex-col items-center justify-center h-64'>
            <svg className='w-16 h-16 text-red-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <p className='text-red-600 font-semibold text-lg'>QR Code Expired</p>
            <p className='text-gray-500 text-sm mt-2'>Please generate a new QR code</p>
          </div>
        ) : (
          <div className='flex justify-center'>
            <QRCode
              value={resFromKHQR.data.qr_code}
              size={256}
              level='H'
              className='max-w-full h-auto'
            />
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className='space-y-3 mb-6'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600'>Order Number:</span>
          <span className='font-semibold text-gray-800'>{resFromKHQR.data.order_number}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600'>Amount:</span>
          <span className='font-bold text-2xl text-green-600'>
            ${parseFloat(resFromKHQR.data.amount).toFixed(2)}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600'>Currency:</span>
          <span className='font-semibold text-gray-800'>{resFromKHQR.data.currency}</span>
        </div>
      </div>

      {/* Timer */}
      {timeLeft && !isExpired && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <svg className='w-5 h-5 text-yellow-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span className='text-yellow-800 font-medium'>Time remaining:</span>
            </div>
            <span className='text-yellow-900 font-bold text-lg'>
              {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <h3 className='font-semibold text-blue-900 mb-2'>How to pay:</h3>
        <ol className='text-sm text-blue-800 space-y-1 list-decimal list-inside'>
          <li>Open your Bakong app</li>
          <li>Tap on "Scan QR"</li>
          <li>Scan the QR code above</li>
          <li>Confirm the payment amount</li>
          <li>Complete the transaction</li>
        </ol>
      </div>

      {/* MD5 Hash (for verification) */}
      <div className='mt-4 text-center'>
        <p className='text-xs text-gray-400'>
          MD5: {resFromKHQR.data.qr_md5?.substring(0, 16)}...
        </p>
      </div>
    </div>
  );
};

export default KhqrGenerator;