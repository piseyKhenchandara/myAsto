// middleware/uploadMedia.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ==================================================================
// Allowed image types for ALL image uploads (flexible for phones)
// ==================================================================
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/svg+xml"
];

// ==================================================================
// UNIVERSAL IMAGE FILTER
// ==================================================================
const imageFileFilter = (req, file, cb) => {
  const isImage = file.mimetype?.startsWith("image/");

  if (!isImage) {
    return cb(new Error("Only image files are allowed"), false);
  }

  // Allow flexible formats (JPEG, PNG, WebP, HEIC, HEIF, SVG, etc.)
  const ok = ALLOWED_IMAGE_TYPES.includes(file.mimetype);

  cb(ok ? null : new Error("Unsupported image format"), ok);
};

// ==================================================================
// 1. PROFILE IMAGE UPLOAD
// ==================================================================
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "profile_pictures",
    resource_type: "image",
    format: undefined,
    transformation: [{ width: 512, height: 512, crop: "limit" }]
  })
});

export const uploadProfilePicture = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter
}).single("image");

// ==================================================================
// 2. CATEGORY IMAGE UPLOAD
// ==================================================================
const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "category_images",
    resource_type: "image",
    transformation: [{ width: 512, height: 512, crop: "limit" }]
  })
});

export const uploadCategoryImage = multer({
  storage: categoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter
}).single("image");

// ==================================================================
// 3. BRAND LOGO UPLOAD
// ==================================================================
const brandStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "brand_logos",
    resource_type: "image",
    transformation: [{ width: 512, height: 512, crop: "limit" }]
  })
});

export const uploadBrandLogo = multer({
  storage: brandStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter
}).single("image");

// ==================================================================
// 4. PRODUCT MEDIA (IMAGE + VIDEO)
// ==================================================================
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: file.mimetype.startsWith("video/")
      ? "product_videos"
      : "product_images",
    resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
    format: undefined,
    transformation: file.mimetype.startsWith("video/")
      ? [{ quality: "auto", fetch_format: "auto" }]
      : [{ width: 1024, height: 1024, crop: "limit" }]
  })
});

const productFileFilter = (req, file, cb) => {
  const ok =
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/");

  cb(ok ? null : new Error("Only image or video allowed"), ok);
};

export const uploadProductMedia = multer({
  storage: productStorage,
  fileFilter: productFileFilter,
  limits: {
    files: 10,
    fileSize: 200 * 1024 * 1024 // 200MB
  }
}).any();
