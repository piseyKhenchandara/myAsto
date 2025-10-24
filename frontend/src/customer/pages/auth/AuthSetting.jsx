import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { FiUpload } from 'react-icons/fi'
import Logout from '../../../auth/components/Logout'

const AuthSetting = ({
  msg,
  setMsg,
  setName,
  setEmail,
  setPassword,
  setPhone,
  setAddress,
  setPfp,
  handleAuthUpdate,
  setOpen,
  user,
  onClose
}) => {

  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPfp(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
    

  const handleClose = () => {
    setPreviewImage(null);
    setOpen(false);
    if (onClose) onClose();
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await handleAuthUpdate()
    setLoading(false)
  }

  // Check if any field has been changed
  const hasChanges = previewImage !== null || 
                     document.querySelector('input[type="text"]')?.value ||
                     document.querySelector('input[type="email"]')?.value ||
                     document.querySelector('input[type="password"]')?.value ||
                     document.querySelector('input[type="tel"]')?.value ||
                     document.querySelector('textarea')?.value;

  return (
    <div className='bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] lg:max-w-[1000px] xl:max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col'>
  
      {/* Header */}
      <div className='bg-gradient-to-r text-black px-6 py-4 flex items-center justify-between shadow-md'>
        <h2 className='text-xl sm:text-2xl font-bold flex items-center gap-2'>
          <span></span> Edit Profile
        </h2>
        <button 
          onClick={handleClose}
          className='text-white hover:bg-white/20 rounded-full p-2 text-2xl transition-all duration-200 hover:rotate-90'
        >
          <IoClose />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className='overflow-y-auto flex-1'>
        {/* Success/Error Message */}
        {msg.text && (
          <div className={`mx-6 mt-6 p-4 rounded-xl font-medium shadow-sm ${
            msg.type === 'success' 
              ? 'bg-green-50 text-green-700 border-l-4 border-green-500' 
              : 'bg-red-50 text-red-700 border-l-4 border-red-500'
          }`}>
            <div className='flex items-center gap-2'>
              <span>{msg.type === 'success' ? '✅' : '❌'}</span>
              <span>{msg.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className='p-4 sm:p-6'>
          
          {/* Horizontal Layout: Profile Picture on Left, Form on Right */}
          <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
            
            {/* Left Side - Profile Picture */}
            <div className='flex flex-col items-center lg:items-start lg:w-64 lg:flex-shrink-0'>
              <div className='flex flex-col items-center w-full py-4'>
                <div className='relative group'>
                  <div className='w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-2xl bg-gradient-to-br flex items-center justify-center overflow-hidden ring-1 shadow-lg'>
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className='w-full h-full object-cover' />
                    ) : user?.profile_picture ? (
                      <img src={user.profile_picture} alt="Profile" className='w-full h-full object-cover' />
                    ) : (
                      <span className='text-5xl sm:text-6xl lg:text-7xl font-bold text-green-600'>
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <label 
                    htmlFor='profile-picture' 
                    className='absolute bottom-2 right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-full cursor-pointer hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:scale-110 transform duration-200'
                  >
                    <FiUpload className='text-lg' />
                  </label>
                  <input 
                    id='profile-picture'
                    type='file' 
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                </div>
                <p className='text-sm text-gray-500 mt-4 text-center lg:text-left'>Click to upload new photo</p>
              </div>

              {/* Logout Button - Shows under profile on desktop */}
              <div className='hidden lg:block w-full mt-6'>
                <Logout/>
              </div>
            </div>

            {/* Right Side - Form Fields */}
            <div className='flex-1 space-y-5'>
              
              {/* Two Column Grid for Form Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6'>
                
                {/* Name */}
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    placeholder={user?.name || 'Enter your name'}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:ring-2 transition-all outline-none hover:border-gray-300'
                  />
                </div>

                {/* Email */}
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    placeholder={user?.email || 'Enter your email'}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:ring-2 transition-all outline-none hover:border-gray-300'
                  />
                </div>

                {/* Password */}
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    New Password
                  </label>
                  <input
                    type='password'
                    placeholder='Leave blank to keep current'
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:ring-2 transition-all outline-none hover:border-gray-300'
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    placeholder={user?.phone || 'Enter phone number'}
                    onChange={(e) => setPhone(e.target.value)}
                    className='w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:ring-2 transition-all outline-none hover:border-gray-300'
                  />
                </div>

              </div>

              {/* Address - Full Width */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Address
                </label>
                <textarea
                  rows='3'
                  placeholder={user?.address || 'Enter your address'}
                  onChange={(e) => setAddress(e.target.value)}
                  className='w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:ring-2 transition-all outline-none resize-none hover:border-gray-300'
                />
              </div>

              {/* Logout - Shows here on mobile/tablet */}
              <div className='lg:hidden pt-4 border-t-2 border-gray-100'>
                <Logout/>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-100'>
                <button
                  type='button'
                  onClick={handleClose}
                  className='flex-1 px-6 py-3 border-1 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading || !hasChanges}
                  className='flex-1 px-6 py-3 bg-gradient-to-r text-black rounded-xl hover:bg-green-300 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] border-1 border-gray-300'
                >
                  {loading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className='flex items-center justify-center gap-2 cursor-pointer'>
      
                      Save Changes
                    </span>
                  )}
                </button>
              </div>

            </div>

          </div>
          
        </form>
      </div>
    </div>
  )
}

export default AuthSetting