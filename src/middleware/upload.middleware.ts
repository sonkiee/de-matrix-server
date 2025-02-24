import multer from "multer";
import { AuthRequest } from "./auth.middleware";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req: AuthRequest, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const yupload = multer({ storage }).single("image");
