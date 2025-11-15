import React from 'react';
import { Link } from 'react-router-dom';
import { GrNext } from "react-icons/gr";
import { MdArrowBackIos } from "react-icons/md";
import { CiTrash } from 'react-icons/ci';

const BannerSlider = ({
  banners,
  currentIndex,
  isAutoPlaying,
  goToPrevious,
  goToNext,
  goToSlide,
  checkUserRole,
  category_slug,
  brand_slug,
  handleOpenDelete
}) => {
  return (
    // ✅ Increased heights across all breakpoints
    <div className='relative w-full h-64 sm:h-80 overflow-hidden bg-gray-100'>
      {/* Banner Container */}
      <div
        className='flex transition-transform duration-1000 ease-in-out h-full'
        style={{
          transform: `translateX(-${currentIndex * (window.innerWidth >= 768 ? (100 / 3) : 100)}%)`,
        }}
      >
        {banners.map((b, index) => (
          <div
            key={b.Product?.id || index}
            className='flex-shrink-0 relative md:w-1/3 w-full group'
          >
            <Link
              className='block w-full h-full relative'
              to={checkUserRole 
                ? `/dashboard/category/${category_slug}/brand/${brand_slug}/product/detail/${b.Product?.id}/${b.Product.slug}` 
                : `/category/${category_slug}/brand/${brand_slug}/product/detail/${b.Product?.id}/${b.Product.slug}`
              }
            >
              {/* ✅ Changed from object-contain to object-cover */}
              <img
                src={b.image_url}
                alt={b.Product?.name}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                loading='lazy'
              />

              {/* Rest of your code remains the same... */}
              {checkUserRole && (
                <div>
                  <div className='absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent text-white p-3 sm:p-4'>
                    <p className='text-xs sm:text-sm mb-1'>
                      <span className='text-gray-300'>ID:</span>
                      <span className='bg-white/20 px-2 py-1 rounded ml-1 font-mono'>{b.Product?.id}</span>
                    </p>
                    {b.Product?.name && (
                      <p className='text-sm sm:text-lg font-semibold line-clamp-2 leading-tight'>
                        {b.Product?.name}
                      </p>
                    )}
                  </div>

                  <button
                    className="absolute bottom-3 left-3 flex items-center cursor-pointer transition-all duration-200 py-1 px-2 text-xl sm:text-2xl text-red-400 z-30 bg-black/80"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenDelete(b);
                    }}
                  >
                    <CiTrash />
                  </button>

                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center'>
                    <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-medium'>
                      View Product
                    </div>
                  </div>
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation and other elements remain the same... */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className='absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 md:hidden'
          >
            <MdArrowBackIos className="text-lg sm:text-xl" />
          </button>
          <button
            onClick={goToNext}
            className='absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 md:hidden'
          >
            <GrNext className="text-lg sm:text-xl" />
          </button>
        </>
      )}

      {banners.length > 1 && (
        <div className='absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 md:hidden'>
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-125 shadow-lg'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      <div className='absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs backdrop-blur-sm'>
        <span className='md:hidden'>{currentIndex + 1} / {banners.length}</span>
        <span className='hidden md:inline'>{Math.min(currentIndex + 3, banners.length)} / {banners.length}</span>
        {isAutoPlaying && <span className='ml-1 sm:ml-2 text-green-400'>●</span>}
      </div>

      {banners.length > 1 && isAutoPlaying && (
        <div className='absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-white/20'>
          <div
            className='h-full bg-green-500 transition-all duration-75 ease-linear'
            style={{
              width: '100%',
              animation: `progress-bar ${window.innerWidth >= 768 ? '2s' : '3s'} linear infinite`
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default BannerSlider;