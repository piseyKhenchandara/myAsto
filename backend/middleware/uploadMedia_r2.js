// middleware/uploadMedia.js
// CLOUDFLARE R2 VERSION

import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from 'path';
import crypto from 'crypto';

// ==================================================================
// R2 CLIENT CONFIGURATION
// ==================================================================
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'astogear';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

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

  const ok = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
  cb(ok ? null : new Error("Unsupported image format"), ok);
};

// ==================================================================
// HELPER: Upload to R2
// ==================================================================
async function uploadToR2(file, folder) {
  try {
    const fileExt = path.extname(file.originalname);
    const nameWithoutExt = file.originalname.replace(/\.[^/.]+$/, '');
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const fileName = `${nameWithoutExt}_${uniqueSuffix}${fileExt}`;
    const key = `${folder}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await r2Client.send(command);

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    
    return {
      path: publicUrl,
      filename: fileName,
      public_id: fileName.replace(fileExt, ''),
      secure_url: publicUrl,
      url: publicUrl,
      size: file.size,
      mimetype: file.mimetype,
      resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image'
    };
  } catch (error) {
    console.error('R2 Upload Error:', error);
    throw new Error(`Failed to upload to R2: ${error.message}`);
  }
}

// ==================================================================
// Custom Multer Storage Engine (R2 Storage)
// ==================================================================
class R2Storage {
  constructor(options) {
    this.folder = options.folder;
  }

  _handleFile(req, file, cb) {
    const chunks = [];
    
    file.stream.on('data', (chunk) => chunks.push(chunk));
    file.stream.on('end', async () => {
      try {
        file.buffer = Buffer.concat(chunks);
        const result = await uploadToR2(file, this.folder);
        cb(null, result);
      } catch (error) {
        cb(error);
      }
    });
    file.stream.on('error', cb);
  }

  _removeFile(req, file, cb) {
    cb(null);
  }
}

// ==================================================================
// 1. PROFILE IMAGE UPLOAD
// ==================================================================
const profileStorage = new R2Storage({
  folder: 'profile_pictures'
});

export const uploadProfilePicture = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter
}).single("image");

// ==================================================================
// 2. CATEGORY IMAGE UPLOAD
// ==================================================================
const categoryStorage = new R2Storage({
  folder: 'category_images'
});

export const uploadCategoryImage = multer({
  storage: categoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter
}).single("image");

// ==================================================================
// 3. BRAND LOGO UPLOAD
// ==================================================================
const brandStorage = new R2Storage({
  folder: 'brand_logos'
});

export const uploadBrandLogo = multer({
  storage: brandStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter
}).single("image");

// ==================================================================
// 4. PRODUCT MEDIA (IMAGE + VIDEO)
// ==================================================================
class R2ProductStorage {
  _handleFile(req, file, cb) {
    const chunks = [];
    
    file.stream.on('data', (chunk) => chunks.push(chunk));
    file.stream.on('end', async () => {
      try {
        file.buffer = Buffer.concat(chunks);
        
        const folder = file.mimetype.startsWith("video/") 
          ? "product_videos" 
          : "product_images";
        
        const result = await uploadToR2(file, folder);
        cb(null, result);
      } catch (error) {
        cb(error);
      }
    });
    file.stream.on('error', cb);
  }

  _removeFile(req, file, cb) {
    cb(null);
  }
}

const productStorage = new R2ProductStorage();

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
    files: 25,
    fileSize: 100 * 1024 * 1024 // 100MB
  }
}).any();

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