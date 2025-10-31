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
    <section className="relative px-4 py-8 bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100 overflow-hidden">
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
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          Choose Your Brand
        </h2>
          
          <div className='flex flex-row md:gap-8 gap-4 justify-center flex-wrap items-center max-w-6xl mx-auto'>
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
          
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-sm rounded-full border border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 text-sm md:text-base font-medium">
                Selected: {showname}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BrandGrid;