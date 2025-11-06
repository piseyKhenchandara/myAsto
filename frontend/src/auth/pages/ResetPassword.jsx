import React, { useState } from 'react';
import { resetPasswordAPI } from '../../api/Auth.api';

const ResetPassword = () => {
  //6 digit verification
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!token.trim()) {
      setMessage({ type: 'error', text: 'Reset code is required' });
      return;
    }

    if (!newPassword) {
      setMessage({ type: 'error', text: 'New password is required' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      setMessage({ type: '', text: '' });
      setLoading(true);
      
      await resetPasswordAPI(token, newPassword);
      setMessage({ 
        type: 'success', 
        text: 'Password updated successfully! Redirecting to login...' 
      });

      setTimeout(() => {
        window.location.href = '/auth/login';
        
      }, 3000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to reset password. Please try again.'
      });
    } 
    finally{
      setToken('');
      setNewPassword('');
      setConfirmPassword('');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-auto">
      <div className="p-8 w-full max-w-[500px] min-h-auto">
        <h3 className="font-bold mb-6 text-center">
          Reset your password
        </h3>
        <p className='text-center text-gray-500 text-xs pb-10'>
          Enter the code from your email and your new password
        </p>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {message.text && (
            <p className={message.type === 'error' ? 'text-red-500' : 'text-green-600'}>
              {message.text}
            </p>
          )}

          {/* Reset Code */}
          <div className="relative">
            <label htmlFor="token" className='absolute left-3 -top-2 bg-gray-50 px-2 text-xs'>Reset Code</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full pl-5 pr-3 py-3 border-b focus:border-green-600 border-1 outline-none mb-2 rounded-xl"
              placeholder="Enter 6-digit code"
              required
              disabled={loading}
              maxLength="6"
            />
          </div>

          {/* New Password */}
          <div className="relative">
            <label htmlFor="newPassword" className='absolute left-3 -top-2 bg-gray-50 px-2 text-xs'>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-5 pr-3 py-3 border-b focus:border-green-600 border-1 outline-none mb-2  rounded-xl"
              placeholder="New Password"
              required
              disabled={loading}
              minLength="6"
            />
          </div>
            {newPassword && newPassword.length < 6 && (
            <span className='text-red-500 text-xs block'>
              Password must be at least 8 characters
            </span>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className='absolute left-3 -top-2 bg-gray-50 px-2 text-xs'>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-5 pr-3 py-3 border-b focus:border-green-600 border-1 outline-none  rounded-xl"
              placeholder="Confirm Password"
              required
              disabled={loading}
              minLength="6"
            />
          </div>
            {confirmPassword && confirmPassword.length < 6 && (
            <span className='text-red-500 text-xs block'>
              Password must be at least 8 characters
            </span>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || token.length<6 || newPassword.length < 6 || confirmPassword.length <6 }
            className="font-semibold py-2 px-5 border-2 border-green-200 
                       transition-transform duration-300 hover: hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed mt-5 block mx-auto bg-green-500 text-white cursor-pointer rounded-[10px]"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        {/* Extra Links */}
        <div className="text-center text-sm text-gray-500 mt-6 space-x-4">
          <a href="/auth/forgot-password" className="font-medium border-b-2 border-green-500 hover:border-black">
            Resend Code
          </a>
          <a href="/auth/login" className="font-medium border-b-2 border-green-500 hover:border-black">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;