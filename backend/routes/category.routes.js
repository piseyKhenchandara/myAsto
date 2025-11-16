import { Router } from "express";
import { uploadCategory, getCategory, deleteCategory, updateCategory } from "../controllers/category.controller.js";
import { authenticate } from "../middleware/autheticate.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { uploadCategoryImage } from "../middleware/uploadMedia.js";
import { loadUserData } from "../middleware/loadUserdata.js";


const router = Router();

router.post( "/upload-category",authenticate,authorizeRoles('admin', 'seller'),  uploadCategoryImage,  uploadCategory);

router.get("/view-all-categories", getCategory);

router.delete("/delete-categories/:id",authenticate,authorizeRoles('admin', 'seller'),  deleteCategory);

router.patch('/update-category/:id',authenticate,authorizeRoles('admin', 'seller'),  uploadCategoryImage, updateCategory);

export default router;
