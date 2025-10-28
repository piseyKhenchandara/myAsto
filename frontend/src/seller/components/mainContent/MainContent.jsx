// In MainContent.jsx
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import CategoryScroll from '../category_brand_product/CategoryScroll'



// In MainContent.jsx
const MainContent = ({ visible, asto_logo }) => {
    const location = useLocation();
    
    return (
        <main>
            {location.pathname === '/dashboard' && (
                <section>
                    <h1>Dashboard Home</h1>
                
                </section>
          
        )}
        <Outlet context={{ visible }} />
        </main>
    );
};

export default MainContent