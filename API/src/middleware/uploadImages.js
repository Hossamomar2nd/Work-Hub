import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + nanoid() + path.extname(file.originalname));
  },
});

const allowedImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSizeInBytes = 5 * 1024 * 1024;

const imageFileFilter = (req, file, cb) => {
  if (allowedImageMimeTypes.has(file.mimetype)) {
    return cb(null, true);
  }

  const error = new Error("Only JPEG, PNG, and WebP images are allowed");
  error.cause = 400;
  return cb(error);
};

export const upload = multer({ storage: storage });
export const imageUpload = multer({
  storage,
  limits: { fileSize: maxImageSizeInBytes },
  fileFilter: imageFileFilter,
});

export const uploadImage = (fieldName) => {
  const middleware = imageUpload.single(fieldName);

  return (req, res, next) => {
    middleware(req, res, (error) => {
      if (error) {
        error.cause = error.cause || 400;
        return next(error);
      }

      return next();
    });
  };
};
