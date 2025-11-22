import React, { useEffect, useState } from 'react'
import { CiMail } from 'react-icons/ci'
import { RiLockPasswordLine } from 'react-icons/ri'
import { MdMailOutline } from "react-icons/md";
import { loginAPI } from '../../api/Auth.api'
import { useLocation, useNavigate } from 'react-router-dom';
import GoogleAuth from '../components/signup/GoogleAuth';
import { useUser } from '../../../context/UserContext';


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [submit, setSubmit] = useState({ formName: '', process: false })
  const [progress, setProgress] = useState(0)
  const navgiate = useNavigate();
  const location =useLocation();
  const {refetchUser} = useUser();


  useEffect(() => {
    if(location.state?.email) {
      setEmail(location.state.email);

      if(location.state.message) {
        setMsg({type : 'success', text : location.state.message});
        setTimeout(() => setMsg({type : '', text : ''}),3000);
      }
    }
  },[location.state])



const login = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      return setMsg({ type: 'error', text: 'Both fields are required!' })
    }

    setMsg({ type: '', text: '' })
    setProgress(0)
    setSubmit({ process: true, formName: 'login' })

    try {
      await loginAPI(email, password)

      await refetchUser();
      

      setMsg({ type: 'success', text: 'Logged in successfully! ✅' })
      setTimeout(() => {
        setMsg({ type: '', text: '' })
        navgiate('/user-profile')
      
      }, 2000)


    } catch (error) {
      setMsg({
        type: 'error',
        text: error?.response?.data?.message || 'Login failed',
      })
    }
    
      // let the bar reach 100% briefly    
    
  }

  return (
    <div className="flex justify-center min-h-auto">
      <div className="p-8 w-full max-w-[500px] min-h-auto">
        <h3 className=" font-bold  mb-6 text-center">
          Your ASTO account
        </h3>
        <p className='text-center text-gray-500 text-xs pb-10'>Enter your password to log in</p>

        <form className="space-y-4" onSubmit={login}>
          

          {msg.text && (
            <p className={msg.type === 'error' ? 'text-red-500' : 'text-green-600'}>
              {msg.text}
            </p>
          )}

          {/* Email */}
          <div className="relative">
            
            <label htmlFor="email" className='absolute left-3 -top-2 bg-gray-50 px-2 text-xs'>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-5 pr-3 py-3 border-b focus:border-green-600 border-1 outline-none mb-2 rounded-xl"
              placeholder="example@email.com"
              required
            />
          </div>


          {/* Password */}
          <div className="relative">
            <label htmlFor="email" className='absolute left-3 -top-2 bg-gray-50 px-2 text-xs'>password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-5 pr-3 py-3 border-b focus:border-green-600 border-1 outline-none rounded-xl"
              placeholder="Password"
              required
            />
          </div>

          <a href="/auth/forgot-password" className='text-right block'><span className=' text-xs border-b-2 border-green-500 hover:border-b-black'>Forgot password??</span></a>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={submit.process || password.length<6}
            className=" font-semibold py-2 px-5 border-2 border-green-200 
                       transition-transform duration-300 hover: hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed mt-5 block mx-auto bg-green-500 text-white rounded-[10px] cursor-pointer"
          >
            {submit.process ? 'Logging In…' : 'Log In'}
          </button>
        </form>

        {/* Extra */}
        <GoogleAuth 
          submit={submit} 
          setSubmit={setSubmit}
          setProgress={setProgress}
          setMsg={setMsg}
      
        />
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="font-medium border-b-2 border-green-500 hover:border-black">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
