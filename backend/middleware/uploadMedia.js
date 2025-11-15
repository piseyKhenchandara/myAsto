// middleware/uploadMedia.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "profile_pictures", 
    resource_type: "image",
    format: undefined,
    transformation: [{ width: 512, height: 512, crop: "limit" }]  
  })
});

const profileFileFilter = (req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  cb(ok ? null : new Error("Only JPEG, PNG, or WebP allowed"), ok);
};

export const uploadProfilePicture = multer({
  storage: profileStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: profileFileFilter
}).single("image"); 






const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "category_images",  
    resource_type: "image",
    format: undefined,
    transformation: [{ width: 512, height: 512, crop: "limit" }]
  })
});

const categoryFileFilter = (req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.mimetype);
  cb(ok ? null : new Error("Only JPEG, PNG, WebP, or SVG allowed"), ok);
};

export const uploadCategoryImage = multer({
  storage: categoryStorage,
  limits: { fileSize: 2 * 1024 * 1024 },  // 2MB
  fileFilter: categoryFileFilter
}).single("image");  // ← Uses req.file


// ========================================
// 3. BRAND LOGO UPLOAD (Single Image)
// ========================================
const brandStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "brand_logos",  // ← Separate folder for brands
    resource_type: "image",
    format: undefined,
    transformation: [{ width: 512, height: 512, crop: "limit" }]
  })
});

const brandFileFilter = (req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.mimetype);
  cb(ok ? null : new Error("Only JPEG, PNG, WebP, or SVG allowed"), ok);
};

export const uploadBrandLogo = multer({
  storage: brandStorage,
  limits: { fileSize: 2 * 1024 * 1024 },  // 2MB
  fileFilter: brandFileFilter
}).single("image");  // ← Uses req.file






// ========================================
// 4. PRODUCT MEDIA UPLOAD (Multiple)
// ========================================
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: file.mimetype.startsWith("video/") ? "product_videos" : "product_images",
    resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
    format: undefined,
    transformation: file.mimetype.startsWith("video/")
      ? [{ quality: "auto", fetch_format: "auto" }]
      : [{ width: 1024, height: 1024, crop: "limit" }],
  }),
});

const productFileFilter = (req, file, cb) => {
  const ok = file.mimetype?.startsWith("image/") || file.mimetype?.startsWith("video/");
  cb(ok ? null : new Error("Only image/* or video/* allowed"), ok);
};

export const uploadProductMedia = multer({
  storage: productStorage,
  fileFilter: productFileFilter,
  limits: {
    files: 8,
    fileSize: 100 * 1024 * 1024,  // 100MB for products
  },
}).any();