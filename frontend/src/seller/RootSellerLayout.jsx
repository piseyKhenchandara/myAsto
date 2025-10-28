import React from 'react'
import Header from './components/header/Header'
import LeftNavbar from './components/leftNavbar/LeftNavbar'
import MainContent from './components/mainContent/MainContent'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../seller/components/footer/Footer'
import facebook_logo from '../assets/logoes/facebook_logo.png'
import ig_logo from '../assets/logoes/ig_logo.png'
import tiktok_logo from '../assets/logoes/tiktok_logo.png'
import telegram_logo from '../assets/logoes/telegram_logo.png'
import asto_logo from '../assets/logoes/asto_logo.png'

const RootSellerLayout = () => {
    const [visible, setVisible] = useState(false);
    const [active, setActive] = useState('');
    const location = useLocation();

    
    return (
        <>
            <Header setVisible = {setVisible} asto_logo={asto_logo}/>


            <div className="w-full ">
                <div className=' mx-auto ' >

                    
                    <div className='w-full flex justify-center'>
                        <aside
                            className={`w-0 h-[calc(100vh-80px)] overflow-y-auto thin-scroll bg-white border-r-2 border-gray-300 transition-transform duration-1000 ${
                            visible
                                ? "translate-x-0 md:w-[30%] w-full sticky top-[50px]"
                                : "-translate-x-full w-0"
                            }`}
                        >
            
                            <LeftNavbar visible = {visible} />
                        </aside>
                   
                        <main
                            className={`pb-10  ${
                                    visible
                                    ? "hidden md:w-[70%] md:inline-flex md:flex-col "
                                    : "w-full flex flex-col "
                                }`}
                            >                      
                                <MainContent visible={visible} asto_logo = {asto_logo}/>         
                        </main>
                    </div>
                        
                </div>
                            
            </div>
=
        </>
    )
}

export default RootSellerLayout