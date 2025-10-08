import React, { useState } from 'react';
import { AiOutlineShoppingCart } from "react-icons/ai";
import cambodia_flag from '../../../assets/flag/cambodia_flag.png';
import SearchPopup from './SearchPopup';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { useUser } from '../../../../context/UserContext';
import { useCart } from '../../context/CartContext';

const Header = ({asto_logo}) => {
  const {getCartCount} = useCart();
  const {user : whoami} = useUser();
  
  const [searchPopup, setSearchPopup] = useState(false);

  const toggleSearchPopup = () => {
    setSearchPopup(!searchPopup);
  };

  return (
    <nav className="w-full border-b border-green-600 shadow-md bg-white sticky top-0 z-10">
      {location.pathname === '/user-profile' ? '' : 
        <div className="flex items-center justify-between px-4 py-1 max-w-[1920px] mx-auto md:text-2xl">

        <Link to="/">
            <img
            src={asto_logo}
            alt="asto_logo"
            className="h-10 w-auto object-contain cursor-pointer"
          />
        </Link>
        
        <div className="flex flex-row items-center gap-5">

          <SearchPopup toggleSearchPopup={toggleSearchPopup} searchPopup={searchPopup} />

          <Link to={whoami ? "/rd-page" : "/auth/signup"}>
            <div className='flex items-center '>
              <AiOutlineShoppingCart className="cursor-pointer " />
              <p className='translate-y-1 -translate-x-1 rounded-full px-2 bg-green-500'>{getCartCount()}</p>
            </div>

          </Link>

          <Link to="/user-profile">
            <CgProfile className='cursor-pointer'/>
          </Link>
          <img
            src={cambodia_flag}
            alt="Cambodia_flag"
            className="h-7 cursor-pointer md:h-9"
          />
        </div>
      </div>
      }
    </nav>
  );
};

export default Header;