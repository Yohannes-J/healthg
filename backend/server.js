import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";



// Local imports
import connectDB from "./config/mongodb.js";
import { setupSocketIO } from "./utils/socket.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import chatRouter from "./routes/chatRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";

dotenv.config();

// Initialize
const app = express();
const port = process.env.PORT || 4000;

// Connect MongoDB
connectDB();

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/appointment", appointmentRouter);

// File upload setup with Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "audio/mpeg", "video/mp4"];
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPG, PNG, MP3, and MP4 files are allowed."));
  },
});

// Upload Endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

// Socket.IO Setup
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
setupSocketIO(io);

// Start Server
server.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
