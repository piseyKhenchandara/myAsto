import { Router } from "express";
import { 
  uploadProduct,
  getAllProduct,
  getProductById,
  getProductsByBrandNCategory,
  getProductDetail,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

import { authenticate } from "../middleware/autheticate.js"; // <— check filename spelling
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { validateNumericId } from "../middleware/validateNumericId.js";
import { uploadMultiple } from "../middleware/uploadImage.js";
import { uploadMultipleVideos } from "../middleware/uploadVideo.js";
import { uploadAnyMedia } from "../middleware/uploadMedia.js";
import {
  deleteBanner,
  getBannerByCategory,
  uploadBanner
} from "../controllers/productBanner.controller.js";

const router = Router();

// ---------- Public reads ----------

router.get("/", getAllProduct);
router.get("/category/:category_slug/brand/:brand_slug", getProductsByBrandNCategory);
router.get("/detail/:id", validateNumericId, getProductDetail);
router.get("/:id", validateNumericId, getProductById);

router.put(
  '/edit/:id',
  authenticate,
  authorizeRoles("admin", "seller"),
  validateNumericId,
  uploadAnyMedia,   
  updateProduct
);


router.post(
  "/category/:slug/upload/product-banner",
  authenticate,
  authorizeRoles("admin", "seller"),
  uploadAnyMedia,
  uploadBanner
);

router.get(
  "/category/:slug/product-banners/new",
  getBannerByCategory
);

router.delete(
  "/category/product-banner/:id",
  authenticate,
  authorizeRoles("admin", "seller"),
  validateNumericId,
  deleteBanner
);

// ---------- Products (protected writes) ----------
router.post(
  "/single_product",
  authenticate,
  authorizeRoles("admin", "seller"),
  // If you want separate image/video handlers instead of "any":
  // uploadMultiple,
  // uploadMultipleVideos,
  uploadAnyMedia,
  uploadProduct
);



router.delete(
  "/delete/:id",
  authenticate,
  authorizeRoles("admin", "seller"),
  validateNumericId,
  deleteProduct
);

export default router;
