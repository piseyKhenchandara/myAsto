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

  //https://abc123.r2.cloudflarestorage.com/astogear-bucket/profile_pictures/abc.jpg
  if (!base) return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`;
  
  return `${base}/${key}`;
}

// ==================================================================
// HELPER: Upload buffer to R2
// =================================================================
/* 

It uploads a file to R2 and returns where to find it.
javascriptuploadToR2(buffer, "profile_pictures", "abc123.jpg", "image/jpeg")

Builds the path: profile_pictures/abc123.jpg
Uploads the file bytes to R2 at that path
Returns:

javascript{
  url: "https://cdn.astogear.com/profile_pictures/abc123.jpg", // save this to DB
  public_id: "profile_pictures/abc123.jpg"  // use this to delete later
}
*/
async function uploadToR2(buffer, folder, filename, contentType) {
  const key = `${folder}/${filename}`;
  await r2.putObject({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType || "application/octet-stream",
  });
  return {
    url: makePublicUrl(key), // the full public URL to access the file
    public_id: key   // the full public URL to access the file
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
}).single("image"); // this RETURNS a function that looks like: (req, res, next) => { ... }



export const processProfilePicture = async (req, res, next) => {
  if (!req.file) return next();
  
  try {
    const filename = `${crypto.randomBytes(16).toString("hex")}.${req.file.mimetype.split("/")[1]}`;
    const result = await uploadToR2(req.file.buffer, "profile_pictures", filename, req.file.mimetype);
    
    req.file.path = result.url; // result is just the object that uploadToR2 returned
    req.file.filename = result.public_id; // result is just the object that uplodToR2 returned
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
    
    req.file.path = result.url; // like a home address
    req.file.filename = result.public_id; // like room number
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