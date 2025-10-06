
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // not "../config/cloudinary"
import multer from "multer";


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "product_images",
    resource_type: "image",
    format: undefined,
    transformation: [{ width: 512, height: 512, crop: "limit" }]
  })
});

const fileFilter = (req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  cb(ok ? null : new multer.MulterError("LIMIT_UNEXPECTED_FILE", "image"), ok);
};

export const uploadSingle = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
}).single("image");

export const uploadMultiple = multer({
  storage,
  limits: { files: 5, fileSize: 2 * 1024 * 1024 },
  fileFilter
}).array("images", 5);
