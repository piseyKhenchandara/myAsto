import React from 'react'
import { useState } from 'react'
import { 
    Product_Management, 
    Overview_Analytics,
    Order_Management,
    Customer_Management,
    Reviews_Ratings,
    Media_Manager,
    Reports_Analytics,
    Security_Setting,
    Notifications,
    Category_Management,
    Brand_Management,
} from './ContentUnderLeftNavbar';

import { useNotifications } from "../../../../context/notificationContext/NotificationContext";


    const LeftNavbar = ({visible}) => {

        const menu = [
    { choice: "Overview / Analytics", icon: "📊" },
    { choice: "Product Management", icon: "📦" },
    { choice: "Category Management", icon: "🏷️" },
    { choice: "Customer Management", icon: "👥" },
    { choice: "Order Management", icon: "📬" },
    { choice: "Reviews & Ratings", icon: "⭐" },
    { choice: "Media / Cloudinary Manager", icon: "🖼️" },
    { choice: "Reports & Analytics", icon: "📊" },
    { choice: "Security & Setting", icon: "🔐" },
    { choice: "Notifications", icon: "🔔" }
    ];

    const [active, setActive] = useState("Overview / Analytics");

    const renderContent = () => {
    switch (active) {
        case "Overview / Analytics":
        return <Overview_Analytics />;
        case "Product Management":
        return <Product_Management />;
        case "Category Management":
        return <Category_Management />;
        case "Brand Management":
        return <Brand_Management />;
        case "Customer Management":
        return <Customer_Management />;
        case "Order Management":
        return <Order_Management />;
        case "Reviews & Ratings":
        return <Reviews_Ratings />;
        case "Media / Cloudinary Manager":
        return <Media_Manager />;
        case "Reports & Analytics":
        return <Reports_Analytics />;
        case "Security & Setting":
        return <Security_Setting />;
        case "Notifications":
        return <Notifications />;
        default:
        return <p>Select a section</p>;
    }
    };



  return (
 
            <nav className="min-h-full">
              {menu.map((eachChoice, index) => (
                <details
                  key={index}
                  open={active === eachChoice.choice}
                  className={`py-4 cursor-pointer ${
                    active === eachChoice.choice ? "bg-gray-200" : ""
                  } transition duration-300 border-b-1 border-gray-300`}
                >
                  <summary 
                    className="flex bg-white px-4 justify-between list-none"
                    onClick={() => setActive(eachChoice.choice)}
                  >
                    <span className="hover:text-green-800">{eachChoice.choice}</span>
                    <span>{eachChoice.icon}</span>
                  </summary>
                  <div className="flex justify-end px-2">
                    {active === eachChoice.choice && renderContent(eachChoice.choice)}
                  </div>
                </details>
              ))}
            </nav>
     
  )
}

export default LeftNavbar