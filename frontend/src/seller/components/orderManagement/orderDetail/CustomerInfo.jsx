import React from 'react';
import { CiMail } from "react-icons/ci";
import { LuPhone } from "react-icons/lu";

const CustomerInfo = ({ user, shippingAddress, phoneNumber }) => {
  return (
    <article className='bg-white rounded-lg shadow-lg p-4 sm:p-5 space-y-6 h-full border-b-2 border-green-600'>
      {/* Customer Header */}
      <section>
        <h5 className='font-bold text-gray-800 mb-3 text-base sm:text-lg text-center sm:text-left'>
          Customer
        </h5>

        <div className='flex flex-col sm:flex-row sm:items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer'>
          <figure className='w-14 h-14 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden mx-auto sm:mx-0'>
            {user?.profile_picture ? (
              <img 
                src={user.profile_picture} 
                alt={user?.name}
                className='w-full h-full object-cover'
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerText = user?.name?.charAt(0).toUpperCase() || 'U';
                }}
              />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </figure>
          <span className='font-medium text-gray-800 text-center sm:text-left'>
            {user?.name || 'Unknown'}
          </span>
        </div>
      </section>

      {/* Contact Info */}
      <section>
        <h6 className='font-semibold text-gray-800 mb-3 text-sm sm:text-base text-center sm:text-left'>
          Contact Info
        </h6>
        <address className='space-y-2 text-sm sm:text-base text-gray-600 text-center sm:text-left not-italic'>
          <div className='flex justify-center sm:justify-start items-center gap-2'>
            <CiMail className='text-lg' />
            <span className='truncate'>{user?.email || 'N/A'}</span>
          </div>
          <div className='flex justify-center sm:justify-start items-center gap-2'>
            <LuPhone className='text-lg' />
            <span>{phoneNumber || 'N/A'}</span>
          </div>
        </address>
      </section>

      {/* Shipping Address */}
      <section>
        <h6 className='font-semibold text-gray-800 mb-3 text-sm sm:text-base text-center sm:text-left'>
          Shipping Address
        </h6>
        <address className='text-sm sm:text-base text-gray-600 space-y-1 text-center sm:text-left not-italic'>
          <p className='font-medium text-gray-800'>name : {user?.name || 'N/A'}</p>
          <p>name : {phoneNumber || 'N/A'}</p>
          <p>address : {shippingAddress || 'N/A'}</p>
        </address>
      </section>
    </article>
  );
};

export default CustomerInfo;