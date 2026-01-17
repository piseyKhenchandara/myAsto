// middleware/uploadMedia.js
import multer from "multer";
import r2 from "../config/r2.js";
import crypto from "crypto";

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
// HELPER: Generate R2 public URL
// ==================================================================
function makePublicUrl(key) {
  const base = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
  if (!base) return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`;
  return `${base}/${key}`;
}

// ==================================================================
// HELPER: Upload buffer to R2
// ==================================================================
async function uploadToR2(buffer, folder, filename, contentType) {
  const key = `${folder}/${filename}`;
  await r2.putObject({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType || "application/octet-stream",
  });
  return {
    url: makePublicUrl(key),
    public_id: key
  };
}

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
// MEMORY STORAGE (files will be in req.file.buffer)
// ==================================================================
const memoryStorage = multer.memoryStorage();

// ==================================================================
// 1. PROFILE IMAGE UPLOAD
// ==================================================================
export const uploadProfilePicture = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter
}).single("image");

export const processProfilePicture = async (req, res, next) => {
  if (!req.file) return next();
  
  try {
    const filename = `${crypto.randomBytes(16).toString("hex")}.${req.file.mimetype.split("/")[1]}`;
    const result = await uploadToR2(req.file.buffer, "profile_pictures", filename, req.file.mimetype);
    
    req.file.path = result.url;
    req.file.filename = result.public_id;
    next();
  } catch (err) {
    next(err);
  }
};

// ==================================================================
// 2. CATEGORY IMAGE UPLOAD
// ==================================================================
export const uploadCategoryImage = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter
}).single("image");

export const processCategoryImage = async (req, res, next) => {
  if (!req.file) return next();
  
  try {
    const filename = `${crypto.randomBytes(16).toString("hex")}.${req.file.mimetype.split("/")[1]}`;
    const result = await uploadToR2(req.file.buffer, "category_images", filename, req.file.mimetype);
    
    req.file.path = result.url;
    req.file.filename = result.public_id;
    next();
  } catch (err) {
    next(err);
  }
};

// ==================================================================
// 3. BRAND LOGO UPLOAD
// ==================================================================
export const uploadBrandLogo = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter
}).single("image");

export const processBrandLogo = async (req, res, next) => {
  if (!req.file) return next();
  
  try {
    const filename = `${crypto.randomBytes(16).toString("hex")}.${req.file.mimetype.split("/")[1]}`;
    const result = await uploadToR2(req.file.buffer, "brand_logos", filename, req.file.mimetype);
    
    req.file.path = result.url;
    req.file.filename = result.public_id;
    next();
  } catch (err) {
    next(err);
  }
};

// ==================================================================
// 4. PRODUCT MEDIA (IMAGE + VIDEO)
// ==================================================================
const productFileFilter = (req, file, cb) => {
  const ok =
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/");

  cb(ok ? null : new Error("Only image or video allowed"), ok);
};

export const uploadProductMedia = multer({
  storage: memoryStorage,
  fileFilter: productFileFilter,
  limits: {
    files: 25,
    fileSize: 100 * 1024 * 1024 // 100MB
  }
}).any();

export const processProductMedia = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();
  
  try {
    const processedFiles = [];
    
    for (const file of req.files) {
      const isVideo = file.mimetype.startsWith("video/");
      const folder = isVideo ? "product_videos" : "product_images";
      const ext = file.mimetype.split("/")[1];
      const filename = `${crypto.randomBytes(16).toString("hex")}.${ext}`;
      
      const result = await uploadToR2(file.buffer, folder, filename, file.mimetype);
      
      processedFiles.push({
        ...file,
        path: result.url,
        filename: result.public_id
      });
    }
    
    req.files = processedFiles;
    next();
  } catch (err) {
    next(err);
  }
};

export const validateProductMedia = (req, res, next) => {
  const files = req.files || [];

  const images = files.filter(f => f.mimetype.startsWith('image/'));
  const videos = files.filter(f => f.mimetype.startsWith('video/'));

  if (images.length > 20) {
    return res.status(400).json({ error: 'Max 20 images allowed' });
  }

  if (videos.length > 5) {
    return res.status(400).json({ error: 'Max 5 videos allowed' });
  }

  next();
};