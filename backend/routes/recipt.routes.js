import { Router } from "express";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { recipts } from "../controllers/recipt.controller.js";
import { authenticate } from "../middleware/autheticate.js";


const router = Router();

router.get('/view-all-recipts/:id',authenticate,authorizeRoles('customer','seller','admin'),recipts);

export default router;