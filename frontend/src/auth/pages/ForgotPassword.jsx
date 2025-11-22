import React, { useState } from 'react';
import { forgotPasswordAPI } from '../../api/Auth.api';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    try {
      setMessage({ type: '', text: '' });
      setLoading(true);
      setProgress(0);

      await forgotPasswordAPI(email);

      navigate('/auth/reset-password')

      setMessage({ 
        type: 'success', 
        text: 'Password reset email sent! Please check your email for the reset code.' 
      });

      // Clear email after successful submission
      setEmail('');

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to send reset email. Please try again.'
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex justify-center min-h-auto">
      <div className="p-8 w-full max-w-[500px] min-h-auto">
        <h3 className="font-bold mb-6 text-center">
          Reset your password
        </h3>
        <p className='text-center text-gray-500 text-xs pb-10'>
          Enter your email address and we'll send you a reset code
        </p>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className="w-full mb-3">
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className="h-2 rounded bg-green-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Sending... {progress}%
              </div>
            </div>
          )}

          {/* Message Display */}
          {message.text && (
            <p className={message.type === 'error' ? 'text-red-500' : 'text-green-600'}>
              {message.text}
            </p>
          )}

          {/* Email */}
          <div className="relative">
            <label htmlFor="email" className='absolute left-3 -top-2 bg-gray-50 px-2 text-xs'>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-5 pr-3 py-3 border-b focus:border-green-600 border-1 outline-none rounded-xl"
              placeholder="example@email.com"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email.includes('@gmail.com')}
            className="font-semibold py-2 px-5 border-2 border-green-200 
                       transition-transform duration-300 hover: hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed mt-5 block mx-auto bg-green-500 text-white rounded-[10px] cursor-pointer "
          >
            {loading ? 'Sending Reset Code...' : 'Send Reset Code'}
          </button>

          <div className="text-center mt-6">
            <a
              href="/auth/login"
              className="font-medium border-b-2 border-green-500 hover:border-black text-sm"
            >
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;