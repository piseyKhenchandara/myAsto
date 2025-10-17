import React, { useState } from 'react';
import SearchPopup from './SearchPopup';
import { FaBars } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { useUser } from '../../../../context/UserContext';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from '../../../customer/context/CartContext';
import LanguageChoice from './LanguageChoice'; // ADD THIS IMPORT
import { IoNotificationsOutline } from "react-icons/io5";

const Header = ({setVisible, asto_logo}) => {
  const location = useLocation();
  const {getCartCount} = useCart();
  const [searchPopup, setSearchPopup] = useState(false);
  const {user: whoami} = useUser();

  const checkUserRole = whoami?.role === 'admin' || whoami?.role === 'seller';

  const toggleSearchPopup = () => {
    setSearchPopup(!searchPopup);
  };

  return (
    <nav className="w-full border-b border-green-600 shadow-md bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-2 sm:px-4 py-1 max-w-[1920px] mx-auto">
        
        {/* Left Section - Menu & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Hamburger Menu - Only show for dashboard users */}
          {checkUserRole && location.pathname.includes('/dashboard') && (
            <FaBars 
              className="text-lg sm:text-xl md:text-2xl cursor-pointer flex-shrink-0"
              onClick={() => setVisible((prev) => !prev)}
            />
          )}
          
          {/* Logo */}
          <Link to={checkUserRole ? "/dashboard" : "/"} className="flex-shrink-0">
            <img
              src={asto_logo}
              alt="asto_logo"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4 sm:gap-3 md:gap-5 flex-shrink-0">
          
          {/* Search */}
          <div className="flex-shrink-0">
            <SearchPopup 
              toggleSearchPopup={toggleSearchPopup} 
              searchPopup={searchPopup} 
            />
          </div>

          {/* Shopping Cart - Only for customers */}
          {!checkUserRole && (
            <Link to="/checkout-page" className="flex-shrink-0">
              <div className='relative flex items-center'>
                <AiOutlineShoppingCart className="cursor-pointer text-2xl md:text-3xl font-bold" />
                {getCartCount() > 0 && (
                  <span className='absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs text-white bg-green-500 rounded-full px-1'>
                    {getCartCount()}
                  </span>
                )}
              </div>
            </Link>
          )}


          <IoNotificationsOutline className='cursor-pointer text-2xl md:text-3xl'/>

          
          {/* Profile */}
          <Link to="/User-profile" className="flex-shrink-0">
            <CgProfile className='cursor-pointer text-2xl md:text-3xl'/>
          </Link>

          
          {/* Language Choice Component */}
          <div className="flex-shrink-0">
            <LanguageChoice />
          </div>
        </div>
      </div>
      
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{display: 'none'}}></div>
    </nav>
  );
};

export default Header;