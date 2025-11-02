import { NavLink } from "react-router-dom";
import { useNotifications } from "../../../../context/notificationContext/NotificationContext";

 
 export const Overview_Analytics = () => (
      <section>

        <ul className="space-y-2">
          <li> Total Products</li>
          <li> Total Orders</li>
          <li> Total Customers</li>
          <li> Total Revenue</li>
          <li> Sales Chart (Daily/Monthly)</li>
          <li> Low Stock Alerts</li>
        </ul>
      </section>
    );

    export const Product_Management = () => ( 
      <section>
    
        <ul className="space-y-2">
          <li> 
            <NavLink
              to="/dashboard/categories"
              className={({ isActive }) =>
                ` ${isActive ? 'text-green-600' : ''}`
              }
              >
              View / Search / Filter Products
            </NavLink>
          </li>
          {/* <li><NavLink to= "/seller-dashboard/products/bulk" className={({isActive}) => `${isActive? "text-green-600" : ""}`}>Bulk Upload via CSV</NavLink> </li>
          <li> Organize by Categories/Brands</li> */}
        </ul>
      </section>
    );


    export const Category_Management = () => (
      <section>
        <ul className="space-y-2">
          <li>
             <NavLink to="/dashboard/categories" className={({isActive}) => isActive ? "text-green-600" : ""}>
              Add New Category
            </NavLink> 
          </li>
          {/* <li>Bulk Upload Categories</li> */}
        </ul>
      </section>
    );

    export const Brand_Management = () => (
      <section>
        <ul className="space-y-2">
          <li>Bulk Upload Brands</li>
          <li>
            <NavLink to="dashboard/category/sigma-keyboard/brand/asto/products" className={({isActive}) => isActive ? "text-green-600" : ""}>
            Brand Management
          </NavLink> 
          </li>
        </ul>
      </section>
    );

    export const Customer_Management = () => (
      <section>
      
        <ul className="space-y-2">
          
          <li>
            <NavLink to="/dashboard/view-all-users" className={({isActive}) => isActive ? "text-green-600" : ""}>

                View All Users
            </NavLink> 
          </li>
          {/* <li> Purchase History</li>
          <li> Ban / Block Accounts</li>
          <li> Contact or send notification</li> */}
        </ul>
      </section>
    );
    export const Order_Management = () => (
      <section>
        <ul className="space-y-2">
          <li>
            <NavLink to="/dashboard/view-all-orders" className={({isActive}) => isActive ? "text-green-600" : ""}>

                View All Orders
            </NavLink> 
          </li>
          
         {/*  <li> Update Order Status</li>
          <li> Invoice Download or View</li>
          <li> Return / Cancel Handling</li> */}
        </ul>
      </section>
    );


    export const Category_Brand_Management = () => (
      <section>
      
        <ul className="space-y-2">
          <li>
            <NavLink to="/seller-dashboard/brands" className={({isActive}) => isActive ? "text-green-600" : ""}>

                Add/Edit/Delete brands
            </NavLink> </li>
          <li> Associate Brands with Categories</li>
          <li> Slug URL Management</li>
        </ul>
      </section>
    );

    export const Reviews_Ratings = () => (
      <section>
      
        <ul className="space-y-2">
          <li> Moderate Reviews</li>
          <li> Average Rating per Product</li>
        </ul>
      </section>
    );

    export const Media_Manager = () => (
      <section>
      
        <ul className="space-y-2">
          <li> View Uploaded Images</li>
          <li> Organize by folder/tag</li>
          <li> Delete unused media</li>
        </ul>
      </section>
    );

    export const Reports_Analytics = () => (
      <section>
      
        <ul className="space-y-2">
          <li> Downloadable CSV Reports</li>
          <li> Revenue Trends</li>
          <li> Time-based filtering</li>
        </ul>
      </section>
    );

    export const Security_Setting = () => (
      <section>
        
        <ul className="space-y-2">
          <li> JWT Auth / Token Expiry</li>
          <li> Seller Profile Settings</li>
          <li> 2FA / Password Reset</li>
        </ul>
      </section>
  );

    export const Notifications = () => (
      <section>
        
        <ul className="space-y-2">
          <li> Order Alerts</li>
          <li> Product Issue Alerts</li>
          <li> Email Notification Logs</li>
        </ul>
      </section>
    );