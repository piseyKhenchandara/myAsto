import React, { useState } from 'react'
import { logoutAPI } from '../../api/auth.api';
import { useNavigate } from 'react-router-dom'  // ✅ Correct
import { useUser } from '../../../context/UserContext';


const Logout = () => {

  const [msg, setMsg] = useState({type : '', text : ''});
  const [submit, setSubmit] = useState(false);
  const [open, setOpen]  = useState(false)
  const {refetchUser} = useUser();
  const navigate = useNavigate();  
  


  const authLogout = async () => {
    try{
      setSubmit(true);
      await logoutAPI();
      refetchUser();

      setMsg({type : "success", text : "logout successfully!✅"});

      setTimeout(() => {
        setMsg({type : "", text : ""});
        setOpen(false);
        navigate('/');
        

      },3000);

    }catch(error){
      setMsg({type : "error", text : error.response?.data.message || "faild logout!"});

    }
    finally{
      setSubmit(false);
    }
  }


  return (
    <>
      {msg.type === 'error' ? <p className='text-red-500 text-center'>{msg.text}</p> : <p className='text-green-500 text-center'>{msg.text}</p>}


      <button type='button' className=' text-red-600 cursor-pointer disabled:bg-gray-300 border-b-1' onClick = { () => setOpen(true)}>
        logout

      </button>

      {open && 
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center bg-gradient-to-br  px-4" 
        aria-labelledby="logout-title"
        aria-describedby="logout-description"
        >
          
          <article className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-[400px]">
            
          
            <header className="text-center mb-8">
              <figure className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </figure>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign Out</h2>
              <p className="text-gray-600">Are you sure you want to sign out of your account?</p>
            </header>

           
            {msg.text && (
              <section className={`mb-6 p-4 rounded-xl text-center font-medium transition-all duration-300 ${
                msg.type === 'error' 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`} aria-live="polite">
                {msg.text}
              </section>
            )}

            <div className="space-y-3" aria-label="Logout actions">
              <button 
                type="button" 
                className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                  submit 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                }`}
                onClick={authLogout}
                disabled={submit}
                aria-label={submit ? "Signing out, please wait" : "Confirm sign out"}
              >
                {submit ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing out...
                  </span>
                ) : (
                  'Sign Out'
                )}
              </button>

              <button 
                type="button"
                className="w-full py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setOpen(false)}
                disabled={submit}
                aria-label="Cancel and close dialog"
              >
                Cancel
              </button>
            </div>

            {/* Footer */}
            <footer className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                You'll need to sign in again to access your account
              </p>
            </footer>

          </article>
        </div>
      }
      
    </>
  )
}

export default Logout
