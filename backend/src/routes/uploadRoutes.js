const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../uploads/resumes");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${req.user.uid}_${Date.now()}_${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed!"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/resume", verifyToken, upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload a PDF resume file." });
  }
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const resumeUrl = `${baseUrl}/uploads/resumes/${req.file.filename}`;
  res.status(200).json({ success: true, message: "Resume uploaded successfully", resumeUrl });
});

module.exports = router;