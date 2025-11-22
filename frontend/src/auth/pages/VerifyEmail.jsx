import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { verificationCodeAPI, resendVerificationCodeAPI } from '../../api/Auth.api'

const VerifyEmail = () => {
  const navigate = useNavigate()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [progress, setProgress] = useState(0)
  
  const inputRefs = useRef([])

  // Resend cooldown timer
  useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [resendCooldown])

  const handleInputChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)
    setMessage({ type: '', text: '' })

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== '') && !loading) {
      handleVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('')
        if (digits.length === 6) {
          setCode(digits)
          handleVerify(digits.join(''))
        }
      })
    }
  }

  const handleVerify = async (codeString = code.join('')) => {
    if (codeString.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter all 6 digits' })
      return
    }

    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      setProgress(0)

      const result = await verificationCodeAPI(codeString)
      
      if (result.is_verified) {
        setMessage({ type: 'success', text: 'Email verified successfully!' })
        setTimeout(() => {
          setLoading(false)
          navigate('/')
        }, 2000)
      }
    } catch (error) {
      console.error('Verification error:', error)
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Verification failed. Please try again.' 
      })
      // Clear the code on error
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      if (!message.type === 'success') {
        setLoading(false)
      }
      setProgress(0)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return

    try {
      setResendLoading(true)
      setMessage({ type: '', text: '' })

      const result = await resendVerificationCodeAPI()
      setMessage({ 
        type: 'success', 
        text: result.message || 'New verification code sent!' 
      })
      setResendCooldown(60) // 60 second cooldown
    } catch (error) {
      console.error('Resend error:', error)
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to resend code. Please try again.'
      })
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="flex justify-center min-h-auto">
      <div className="p-8 w-full max-w-[500px] min-h-auto">
        <h3 className="font-bold mb-6 text-center">
          Verify Your Email
        </h3>
        <p className='text-center text-gray-500 text-xs pb-10'>
          Enter the 6-digit code sent to your email
        </p>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
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
                Verifying... {progress}%
              </div>
            </div>
          )}

          {/* Message Display */}
          {message.text && (
            <p className={message.type === 'error' ? 'text-red-500 text-center' : 'text-green-600 text-center' }>
              {message.text}
            </p>
          )}

          {/* Code Input */}
          <div className="flex justify-center space-x-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-lg font-semibold border-b focus:border-green-600 border-1 outline-none bg-transparent rounded-[10px] ${
                  message.type === 'error' 
                    ? 'border-red-500' 
                    : 'border-gray-600 focus:border-green-500'
                } transition-colors duration-200`}
                disabled={loading}
              />
            ))}
          </div>

          {/* Manual Verify Button */}
          <button
            type="submit"
            disabled={loading || code.some(digit => digit === '')}
            className="font-semibold py-2 px-5 border-2 border-green-200 
                       transition-transform duration-300 hover:hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed mt-5 block mx-auto bg-green-500 text-white rounded-[10px] cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify Email'
            )}
          </button>

          {/* Resend Code Section */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || resendCooldown > 0}
              className="font-medium border-b-2 border-green-500 hover:border-black text-sm disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
            >
              {resendLoading ? (
                'Sending...'
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend Code'
              )}
            </button>
          </div>

          <div className="text-center mt-6">
            <a
              href="/auth/login"
              className="font-medium border-b-2 border-green-500 hover:border-black text-sm"
            >
              Back to Login
            </a>
          </div>
          {/* Back to Login */}
        </form>
      </div>
    </div>
  )
}

export default VerifyEmail