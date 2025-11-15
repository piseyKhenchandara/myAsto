import { Router } from "express";
import { authenticate } from "../middleware/autheticate.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { checkPaymentStatus, createKHQRPayment, getPaymentByOrderId } from "../controllers/payment.controller.js";
import { validateId, validateQrMd5 } from "../middleware/validator.js";


const router = Router();


router.post('/:order_id/usd',
    authenticate,
    authorizeRoles('customer'),
    validateId('order_id'),
    createKHQRPayment);

router.post('/:order_id/check_status', 
    authenticate, 
    authorizeRoles('customer'),
    validateId('order_id'),
    validateQrMd5('qr_md5'), 
    checkPaymentStatus);

router.get('/:orderid', 
    authenticate, 
    authorizeRoles('customer'), 
    getPaymentByOrderId);


export default router;