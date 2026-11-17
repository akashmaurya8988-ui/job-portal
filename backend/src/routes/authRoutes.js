const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { getMe } = require("../controllers/authController");

router.get("/me", verifyToken, getMe);

module.exports = router;