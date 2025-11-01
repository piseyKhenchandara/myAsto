import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req, file) => {
      return file.mimetype.startsWith("video/") ? "product_videos" : "product_images";
    },
    resource_type: (req, file) => {
      return file.mimetype.startsWith("video/") ? "video" : "image";
    },
  },
});

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/quicktime']; 

    if (allowedImageTypes.includes(file.mimetype)) {
        return cb(null, true); 
    }
    if (allowedVideoTypes.includes(file.mimetype)) {
        return cb(null, true); 
    }
    cb(new Error("File type not allowed"), false);
};


export const uploadAnyMedia = multer({
  storage,
  fileFilter,
  limits: {
    files: 8,
    fileSize: 100 * 1024 * 1024,
  },
}).any();