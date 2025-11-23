import React from 'react';

const PaymentSummary = ({ orderItems, deliveryCompany, discountAmount }) => {
  const subtotal = orderItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const delivery = 0;
  const discount = parseFloat(discountAmount) || 0;
  const total = subtotal + delivery - discount; //  Removed tax

  return (
    <section className='bg-white rounded-lg shadow-lg p-4 sm:p-5 border-b-2 border-green-600'>
      <h5 className='font-bold text-gray-800 mb-4 text-base sm:text-lg text-center sm:text-left'>
        Payment Summary
      </h5>

      <dl className='space-y-3 text-sm sm:text-base'>
        {/* Subtotal */}
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center'>
          <dt className='text-gray-600'>
            Subtotal ({orderItems?.length || 0} items)
          </dt>
          <dd className='font-medium text-gray-800'>
            ${subtotal.toFixed(2)}
          </dd>
        </div>

        {/* Delivery */}
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center'>
          <dt className='text-gray-600'>Delivery</dt>
          <dd className='font-medium text-gray-800'>{delivery === 0? <span className='text-green-600'>Free</span> : '$2'}</dd>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center text-green-600'>
            <dt>Discount</dt>
            <dd className='font-medium'>-${discount.toFixed(2)}</dd>
          </div>
        )}

        {/* Divider */}
        <div className='border-t border-gray-400 border-dashed pt-3 mt-3'>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center text-center sm:text-left'>
            <dt className='font-bold text-gray-800'>
              Total paid by customer
            </dt>
            <dd className='font-bold text-gray-800 text-lg sm:text-xl'>
              ${total.toFixed(2)}
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
};

export default PaymentSummary;