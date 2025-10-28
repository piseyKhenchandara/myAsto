import React from 'react';
import Items from './Items';
import Delivery from './Delivery';
import PaymentSummary from './PaymentSummary';
import CustomerInfo from './CustomerInfo';

const OrderDetail = ({ theReceipt, setOpen }) => {
  if (!theReceipt) {
    return <p>Loading...</p>;
  }

  const order = theReceipt.order;

  return (
    <article className="rounded-lg w-[95%] sm:w-[90%] mx-auto p-3 sm:p-5 ">
     <div className="bg-gray-50 mx-auto max-w-[900px] max-h-[70vh] md:max-h-none overflow-y-scroll md:overflow-visible rounded-2xl px-4 sm:px-6 py-5 sm:py-6 animation_form_popup">
        {/* Header */}
        <header className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4'>
          <div className='text-center sm:text-left mb-3 sm:mb-0 '>
            <h4 className="text-lg sm:text-xl font-bold text-gray-800">
              Order #{order?.order_number}
            </h4>
            <time className='text-gray-600 text-sm block'>
              {new Date(order?.Payment.paid_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>

          <button 
            onClick={() => setOpen(false)}
            className='text-gray-500 hover:text-gray-700 text-3xl sm:text-3xl self-end sm:self-auto cursor-pointer'
            aria-label="Close order details"
          >
            ×
          </button>
        </header>

        {/* Main Content */}
        <section className='grid grid-cols-1 lg:grid-cols-9 gap-5'>
          {/* Left Column */}
          <div className='lg:col-span-6 space-y-5'>
            <Items items={order?.OrderItems} />
            <Delivery deliveryCompany={order?.delivery_company} />
            <PaymentSummary 
              orderItems={order?.OrderItems}
              deliveryCompany={order?.delivery_company}
              discountAmount={order?.discount_amount}
            />
          </div>

          {/* Right Column */}
          <aside className='lg:col-span-3'>
            <CustomerInfo 
              user={order?.User}
              shippingAddress={order?.shipping_address}
              phoneNumber={order?.phone_number}
            />
          </aside>
        </section>
      </div>
    </article>
  );
};

export default OrderDetail;