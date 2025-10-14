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

  return (
    <div className='bg-white rounded-lg shadow-2xl max-w-[400px] md:min-w-[400px] h-auto overflow-y-auto'>
  
      <div className='sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-800'>Edit Profile</h2>
        <button 
          onClick={handleClose}
          className='text-gray-500 hover:text-gray-700 text-2xl'
        >
          <IoClose />
        </button>
      </div>

      {msg.text && (
        <div className={`mx-6 mt-4 p-3 rounded-md ${
          msg.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className='p-6 space-y-6'>
        
        {/* Profile Picture */}
        <div className='flex flex-col items-center'>
          <div className='relative'>
            <div className='w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
              {previewImage ? (
                <img src={previewImage} alt="Preview" className='w-full h-full object-cover' />
              ) : user?.profile_picture ? (
                <img src={user.profile_picture} alt="Profile" className='w-full h-full object-cover' />
              ) : (
                <span className='text-4xl font-bold text-gray-500'>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <label 
              htmlFor='profile-picture' 
              className='absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition'
            >
              <FiUpload />
            </label>
            <input 
              id='profile-picture'
              type='file' 
              accept='image/*'
              onChange={handleImageChange}
              className='hidden'
            />
          </div>
          <p className='text-sm text-gray-500 mt-2'>Click the icon to upload new photo</p>
        </div>

        {/* Name */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Name
          </label>
          <input
            type='text'
            placeholder={user?.name || 'Enter your name'}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* Email */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Email
          </label>
          <input
            type='email'
            placeholder={user?.email || 'Enter your email'}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* Password */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Password
          </label>
          <input
            type='password'
            placeholder='Leave blank to keep current password'
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          <p className='text-xs text-gray-500 mt-1'>Only fill this if you want to change your password</p>
        </div>

        {/* Phone */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Phone Number
          </label>
          <input
            type='tel'
            placeholder={user?.phone || 'Enter your phone number'}
            onChange={(e) => setPhone(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* Address */}
        <div className='border-b-1 pb-10'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Address
          </label>
          <textarea
            rows='3'
            placeholder={user?.address || 'Enter your address'}
            onChange={(e) => setAddress(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
          />
        </div>
        <div className=''>
          <Logout/>
        </div>

        {/* Buttons */}
        <div className='flex gap-4 pt-4'>
          <button
            type='button'
            onClick={handleClose}
            className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className='flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        
      </form>
    </div>
  )
}

export default AuthSetting