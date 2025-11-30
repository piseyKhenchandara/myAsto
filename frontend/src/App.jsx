import React, { useEffect } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
}
from 'react-router-dom'

import RootSellerLayout from './seller/RootSellerLayout'

import RootCustomerLayout from './customer/RootCustomerLayout'
import RedirectToFirstBrand from './seller/components/category_brand_product/productManagement/products/RedirectToFirstBrand'
import ProductDetail from './seller/components/category_brand_product/productManagement/products/ProductDetail'
import ProductEdit from './seller/components/category_brand_product/productManagement/products/ProductEdit'
import BrandManagement from './seller/components/category_brand_product/brandManagement/main/BrandManagement'
import CategoryManagement from './seller/components/category_brand_product/categoryManagement/CategoryManagement'
import Products from './seller/components/category_brand_product/productManagement/products/main/Products'
import Homepage from './customer/pages/Homepage'
import RootAuthLayout from './auth/RootAuthLayout'
import Login from './auth/pages/Login'
import Signup from './auth/pages/Signup'
import ForgotPassword from './auth/pages/ForgotPassword'
import ResetPassword from './auth/pages/ResetPassword'
import VerifyEmail from './auth/pages/VerifyEmail'
import Logout from './auth/components/Logout'
import {guestOnlyLoader, requireAuth, requireSellerNAdmin, verificationOnlyLoader} from './auth/components/loader'
import { UserProvider, useUser } from '../context/UserContext'
import Auth from './customer/pages/auth/Auth'
import Order from './customer/pages/checkout/Order/Order'
import { CartProvider } from './customer/context/CartContext'
import EmailEntry from './auth/pages/EmailEntry'
import SearchResults from './seller/components/header/SearchResults'
import Users from './seller/components/user/Users'
import ViewAuthProfile from './seller/components/category_brand_product/ViewAuthProfile'
import Orders from './seller/components/orderManagement/Orders'
import { NotificationProvider } from '../context/notificationContext/NotificationContext'
import AboutUs from '../utils/AboutUs'
import { initGA } from '../utils/analytics'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/auth' element = {<RootAuthLayout/>}>
        <Route index element={<EmailEntry/>} /> 
        <Route path='login' element={<Login/>} />
        <Route path='signup' element={<Signup/>} />
        <Route path='forgot-password' element={<ForgotPassword/>} />
        <Route path='reset-password' element={<ResetPassword/>} />

        <Route path='verify-email' 
          element={<VerifyEmail/>}
          loader = {verificationOnlyLoader} 
       />

        <Route path='logout' element = {<Logout/>}/>
      </Route>



      <Route path='/' element = {<RootCustomerLayout/>}>
        <Route index element = {<Homepage/>}/>
        <Route path='asto-homepage' element = {<Homepage/>}/>
        <Route path='category/:category_slug/brands' element = {<BrandManagement/>}/>
        <Route path='category/:category_slug/brand/first/products' element={<RedirectToFirstBrand/>}/>
        <Route path='category/:category_slug/brand/:brand_slug/products' element={<Products/>}/>
        <Route path='category/:category_slug/brand/:brand_slug/product/detail/:id/:product_slug' element= {<ProductDetail/>}/>
        <Route path='checkout-page' element = {<Order/>} loader = {requireAuth}/>
        <Route path='user-profile' element = {<Auth/>} loader = {requireAuth}/>
        <Route path='about-us' element= {<AboutUs/>}/>
      </Route>



      <Route path='/dashboard' element = {<RootSellerLayout/>} loader = {requireSellerNAdmin}>
        <Route path="results" element={<SearchResults />} />
        <Route path='categories' element= {<CategoryManagement/>} />
        <Route path='category/:category_slug/brands' element = {<BrandManagement/>}/>
        <Route path='category/:category_slug/brand/first/products' element={<RedirectToFirstBrand/>}/>
        <Route path='category/:category_slug/brand/:brand_slug/products' element={<Products/>}/>
        <Route path='category/:category_slug/brand/:brand_slug/product/detail/:id/:product_slug' element= {<ProductDetail/>}/>
        <Route path='category/:category_slug/brand/:brand_slug/product/detail/edit/:id/:product_slug' element= {<ProductEdit/>}/>
        <Route path= 'view-all-users' element = {<Users/>}/>

        <Route path='User-profile/:user_id/receipts' element = {<ViewAuthProfile/>}/>
        <Route path='view-all-orders' element = {<Orders/>}/>
        <Route path='about-us' element= {<AboutUs/>}/>
      </Route>
        
    </>
  )
)



const App = () => {

  useEffect(()=> {
    initGA();
  },[]);
  

  return (
    <UserProvider>
    <NotificationProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
    </NotificationProvider>
    </UserProvider>
   
  )
}

export default App
