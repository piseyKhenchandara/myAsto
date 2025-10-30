import React, { useState } from 'react';
import { FaBars } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { useUser } from '../../../../context/UserContext';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from '../../../customer/context/CartContext';
import LanguageChoice from './LanguageChoice';
import RingNotification from './RingNotification';
import SearchPopup from './searchPopup/SearchPopup';


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
    <header className="w-full border-b border-green-600 shadow-md bg-white sticky top-0 z-50">
      <nav className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 max-w-[1920px] mx-auto">
        
        {/* Left Section - Menu & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-shrink">
          {/* Hamburger Menu - Only show for dashboard users */}
          {checkUserRole && location.pathname.includes('/dashboard') && (
            <button 
              className="text-xl sm:text-xl md:text-2xl lg:text-2xl cursor-pointer flex-shrink-0 hover:text-green-600 transition-colors"
              onClick={() => setVisible((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>
          )}
          
          {/* Logo */}
          <Link to={checkUserRole ? "/dashboard" : "/"} className="flex-shrink-0">
            <img
              src={asto_logo}
              alt="asto_logo"
              className="h-7 xs:h-8 sm:h-9 md:h-10 lg:h-11 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
            />
          </Link>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-3 md:gap-4 lg:gap-5 flex-shrink-0">
          
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
              <div className='relative flex items-center hover:opacity-80 transition-opacity'>
                <AiOutlineShoppingCart className="cursor-pointer text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-3xl font-bold" />
                {getCartCount() > 0 && (
                  <span className='absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 min-w-[16px] sm:min-w-[18px] md:min-w-[20px] h-[16px] sm:h-[18px] md:h-[20px] flex items-center justify-center text-[10px] sm:text-xs md:text-xs font-semibold text-white bg-green-500 rounded-full px-1'>
                    {getCartCount()}
                  </span>
                )}
              </div>
            </Link>
          )}

          {/* Notification */}
          {checkUserRole && <div className="flex items-center flex-shrink-0 ">
            <RingNotification/>
          </div>}
          
          {/* Profile */}
          <Link to="/User-profile" className="flex-shrink-0">
            <CgProfile className='cursor-pointer text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-3xl hover:text-gray-800 transition-colors'/>
          </Link>
          
          {/* Language Choice Component */}
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