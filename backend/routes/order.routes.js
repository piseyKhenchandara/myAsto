import { Router } from "express";
import { authenticate } from "../middleware/autheticate.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { orders } from "../controllers/order.controller.js";

const router = Router();

router.post('/', authenticate, authorizeRoles('customer'),orders);

export default router;