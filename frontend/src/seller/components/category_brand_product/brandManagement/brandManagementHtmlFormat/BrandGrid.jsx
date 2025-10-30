import React from 'react';
import { FaCircle } from "react-icons/fa6";
import BrandCard from './BrandCard';

const BrandGrid = ({ 
  loading, 
  brands, 
  brand_slug, 
  showname, 
  checkUserRole, 
  getBrandPath, 
  setShowName, 
  handleOpenEdit, 
  handleOpenDelete 
}) => {
  return (
    <section className="relative p-6 bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-lime-300 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-300 rounded-full blur-lg animate-pulse"></div>
      </div>

      {loading && <p className='text-gray-500 text-center'>Loading brands...</p>}

      {!loading && brands.length === 0 && (
        <h4 className="text-center text-gray-500">No brands found.</h4>
      )}

      {!loading && brands.length > 0 && (
        <div className='flex items-center w-full flex-col'>
          <h4 className='text-center text-green-600'>Choose your brand</h4>
          
          <div className='flex flex-wrap gap-3 md:gap-5 w-[80%] py-4 overflow-visible justify-center'>
            {brands.map((eachBrand, index) => (
              <BrandCard
                key={eachBrand.id || index}
                brand={eachBrand}
                isSelected={brand_slug === eachBrand.slug}
                brandPath={getBrandPath(eachBrand.slug)}
                checkUserRole={checkUserRole}
                onNameClick={() => setShowName(eachBrand.name)}
                onEdit={() => handleOpenEdit(eachBrand)}
                onDelete={() => handleOpenDelete(eachBrand)}
              />
            ))}
          </div>  
          
          <p className='text-green-600 text-center border px-2 rounded-[15px]'>
            <span><FaCircle className='text-[12px] inline pr-2' /></span> 
            selected: {showname}
          </p>
        </div>
      )}
    </section>
  );
};

export default BrandGrid;