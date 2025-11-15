import { Router } from "express";
import { 
    deleteBrand, 
    getAllBrands, 
    getBrandsByCategory,
    updateBrand, 
    uploadBrand 
} from "../controllers/brand.controller.js";

import { authenticate } from "../middleware/autheticate.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { uploadBrandLogo } from "../middleware/uploadMedia.js";

const router = Router();

// Upload brand to specific category
router.post('/category/:category_slug/upload-brand',authenticate,authorizeRoles('admin', 'seller'), uploadBrandLogo, uploadBrand);

// Get all brands
router.get('/view-all-brands', getAllBrands);

// Get brands by category
router.get('/category/:category_slug/brands', getBrandsByCategory);

// Update brand
router.patch('/update-brand/:id',authenticate,authorizeRoles('admin', 'seller'), uploadBrandLogo, updateBrand);

// Delete brand
router.delete('/delete-brand/:id',authenticate,authorizeRoles('admin', 'seller'), deleteBrand);

export default router;