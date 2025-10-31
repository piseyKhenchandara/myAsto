import React from 'react';
import { NavLink } from 'react-router-dom';
import { CiEdit, CiTrash } from 'react-icons/ci';

const BrandCard = ({ 
  brand, 
  isSelected, 
  brandPath, 
  checkUserRole, 
  onNameClick, 
  onEdit, 
  onDelete 
}) => {
  return (
    <article 
      className={`relative flex flex-col items-center p-2 border rounded-[20px] border-green-500 hover:scale-110 hover:shadow-green-400 cursor-pointer transition-transform group ${
        isSelected ? 'shadow-green-500 scale-110 shadow-2xl' : ""
      } hover:z-25 `}

      
    >

      <NavLink 
        to={brandPath} 
        onClick={onNameClick}
      >
        <img
          src={brand.image_url}
          alt={brand.name}
          className={`${
            checkUserRole 
              ? 'w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16' 
              : 'w-14 h-14 sm:w-15 sm:h-15 md:w-20 md:h-20'
          } object-contain mb-2 z-0`}
        />
      </NavLink>

      {checkUserRole && (
        <div className="flex justify-between w-full">
          <button 
            className="rounded-[10px] flex items-center cursor-pointer transition duration-200 py-1 text-xl sm:text-2xl text-green-500" 
            onClick={onEdit}
          >
            <CiEdit />
          </button>

          <button 
            className="rounded-[10px] flex items-center cursor-pointer transition duration-200 py-1 text-xl sm:text-2xl text-red-500" 
            onClick={onDelete}
          >
            <CiTrash />
          </button>
        </div>
      )}

      <span className="absolute top-full mt-1 bg-gray-800 text-white text-xs rounded-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
        {brand.name}
      </span>
    </article>
  );
};

export default BrandCard;