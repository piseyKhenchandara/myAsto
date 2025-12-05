import React, { useState } from 'react'

const PhoneInput = ({phoneNumber, setPhoneNumber}) => {

      const [phoneError, setPhoneError] = useState('')
    
      // Cambodia phone number validation
      const validatePhoneNumber = (phone) => {
        // Remove all spaces and dashes
        const cleanPhone = phone.replace(/[\s-]/g, '')
        
        // Cambodia phone patterns:
        // Mobile: starts with 01, 06, 07, 08, 09 (9-10 digits total including the leading 0)
        // With country code: +855 followed by mobile number without leading 0
        const cambodiaPatterns = [
          /^0[1678]\d{7,8}$/, // 01x-xxx-xxx(x), 06x-xxx-xxx(x), 07x-xxx-xxx(x), 08x-xxx-xxx(x) (9-10 digits)
          /^09\d{7,8}$/,      // 09x-xxx-xxx(x) (9-10 digits)
          /^\+855[1678]\d{7,8}$/, // +855 1x-xxx-xxx(x), +855 6x-xxx-xxx(x), etc.
          /^\+8559\d{7,8}$/   // +855 9x-xxx-xxx(x)
        ]
        
        return cambodiaPatterns.some(pattern => pattern.test(cleanPhone))
      }
    
      const handlePhoneChange = (e) => {
        const value = e.target.value
        setPhoneNumber(value)
        
        // Validate phone number
        if (value && !validatePhoneNumber(value)) {
          setPhoneError('Please enter a valid Cambodia phone number (e.g., 012-345-678 or +855 12-345-678)')
        } else {
          setPhoneError('')
        }
      }
  return (
    <div>
        <label className="block text-sm font-medpium text-green-600 mb-2">Phone Number</label>
        <input 
          type="text"
          placeholder="012-345-678 or +855 12-345-678"
          value={phoneNumber}
          onChange={handlePhoneChange}
          required
          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
            phoneError 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {phoneError && (
          <p className="mt-1 text-sm text-red-600">{phoneError}</p>
        )}
        {phoneNumber && !phoneError && (
          <p className="mt-1 text-sm text-green-300 flex items-center" >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Valid phone number
          </p>
        )}
    </div>
  )
}

export default PhoneInput