// middleware/uploadMedia.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    // route to separate folders by type
    folder: file.mimetype.startsWith("video/") ? "product_videos" : "product_images",
    // critical: switch resource_type based on MIME
    resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
    format: undefined,
    // sensible transforms
    transformation: file.mimetype.startsWith("video/")
      ? [{ quality: "auto", fetch_format: "auto" }]
      : [{ width: 1024, height: 1024, crop: "limit" }],
  }),
});

// accept only images or videos (defense-in-depth; client can lie about accept=)
const fileFilter = (req, file, cb) => {
  const ok = file.mimetype?.startsWith("image/") || file.mimetype?.startsWith("video/");
  cb(ok ? null : new Error("Only image/* or video/* allowed"), ok);
};

// ONE middleware for both images + videos
export const uploadAnyMedia = multer({
  storage,
  fileFilter,
  limits: {
    files: 8,                     // total files (images + videos)
    fileSize: 100 * 1024 * 1024,  // 100MB per file
  },
}).any(); // accepts any field names, e.g., "images", "videos"
