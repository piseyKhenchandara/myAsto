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
import { uploadSingle } from "../middleware/uploadImage.js";
const router = Router();
// Add debugging middleware to see all requests
/* router.use((req, res, next) => {
    console.log(`🔍 Auth route hit: ${req.method} ${req.path}`);
    console.log('📝 Headers:', req.headers);
    console.log('🍪 Cookies:', req.cookies);
    next();
});
 */
router.post("/check-email",checkEmail);
router.post('/google',googleAuth);

// Public routes (no authentication required)
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


// Protected routes (require authentication)  
router.post('/verify-email', authenticate, verificationCode);
router.post('/resend-verification', authenticate, resendVerificationCode);
router.post('/logout', logout);


router.patch('/profile/update',authenticate,uploadSingle, updateAuth);
// Add debugging specifically for whoami
router.get('/whoami',authenticate, whoami);
router.get('/users/:id', authenticate,authorizeRoles('admin'),getUserById);

// Add a test route to verify auth routes are working
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes are working!', timestamp: new Date().toISOString() });
});

export default router;