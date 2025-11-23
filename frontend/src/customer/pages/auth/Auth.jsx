import React, { useState, useEffect } from 'react'
import { updateAuthAPI, whoamiAPI } from '../../../api/Auth.api'

import { VscSettingsGear } from "react-icons/vsc"
import AuthSetting from './AuthSetting'
import Recipts from '../checkout/Recipts'

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: "" })

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [pfp, setPfp] = useState('')

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const userData = await whoamiAPI()
      setUser(userData)
    } catch (err) {
      console.error('Failed to fetch user profile:', err)
      setError('Failed to load profile information')
    } finally {
      setLoading(false)
    }
  }

  const handleAuthUpdate = async () => {
    try {
      setLoading(true)
      const updatedUserData = await updateAuthAPI({
        name: name || user.name,
        phone: phone || user.phone,
        address: address || user.address,
        profile_picture: pfp || user.profile_picture,
      })
    
      setUser(updatedUserData)
      

      setMsg({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      })
      
 
      setName('')
      setPhone('')
      setAddress('')
      setPfp('')
      
      setTimeout(() => {
        setOpen(false)
        setMsg({ type: '', text: '' })
      }, 1500)
      
    } catch (error) {
      setMsg({ 
        type: 'error', 
        text: error.response?.data?.message || "Failed to update user" 
      })
    } finally {
      setLoading(false)
    }
  }


  const handleCloseModal = () => {
    setName('')
    setPhone('')
    setAddress('')
    setPfp('')
    setMsg({ type: '', text: '' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4"></div>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchUserProfile}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
  
  

  return (
    <div className='w-full min-h-screen'>
  
<div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100 overflow-hidden">
  
  <div className='flex flex-row items-center justify-between gap-2 sm:gap-4 max-w-[1920px] mx-auto'>
    
    <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
        {user?.profile_picture ? (
          <img 
            src={user.profile_picture} 
            alt={user.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-black">
            {user?.name?.charAt(0)?.toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate">{user?.name}</h3>
        <p className="text-xs sm:text-sm md:text-base text-black truncate">{user?.email}</p>
      </div>
    </div>
   
    <button 
      onClick={() => setOpen(true)} 
      className='bg-white p-1.5 sm:p-2 text-lg sm:text-xl md:text-2xl rounded-full cursor-pointer border shadow-lg hover:scale-110 transition duration-200 flex-shrink-0'
    >
      <VscSettingsGear/>
    </button>
  </div>

</div>
      {open && 
        <section className='inset-0 flex justify-center items-center fixed z-50 bg-black/50'>
          <AuthSetting
            msg={msg}
            setMsg={setMsg}
            setName={setName}
            setPhone={setPhone}
            setAddress={setAddress}
            setPfp={setPfp}      
            handleAuthUpdate={handleAuthUpdate}
            setOpen={setOpen}
            user={user}
            onClose={handleCloseModal}
          />
        </section>
      }

      <Recipts whoami={user}/>
 
    </div>
  )
}

export default UserProfile