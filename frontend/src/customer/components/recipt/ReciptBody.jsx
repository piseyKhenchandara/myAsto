import React from 'react'

const ReciptBody = (
    {
        cart, 
        invoiceNumber = 0,
        date = null,
        getCartCount, 
        calculateTotal,
        
        whoami,
        phoneNumber,
        selectedLocation,
        selectedDeliveryCompany,
    }
) => {
  return (
    <article className='flex flex-col font-bold p-4 max-w-full overflow-x-auto'>
      {/* Invoice Header */}
      <header className='self-end mb-4 text-xs text-gray-500'>
        {invoiceNumber === 0 ? "" : <p>INVOICE NO: <span className='font-normal'>{invoiceNumber}</span></p>}
        <p>Date :  
          <span>
            {date ? new Date(date).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }) : 'N/A'}
          </span>
        </p>
        
      </header>

      {/* Client Information */}
      <section className='mb-6 text-xs'>
        <p>Client Name: <span className='font-normal'>{whoami?.name || 'N/A'}</span></p>
        <p>Client Phone: <span className='font-normal'>{phoneNumber || 'N/A'}</span></p>
        <p>Address: <span>{selectedLocation || 'N/A'}</span></p>
        
      </section>
      {/* Items Table */}
      <section className='overflow-x-auto mb-4'>
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
                      <p>{item.name || item.title || item.description || 'Unknown Item'}<br/>
                        <span className='text-gray-500'>
                          {item.warranty && item.warranty !== 'none' && item.warranty !== '' && `(warranty: ${item.warranty})`}
                        </span>
                    
                      </p>
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
      </section>

            {/* Summary Section */}
      {cart && cart.length > 0 && (
        <section className='self-end w-full sm:w-80 text-xs'>
          
          <div className='flex justify-between mb-2 '>
            <span>Subtotal:</span>
            <span className='font-normal'>
              ${calculateTotal ? Number(calculateTotal()).toFixed(2) : '0.00'}
            </span>
          </div>
          
          <div className='flex justify-between mb-2 '>
            <span>Items Count:</span>
            <span className='font-normal'>
              {getCartCount ? getCartCount() : cart.length}
            </span>
          </div>
          
          {/* Delivery Fee */}
          <div className='flex justify-between mb-2 '>
            <span>Delivery Fee:</span>
            <span className='font-normal'>
              $2.00
            </span>
          </div>
          
          <div className='flex justify-between border-t pt-2 border-gray-300 text-base sm:text-lg'>
            <span>TOTAL:</span>
            <span>
              ${calculateTotal ? (Number(calculateTotal()) + 2).toFixed(2) : '2.00'}
            </span>
          </div>
        
        </section>
      )}

      {/* Footer/Notes Section */}
      <footer className='mt-6 text-xs sm:text-sm'>
        <p className='font-normal text-gray-500'>
          Thank you for supporting us!
        </p>
        {selectedDeliveryCompany && (
          <p className='font-normal text-gray-500 mt-1'>
            Delivery will be handled by: {selectedDeliveryCompany}
          </p>
        )}
      </footer>
    </article>
  )
}

export default ReciptBody