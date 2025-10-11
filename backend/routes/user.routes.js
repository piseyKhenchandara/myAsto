import { Router } from "express";
import { viewAlluser } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/autheticate.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();


router.get('/view-all-users',authenticate,authorizeRoles('admin'), viewAlluser);

export default router;