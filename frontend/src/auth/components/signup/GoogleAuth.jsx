import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { googleAuthAPI } from "../../../api/auth.api";
import { auth } from "../../firebase/config";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../../context/UserContext";

const GoogleAuth = ({ 
    submit=false, 
    setSubmit=false, 
    setProgress=false, 
    setMsg= false, 

}) => {
    const navigate = useNavigate();
    const {refetchUser} =useUser();

    const handleGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        
        try {
            setSubmit({ process: true, formName: 'google' });

            const result = await signInWithPopup(auth, provider);

            const user = result.user;
            
            console.log('Google sign-up successful:', user);
            
            await googleAuthAPI(
                user.email,           
                user.displayName,     
                user.photoURL,        
                user.uid        
                
            );
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