 import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

const CategoryHeader = ({ loadingUserRole, whoami, handleOpenAdd }) => {
  if (loadingUserRole) {
    return <p className="text-center text-green-300">loading....permission</p>;
  }

  if (whoami?.role === 'seller' || whoami?.role === 'admin') {
    return (
      <header className="px-6 bg-gray-200 mx-auto">
        <div className="flex justify-between items-center md:w-[50%] py-1">
          <h4 className="text-lg font-semibold text-gray-700">
            Categories Section
          </h4>
          <button
            className="rounded-[10px] flex items-center shadow-md shadow-green-400 cursor-pointer hover:text-white transition duration-200 bg-green-500 hover:bg-green-500 text-white py-1 px-3 gap-2"
            onClick={handleOpenAdd}
          >
            Add
            <IoIosAddCircleOutline className="text-2xl sm:text-3xl" />
          </button>
        </div>
      </header>
    );
  }

  return null;
};

export default CategoryHeader;
