// Add this to your auth.routes.js to debug
import { Router } from "express";
import { 
    signup, 
    login, 
    logout, 
    verificationCode, 
    resendVerificationCode, 
    forgotPassword, 
    resetPassword, 
    resendPasswordToken, 
    whoami,
    checkEmail,
    googleAuth,
    getUserById,
    updateAuth
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/autheticate.js";
import {authorizeRoles} from '../middleware/authorizeRoles.js'
import { validateAddress, validateCode, validateEmail, validateId, validateName, validatePassword, validatePhone, validateUrl, validateString} from "../middleware/validator.js";
import { uploadProfilePicture } from "../middleware/uploadMedia.js";
import { loadUserData } from "../middleware/loadUserdata.js";


const router = Router();

router.post("/check-email",
    validateEmail("email"), 
    checkEmail);

router.post('/google',
    validateEmail('email'), 
    validateName('name'),
    validateUrl('photoUrl', false), 
    validateString('provider_id', 1, 100, true),
    googleAuth
);
// Public routes (no authentication required)
router.post('/signup',
    validateEmail('email'),
    validateName('name'),
    validatePassword('password',8),
    signup);


router.post('/login', 
    validateEmail('email'),
    validatePassword('password'),
    login);

router.post('/forgot-password', 
    validateEmail('email'),
    forgotPassword);


router.post('/reset-password', 
    validateCode('token'),
    validatePassword("newPassword"),
    resetPassword);


// Protected routes (require authentication)  
router.post('/verify-email',
     authenticate, 
     validateCode('code'),
     verificationCode);


router.post('/resend-verification', 
    authenticate,
    resendVerificationCode);


router.post('/logout',
    authenticate, 
    logout);


router.patch('/profile/update',
    authenticate,
    uploadProfilePicture, 
    validateName('name', false),
    validatePhone('phone',false),
    validateAddress('address',false),
    updateAuth);


// Add debugging specifically for whoami
router.get('/whoami',
    authenticate, 
    loadUserData,
    whoami);

router.get('/users/:id', 
    authenticate,
    authorizeRoles('admin'),
    validateId('id'),
    getUserById);


export default router;