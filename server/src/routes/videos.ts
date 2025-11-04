import { Router } from "express";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/video", upload.single("video"),(req: Request, res: Response) => {});
