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
import { validateId } from "../middleware/validator.js";

import { uploadProductMedia } from "../middleware/uploadMedia.js";
import {
  deleteBanner,
  getBannerByCategory,
  uploadBanner
} from "../controllers/productBanner.controller.js";

const router = Router();

// ---------- Public reads ----------

router.get("/", getAllProduct);
router.get("/category/:category_slug/brand/:brand_slug", getProductsByBrandNCategory);
router.get("/detail/:id", validateId('id'), getProductDetail);
router.get("/:id", validateId('id'), getProductById);

router.put(
  '/edit/:id',
  authenticate,
  authorizeRoles("admin", "seller"),
  validateId('id'),
  uploadProductMedia,   
  updateProduct
);


router.post(
  "/category/:slug/upload/product-banner",
  authenticate,
  authorizeRoles("admin", "seller"),
  uploadProductMedia,
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
  validateId('id'),
  deleteBanner
);

// ---------- Products (protected writes) ----------
router.post(
  "/single_product",
  authenticate,
  authorizeRoles("admin", "seller"),

  uploadProductMedia,
  uploadProduct
);



router.delete(
  "/delete/:id",
  authenticate,
  authorizeRoles("admin", "seller"),
  validateId('id'),
  deleteProduct
);

export default router;
