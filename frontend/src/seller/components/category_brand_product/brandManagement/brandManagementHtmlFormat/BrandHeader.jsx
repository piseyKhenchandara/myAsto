import React from 'react';
import { IoIosAddCircleOutline } from "react-icons/io";

const BrandHeader = ({ checkUserRole, handleOpenAdd }) => {
  if (!checkUserRole) return null;

  return (
    <header className='bg-gray-200 px-6'>
      <div className="flex justify-between items-center md:w-[50%] py-1">
        <h4>Brands-section</h4>
        <button 
          className="rounded-btn flex items-center shadow-md shadow-primary-mid cursor-pointer hover:text-white transition duration-200 bg-primary-light hover:bg-primary text-white py-1 px-3 gap-2" 
          onClick={handleOpenAdd}
        >
          Add 
          <IoIosAddCircleOutline className="text-2xl sm:text-3xl" />
        </button>
      </div>
    </header>
  );
};

export default BrandHeader;