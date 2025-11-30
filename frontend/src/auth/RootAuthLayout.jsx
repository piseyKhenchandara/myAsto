import React, { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import asto_logo from '../assets/logoes/asto_logo.png'
import ScrollToTop from '../../utils/ScrollToTheTop'
import { logPageView } from '../../utils/analytics'
const RootAuthLayout = () => {

  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search)
  },[location]);

  return (
   
    <div className="w-full min-h-screen flex flex-col  bg-gray-50">
        <ScrollToTop/>
        <header className='w-full border-green-500 border-b-1 px-5 py-2'>
          <Link to='/'>
            <img src={asto_logo} alt="asto_logo" className='w-20 md:w-30' />
          </Link>
        </header>
          
        <main className="w-full ">
            <div className='max-w-[1920px] mx-auto  p-5' >
               <Outlet/>
            </div>
        </main>
        
    </div>
    
  )
}

export default RootAuthLayout