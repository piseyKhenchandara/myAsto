
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'


const MainContent = ({ visible, asto_logo }) => {
    const location = useLocation();
    
    return (
        <main>
            {location.pathname === '/dashboard' && (
                <section>
                    <img src={asto_logo} alt="asto logo" className='opacity-25 min-w-[50px] mx-auto' />
                
                </section>
          
        )}
        <Outlet context={{ visible }} />
        </main>
    );
};

export default MainContent