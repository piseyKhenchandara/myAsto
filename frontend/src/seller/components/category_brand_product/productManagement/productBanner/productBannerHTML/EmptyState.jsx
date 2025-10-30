import React from 'react';

const EmptyState = () => {
  return (
    <div className="text-center py-12 px-4">
      <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1" 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
        <p className='text-gray-500 text-center font-medium'>
          You have to add Product first before add Banner!
        </p>
        <p className='text-gray-400 text-sm mt-2'>
          Create some products to start showcasing them with banners
        </p>
      </div>
    </div>
  );
};

export default EmptyState;