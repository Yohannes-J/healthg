// ✅ routes/upload.js
import express from "express";
import multer from "multer";
import path from "path";

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

uploadRouter.post("/", upload.single("file"), (req, res) => {
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default uploadRouter;