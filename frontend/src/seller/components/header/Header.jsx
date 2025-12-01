import React, { useState } from 'react';
import { FaBars } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useUser } from '../../../../context/UserContext';
import { useCart } from '../../../customer/context/CartContext';
import LanguageChoice from './LanguageChoice';
import RingNotification from './RingNotification';
import SearchPopup from './searchPopup/SearchPopup';

const Header = ({ setVisible, asto_logo }) => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const [searchPopup, setSearchPopup] = useState(false);
  const { user: whoami } = useUser();

  const checkUserRole = whoami?.role === 'admin' || whoami?.role === 'seller';
  const toggleSearchPopup = () => setSearchPopup(!searchPopup);

  const iconSizeClass = "text-2xl"; // smaller icons = shorter header

  return (
    <header className="w-full border-b border-green-600 bg-white sticky top-0 z-50 shadow-sm">
      <nav className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 max-w-[1920px] mx-auto">
        
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {checkUserRole && location.pathname.includes('/dashboard') && (
            <button 
              className={`${iconSizeClass} hover:text-green-600`} 
              onClick={() => setVisible((prev) => !prev)}
            >
              <FaBars />
            </button>
          )}

          <Link to={checkUserRole ? "/dashboard" : "/"}>
            <img
              src={asto_logo}
              alt="asto_logo"
              className="h-7 sm:h-8 md:h-9 w-auto object-contain hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <SearchPopup toggleSearchPopup={toggleSearchPopup} searchPopup={searchPopup} />

          {!checkUserRole && (
            <Link to="/checkout-page" className="relative hover:opacity-90">
              <AiOutlineShoppingCart className={`${iconSizeClass} hover:text-green-600`} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] text-[10px] flex items-center justify-center bg-green-500 text-white rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>
          )}

          {checkUserRole && (
            <RingNotification />
          )}

          <Link to="/user-profile">
            {whoami?.profile_picture ? (
              <img 
                src={whoami.profile_picture}
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-green-600"
              />
            ) : (
              <CgProfile className={`${iconSizeClass} hover:text-green-600`} />
            )}
          </Link>

          <LanguageChoice />
        </div>
      </nav>

      <div id="google_translate_element" className="hidden"></div>
    </header>
  );
};

export default Header;

