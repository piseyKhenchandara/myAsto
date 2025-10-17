import React from 'react';
import vet_logo from '../../../../assets/logoes/vet_logo.png';
import jnt_logo from '../../../../assets/logoes/jnt_logo.png';
import grab_logo from '../../../../assets/logoes/grab_logo.png';

const Delivery = ({ deliveryCompany }) => {
  const deliveryInfo = {
    'Vireak Buntham': {
      logo: vet_logo,
      bgColor: 'bg-blue-100',
      subtitle: 'Express delivery'
    },
    'J&T': {
      logo: jnt_logo,
      bgColor: 'bg-red-100',
      subtitle: 'Fast shipping'
    },
    'Phnom Penh delivery': {
      logo: grab_logo,
      bgColor: 'bg-green-100',
      subtitle: 'Local delivery'
    }
  };

  const info = deliveryInfo[deliveryCompany] || {
    logo: null,
    bgColor: 'bg-gray-100',
    subtitle: 'Standard delivery'
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-4 sm:p-5 border-b-2 border-green-600'>
      <h5 className='font-bold text-gray-800 mb-4 text-base sm:text-lg text-center sm:text-left'>
        Delivery
      </h5>
      
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        {/* Left side - Logo & Info */}
        <div className='flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left'>
          <div className={`w-16 h-16 sm:w-12 sm:h-12 ${info.bgColor} rounded-lg flex items-center justify-center p-2`}>
            {info.logo ? (
              <img 
                src={info.logo} 
                alt={deliveryCompany}
                className='w-full h-full object-contain'
              />
            ) : (
              <span className='text-gray-600 font-bold text-xs'>SD</span>
            )}
          </div>

          <div>
            <p className='font-semibold text-gray-800 text-base sm:text-lg'>
              {deliveryCompany || 'Standard Delivery'}
            </p>
            <p className='text-sm text-gray-500'>{info.subtitle}</p>
          </div>
        </div>

        {/* Right side - Price */}
        <div className='text-center sm:text-right'>
          <p className='font-semibold text-gray-800 text-sm sm:text-base'>$2.00</p>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
