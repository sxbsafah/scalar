import multer from 'multer';
import { Router } from "express";
import { verifyFile } from '@/middlewares/verifyFile.js';
import { createVideo } from '@/controllers/createVideo.js';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/create-video", upload.fields([{ name: 'video', }, { name: 'thumbnail' }]), verifyFile,createVideo);

