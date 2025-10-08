import { Router } from "express";
import { authenticate } from "../middleware/autheticate.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { checkPaymentStatus, createKHQRPayment, getPaymentByOrderId } from "../controllers/payment.controller.js";


const router = Router();


router.post('/:order_id/usd',authenticate,authorizeRoles('customer'),createKHQRPayment);

router.post('/:order_id/check_status', authenticate, authorizeRoles('customer'), checkPaymentStatus);

router.get('/:orderid', authenticate, authorizeRoles('customer'), getPaymentByOrderId);


export default router;