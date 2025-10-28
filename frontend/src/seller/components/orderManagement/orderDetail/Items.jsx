import React from 'react';

const Items = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className='bg-white rounded-lg shadow-lg p-4 sm:p-5 border-b-2 border-green-600'>
      <div className='space-y-4'>
        {items.map((item, index) => {
          const mainImage = item.Product?.ProductImages?.find(img => img.is_main);
          const imageUrl = mainImage?.image_url || item.Product?.ProductImages?.[0]?.image_url;

          return (
            <article 
              key={index} 
              className='flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b last:border-b-0'
            >
              {/* Product Image */}
              <figure className='w-24 h-24 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex-shrink-0 mx-auto sm:mx-0'>
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={item.Product?.name}
                    className='w-full h-full object-cover rounded-lg'
                    onError={(e) => {
                      e.target.src = '/placeholder.png';
                    }}
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-gray-400'>
                    No Image
                  </div>
                )}
              </figure>

              {/* Product Details */}
              <div className='flex-1 text-center sm:text-left'>
                <h5 className='font-semibold text-gray-800 text-base sm:text-lg'>
                  {item.Product?.name || item.name}
                </h5>
              
              </div>

              {/* Price Info */}
              <div className='text-center sm:text-right flex-shrink-0'>
                <div className='flex justify-center sm:justify-end items-center gap-2'>
                  <span className='text-red-500 font-medium text-sm sm:text-base'>${item.price}</span>
                  {item.original_price && (
                    <span className='text-gray-400 line-through text-xs sm:text-sm'>
                      ${item.original_price}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className='text-center flex-shrink-0 w-full sm:w-12'>
                <span className='text-gray-600 text-sm sm:text-base'>
                  {item.quantity}
                </span>
              </div>

              
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Items;