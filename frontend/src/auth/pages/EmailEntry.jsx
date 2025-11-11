import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkEmailAPI } from '../../api/Auth.api';
import { useUser } from '../../../context/UserContext';

import { FcGoogle } from 'react-icons/fc';
import GoogleAuth from '../components/signup/GoogleAuth';

const EmailEntry = () => {

  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  const [submit, setSubmit] = useState({ formName: '', process: false });
  const [progress, setProgress] = useState(0);
  
  const navigate = useNavigate();
  const { user: whoami } = useUser();


  const handleEmailSubmit = async (e) => {
    e.preventDefault();


    if (whoami) {
      return setMsg({ type: 'error', text: "You are already logged in!" });
    }

    if (!email) {
      return setMsg({ type: 'error', text: 'Email is required!' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setMsg({ type: 'error', text: 'Please enter a valid email address!' });
    }

    try {
      setLoading(true);
      setMsg({ type: '', text: '' });

      const response = await checkEmailAPI({ email });

      if (response.action === 'login') {
        setTimeout(() => {
          setLoading(false);
            navigate('/auth/login', {
              state: {
                email: email,
                message: response.message,
                userData: response.user
              }
            });
        },1500);
      }
       else if (response.action === 'signup') {

        setTimeout(() => {
          setLoading(false);
           
          navigate('/auth/signup', {
            state: {
              email: email,
              message: response.message
            }
          });

        },1500);

      }

    } catch (error) {
      setMsg({
        type: 'error',
        text: error.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } 
    finally{
      setLoading(false);
      
    }


  };

  return (
    <div className=" flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-[500px] p-8">
        <div className='pb-5'>
          <h2 className="text-center text-3xl font-bold text-green-600 mb-2">
            Welcome to ASTO
          </h2>
   
        </div>

        <div className="space-y-6">
          {/* Progress bar for Google Auth */}
          {submit.process && submit.formName === 'google' && (
            <div className="w-full mb-3">
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className="h-2 rounded bg-green-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Signing in with Google… {progress}%
              </div>
            </div>
          )}

          {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FcGoogle size={20} className="mr-2" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-12 pr-3 py-3 bg-transparent border-1 border-gray-600 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors duration-200 rounded-xl"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || submit.process}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || submit.process}
                className="font-semibold py-2 px-5 border-2 border-green-200 
                       transition-transform duration-300 hover: hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed mt-5 block mx-auto bg-green-500 text-white rounded-[10px] cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2"></div>
                    Checking...
                  </div>
                ) : (
                  <p>Continue</p>
                )}
              </button>
            </div>
          </form>

          {/* Google Auth with proper props */}
          <GoogleAuth 
            submit={submit}
            setSubmit={setSubmit}
            setProgress={setProgress}
            setMsg={setMsg}
          />

          {/* Message Display */}
          {msg.text && (
            <div className={`rounded-[12px] p-4 border ${
              msg.type === 'error' 
                ? 'bg-red-900/20 border-red-500 text-red-400' 
                : 'bg-green-900/20 border-green-500 text-green-600'
            }`}>
              <div className="text-sm font-medium">{msg.text}</div>
            </div>
          )}
          <p className='text-gray-400 text-center'>We'll check if you have   an account</p>
          

          {/* Footer Text */}
        
        </div>
      </div>
    </div>
  );
};

export default EmailEntry;