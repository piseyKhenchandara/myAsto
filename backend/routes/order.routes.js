import { Router } from "express";
import { authenticate } from "../middleware/autheticate.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { getAllUsersWhoOrdered, getTheReceipt, orders, updateDeliveryCheck } from "../controllers/order.controller.js";
import { validateName, validateOrderCreation, validatePhone } from "../middleware/validator.js";

const router = Router();

router.post('/', 
    authenticate,
    authorizeRoles('customer'),
    validateName('customer_name'),
    validatePhone('phone_number'),
    validateOrderCreation(
        'amount',
        'customer_name',
        "phone_nmber",
        "shipping_address",
        "delivery_company",
        "discount_amount",
        "cart"
    ),
    orders);

router.get('/get-all-users-who-ordered', 
    authenticate, 
    authorizeRoles('seller', 'admin'), 
    getAllUsersWhoOrdered);

router.get('/get-the-receipt-from-the-user/:user_id', 
    authenticate, 
    authorizeRoles('seller', 'admin'), 
    getTheReceipt);

// In your routes file
router.patch('/:order_id/delivery', 
    authenticate, 
    authorizeRoles('admin', 'seller'), 
    updateDeliveryCheck);

export default router;