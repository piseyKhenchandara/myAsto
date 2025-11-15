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

  return (
    <header className="w-full border-b border-green-600 shadow-md bg-white sticky top-0 z-50">
      <nav className="flex flex-wrap items-center justify-between px-3 sm:px-6 md:px-8 py-3 max-w-[1920px] mx-auto">
        
        {/* Left Section - Menu & Logo */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
          {checkUserRole && location.pathname.includes('/dashboard') && (
            <button 
              className="text-2xl md:text-3xl cursor-pointer hover:text-green-600 transition-colors"
              onClick={() => setVisible((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>
          )}
          
          <Link to={checkUserRole ? "/dashboard" : "/"} className="flex-shrink-0">
            <img
              src={asto_logo}
              alt="asto_logo"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
            />
          </Link>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 flex-wrap">
          
          {/* Search Icon */}
          <div className="flex-shrink-0">
            <SearchPopup toggleSearchPopup={toggleSearchPopup} searchPopup={searchPopup} />
          </div>

          {/* Shopping Cart - Only for customers */}
          {!checkUserRole && (
            <Link to="/checkout-page" className="relative flex items-center flex-shrink-0 hover:opacity-90 transition-opacity">
              <AiOutlineShoppingCart className="text-2xl sm:text-3xl md:text-4xl text-gray-800 hover:text-green-600 transition-colors" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-2 sm:-top-1.5 sm:-right-2 md:-top-2 md:-right-3 min-w-[18px] sm:min-w-[20px] md:min-w-[22px] h-[18px] sm:h-[20px] md:h-[22px] flex items-center justify-center text-[10px] sm:text-xs font-semibold text-white bg-green-500 rounded-full px-1">
                  {getCartCount()}
                </span>
              )}
            </Link>
          )}

          {/* Notification (Admin/Seller only) */}
          {checkUserRole && (
            <div className="flex items-center flex-shrink-0">
              <RingNotification />
            </div>
          )}

          {/* Profile Icon */}
          <Link to="/User-profile" className="flex-shrink-0">
            <CgProfile className="text-2xl sm:text-3xl md:text-4xl text-gray-800 hover:text-green-600 transition-colors" />
          </Link>

          {/* Language Selector */}
          <div className="flex-shrink-0">
            <LanguageChoice />
          </div>
        </div>
      </nav>

      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" className="hidden"></div>
    </header>
  );
};

export default Header;
