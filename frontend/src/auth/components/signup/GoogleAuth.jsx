import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { googleAuthAPI } from "../../../api/Auth.api";
import { auth } from "../../firebase/config";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../../context/UserContext";
import { useEffect, useState } from 'react';  // ✅ ADD THIS

// ✅ ADD THIS - Detect in-app browsers
const isInAppBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return (
        ua.includes('FBAN') || 
        ua.includes('FBAV') || 
        ua.includes('Instagram') ||
        ua.includes('Telegram') ||
        ua.includes('Line')
    );
};

const GoogleAuth = ({ 
    submit=false, 
    setSubmit=false, 
    setMsg= false, 
}) => {
    const navigate = useNavigate();
    const {refetchUser} = useUser();
    const [showWarning, setShowWarning] = useState(false);  // ✅ ADD THIS

    // ✅ ADD THIS
    useEffect(() => {
        setShowWarning(isInAppBrowser());
    }, []);

    const handleGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        
        try {
            setSubmit({ process: true, formName: 'google' });

            const result = await signInWithPopup(auth, provider);
            const user = result.user;
        
            
            const response = await googleAuthAPI(
                user.email,           
                user.displayName,     
                user.photoURL,        
                user.uid        
            );

            if (response.token) {
                localStorage.setItem('authToken', response.token);
                sessionStorage.setItem('authToken', response.token);
            }
            
            await refetchUser();
            
            setMsg({ type: 'success', text: 'Google sign-up successful!' });

            setTimeout(() => {
                navigate('/');
            }, 1500);
            
        } catch (error) {
            console.error('Google sign-up error:', error);
            setMsg({ 
                type: 'error', 
                text: error.response?.data?.message || 'Google sign-up failed' 
            });
        } finally {
            setSubmit({ process: false, formName: '' });
        }
    };

    return (
        <section>
            {/* ✅ ADD THIS - Warning for in-app browsers */}
            {showWarning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                        <strong>⚠️ Note:</strong> For best experience, please open this page in your default browser (Chrome, Safari, etc.)
                    </p>
                </div>
            )}

            <figure className="flex items-center my-4">
                <hr className="flex-1 border-t border-gray-600" />
                <span className="px-3 text-sm">OR</span>
                <hr className="flex-1 border-t border-gray-600" />
            </figure>
            
            <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={submit.process}
                className="w-full bg-white border-1 text-gray-700 font-semibold py-3 mb-4 
                           flex items-center justify-center gap-3 transition-transform duration-300 
                           hover:bg-gray-50 hover:scale-105 cursor-pointer
                           disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
            >
                <FcGoogle size={20} />
                Continue with Google
            </button>
        </section>
    );
};

export default GoogleAuth;