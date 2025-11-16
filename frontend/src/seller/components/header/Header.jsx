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
  const { user: whoami} = useUser();

  const checkUserRole = whoami?.role === 'admin' || whoami?.role === 'seller';
  const toggleSearchPopup = () => setSearchPopup(!searchPopup);

  const iconSizeClass = "text-3xl"; // same size for all icons

  return (
    <header className="w-full border-b border-green-600 shadow-md bg-white sticky top-0 z-50">
      <nav className="flex flex-wrap items-center justify-between px-3 sm:px-6 md:px-8 py-3 max-w-[1920px] mx-auto">
        
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
          {checkUserRole && location.pathname.includes('/dashboard') && (
            <button 
              className={`${iconSizeClass} cursor-pointer hover:text-green-600 transition-colors`}
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

        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 flex-wrap">
          
          <div className="flex-shrink-0">
            <SearchPopup toggleSearchPopup={toggleSearchPopup} searchPopup={searchPopup} />
          </div>

          {!checkUserRole && (
            <Link to="/checkout-page" className="relative flex items-center flex-shrink-0 hover:opacity-90 transition-opacity">
              <AiOutlineShoppingCart className={`${iconSizeClass} text-gray-800 hover:text-green-600 transition-colors`} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-2 sm:-top-1.5 sm:-right-2 md:-top-2 md:-right-3 min-w-[18px] sm:min-w-[20px] md:min-w-[22px] h-[18px] sm:h-[20px] md:h-[22px] flex items-center justify-center text-[10px] sm:text-xs font-semibold text-white bg-green-500 rounded-full px-1">
                  {getCartCount()}
                </span>
              )}
            </Link>
          )}

          {checkUserRole && (
            <div className="flex items-center flex-shrink-0">
              <RingNotification />
            </div>
          )}

          <Link to="/user-profile" className="flex-shrink-0">
            {whoami?.profile_picture ? (
              <img 
                src={whoami.profile_picture} 
                alt='user profile picture'
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-green-600"
              />
            ) : (
              <CgProfile className={`${iconSizeClass} text-gray-800 hover:text-green-600 transition-colors`} />
            )}
          </Link>

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
