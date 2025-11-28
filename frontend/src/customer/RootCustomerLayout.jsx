import React, { useEffect, useState } from 'react'

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import asto_logo from '../assets/logoes/asto_logo.png'
import { useUser } from '../../context/UserContext'
import facebook_logo from '../assets/logoes/facebook_logo.png'
import ig_logo from '../assets/logoes/ig_logo.png'
import tiktok_logo from '../assets/logoes/tiktok_logo.png'
import telegram_logo from '../assets/logoes/telegram_logo.png'
import Header from '../seller/components/header/Header'
import ScrollToTop from '../../utils/ScrollToTheTop'
import Footer from '../../utils/Footer'


const RootCustomerLayout = () => {

  const {user : whoami} = useUser();

  const location = useLocation();
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();



 useEffect(() => {

  if (
    location.pathname.startsWith('/') &&
    !location.pathname.startsWith('/auth') &&
    !location.pathname.startsWith('/dashboard')
  ) {
    const timer = setInterval(() => {
      setPopup(true);
    }, 200);
    return () => clearInterval(timer);     
  }
}, [location.pathname]);

  return (
    <div className='w-full min-h-screen flex flex-col  bg-gray-50'>

      {!location.pathname.includes('products') && <ScrollToTop/>}
      <Header asto_logo = {asto_logo} />
      <main className="w-full min-h-screen">
        <div className='mx-auto'>



          <Outlet />
          
          {!whoami && popup && (
            <aside className='inset-0 flex justify-center items-center fixed bg-black/50 z-50'>
              <div className='text-center bg-black text-white px-8 max-w-[400px] rounded-[30px] py-8 space-y-6 shadow-lg shadow-white animation_form_popup'>
                <h4>Welcome</h4>
                <p className='text-wrap'>
                  signup now! to get <span className='text-green-500 border-b-1'>a free mouse pad</span> when you buy your first product!
                </p>
                
                <div className='flex flex-col items-center gap-2'>
                  <button 
                    className='bg-white text-black py-2 w-[80%] rounded-[15px] cursor-pointer hover:scale-105 transition-transform duration-100' 
                    onClick={() => navigate('/auth/login')}
                  >
                    login
                  </button>
                  <button 
                    className='bg-green-600 py-2 w-[80%] rounded-[15px] cursor-pointer hover:scale-105 transition-transform duration-100' 
                    onClick={() => navigate('/auth/signup')}
                  >
                    signup
                  </button>
                </div>
              </div>
            </aside>
          )}

        </div>              
      </main>
      
      <Footer
        facebook_logo={facebook_logo}
        ig_logo={ig_logo}
        tiktok_logo={tiktok_logo}
        telegram_logo={telegram_logo}
      />
    </div>
  )
}

export default RootCustomerLayout