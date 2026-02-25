// src/components/NotFound.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-green-600">404</h1>
        <h2 className="text-4xl font-semibold text-green-600 mt-4">
          Page Not Found
        </h2>
        <p className="text-green-600 mt-4 text-lg">
          Oops! This page doesn't exist
        </p>
        
        <div className="mt-8 space-x-4">
          <Link 
            to="/" 
            className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition font-semibold"
          >
            Go to Homepage
          </Link>
          
          {/* <Link 
            to="/dashboard" 
            className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition font-semibold"
          >
            Go to Dashboard
          </Link> */}
        </div>

        <div className="mt-12">
          <div className="text-white text-6xl">
            
          </div>
          <p className="text-white/80 mt-4">
            Looks like you're lost!
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
