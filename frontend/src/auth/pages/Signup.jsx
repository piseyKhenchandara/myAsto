import { useState } from 'react'
import { googleAuthAPI, signupAPI } from '../../api/Auth.api'
import '../../index.css'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import GoogleAuth from '../components/signup/GoogleAuth';

const Signup = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [submit, setSubmit] = useState({ formName: '', process: false })

  const {user : whoami} = useUser();

  const navigate = useNavigate();

  // Regular email/password signup (your existing function)
  const signup = async (e) => {
    e.preventDefault()
    
    if(whoami) return setMsg({type : 'error', text : "user already exist!"});

    if (!name || !email || !password || !confirmPassword) {
      return setMsg({ type: 'error', text: 'All fields are required!' })
    }

    if (name.length < 3) {
      return setMsg({ type: 'error', text: 'Name must be at least 3 characters!' })
    }

    if (password.length < 8) {
          return res.status(400).json({
              success: false,
              message: "Password must be at least 8 characters long"
          });
      }

    if (password !== confirmPassword) {
      return setMsg({ type: 'error', text: 'Passwords do not match!' })
    }

    try {
      setSubmit({ process: true, formName: 'signup' })

      await signupAPI(name, email, password)

      setMsg({ type: 'success', text: 'User signed up successfully! ✅' })
      setTimeout(() => setMsg({ type: '', text: '' }), 3000)
      navigate('/auth/verify-email');
      
    } catch (error) {
      setMsg({
        type: 'error',
        text: error.response?.data.message || 'Failed signup',
      })
    } finally {
      setSubmit({ process: false, formName: '' })
    }
  }

  return (
    <div className="flex justify-center min-h-auto">
      <div className="p-8 w-full max-w-[500px] min-h-auto">
        <h3 className="font-bold mb-6 text-center">
          Create your ASTO account
        </h3>
        <p className='text-center text-gray-500 text-xs pb-10'>Enter your details to create an account</p>

        <form className="space-y-4" onSubmit={signup}>
         
          {msg.text && (
            <p className={msg.type === 'error' ? 'text-red-500' : 'text-green-600'}>
              {msg.text}
            </p>
          )}

          {/* Full Name */}
          <div className="relative">
            <label htmlFor="name" className='absolute left-3 -top-2 bg-gray-50 px-2 text-xs'>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-5 pr-3 py-3 border-b focus:border-green-600 border-1 outline-none mb-2 rounded-xl"
              placeholder="Your full name"
              required
            />
            {name && name.length < 3 && (
              <span className='text-red-500 p-2 text-xs rounded mt-1 block'>
                Name must be at least 3 characters
              </span>
            )}
          </div>

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
            <label htmlFor="password" className='absolute left-3 -top-2 bg-gray-50 px-2 text-xs'>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-5 pr-3 py-3 border-b focus:border-green-600 border-1 outline-none mb-2 rounded-xl"
              placeholder="Password"
              required
            />
            {password && password.length < 8 && (
              <span className='text-red-500 p-2 text-xs rounded mt-1 block'>
                Password must be at least 8 characters
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className='absolute left-3 -top-2 bg-gray-50 px-2 text-xs'>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-5 pr-3 py-3 border-b focus:border-green-600 border-1 outline-none rounded-xl"
              placeholder="Confirm Password"
              required
              />
          </div>
          {confirmPassword && confirmPassword.length < 8 && (
            <span className='text-red-500 p-2 text-xs rounded mt-1 block'>
              Password must be at least 8 characters
            </span>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submit.process || name.length<3 || !email.includes('@gmail.com') || password.length<8 || confirmPassword.length<8 }
            className="font-semibold py-2 px-5 border-2 border-green-200 
                       transition-transform duration-300 hover: hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed mt-5 block mx-auto bg-green-500 text-white rounded-[10px] cursor-pointer"
          >
            {submit.process ? 'Signing Up…' : 'Sign Up'}
          </button>
        </form>

        {/* Google Sign-up Button */}
        <GoogleAuth 
          submit={submit} 
          setSubmit={setSubmit}
          setMsg={setMsg}
        />

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <a href="/auth/login" className="font-medium border-b-2 border-green-500 hover:border-black">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}

export default Signup