// In MainContent.jsx
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import CategoryScroll from '../category_brand_product/CategoryScroll'



// In MainContent.jsx
const MainContent = ({ visible, asto_logo }) => {
    const location = useLocation();
    
    return (
        <div>
            {location.pathname === '/dashboard' && (
                <div>
                    <h1>Dashboard Home</h1>
                
                </div>
          
        )}
        <Outlet context={{ visible }} />
        </div>
    );
};

export default MainContent