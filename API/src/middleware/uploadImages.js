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

export const upload = multer({ storage: storage });
