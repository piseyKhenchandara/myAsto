import React from 'react'

const ReciptBody = (
    {
        cart, 
        getCartCount, 
        calculateTotal,

        whoami,
        phoneNumber,
        selectedLocation,
        selectedDeliveryCompany,
    }
) => {
  // Generate current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // Generate invoice number (you can customize this logic)
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

  return (
    <div className='flex flex-col font-bold p-4 max-w-full overflow-x-auto'>
      {/* Invoice Header */}
      <div className='self-end mb-4 text-sm sm:text-base'>
        <p>INVOICE NO: <span className='font-normal'>{invoiceNumber}</span></p>
        <p>DATE: <span className='font-normal'>{currentDate}</span></p>
      </div>

      {/* Client Information */}
      <div className='mb-6 text-sm sm:text-base'>
        <p>Client Name: <span className='font-normal'>{whoami?.name || 'N/A'}</span></p>
        <p>Client Phone: <span className='font-normal'>{phoneNumber || 'N/A'}</span></p>
        <p>Address: <span className='font-normal'>{selectedLocation || 'N/A'}</span></p>
       
      </div>



      {/* Items Table */}
      <div className='overflow-x-auto mb-4'>
        <table className='w-full border-collapse border border-gray-300 text-xs sm:text-sm'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border border-gray-300 p-2 text-left w-12'>No.</th>
              <th className='border border-gray-300 p-2 text-left min-w-32'>Item Description</th>
              <th className='border border-gray-300 p-2 text-center w-16'>Qty</th>
              <th className='border border-gray-300 p-2 text-right w-20'>Price</th>
              <th className='border border-gray-300 p-2 text-right w-20'>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart && cart.length > 0 ? (
              cart.map((item, index) => (
                <tr key={item.id || index} className='hover:bg-gray-50'>
                  <td className='border border-gray-300 p-2 font-normal'>{index + 1}</td>
                  <td className='border border-gray-300 p-2 font-normal'>
                    <div className='break-words'>
                      {item.name || item.title || item.description || 'Unknown Item'}
                    </div>
                  </td>
                  <td className='border border-gray-300 p-2 text-right font-normal'>
                    ${(Number(item.price) || 0).toFixed(2)}
                  </td>
                  <td className='border border-gray-300 p-2 text-center font-normal'>
                    {item.quantity || 1}
                  </td>
                  <td className='border border-gray-300 p-2 text-right font-normal'>
                    ${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className='border border-gray-300 p-4 text-center font-normal text-gray-500'>
                  No items in cart
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      {cart && cart.length > 0 && (
        <div className='self-end w-full sm:w-80'>
          
          <div className='flex justify-between mb-2 text-sm sm:text-base'>
            <span>Subtotal:</span>
            <span className='font-normal'>
              ${calculateTotal ? Number(calculateTotal()).toFixed(2) : '0.00'}
            </span>
          </div>
          <div className='flex justify-between mb-2 text-sm sm:text-base'>
            <span>Items Count:</span>
            <span className='font-normal'>
              {getCartCount ? getCartCount() : cart.length}
            </span>
          </div>
          <div className='flex justify-between text-lg sm:text-xl border-t pt-2 border-gray-300'>
            <span>TOTAL:</span>
            <span>
              ${calculateTotal ? Number(calculateTotal()).toFixed(2) : '0.00'}
            </span>
          </div>
         
        </div>
      )}

      {/* Footer/Notes Section */}
      <div className='mt-6 text-xs sm:text-sm'>
        <p className='font-normal text-gray-600'>
          Thank you for supporting us!
        </p>
        {selectedDeliveryCompany && (
          <p className='font-normal text-gray-600 mt-1'>
            Delivery will be handled by: {selectedDeliveryCompany}
          </p>
        )}
      </div>
    </div>
  )
}

export default ReciptBody