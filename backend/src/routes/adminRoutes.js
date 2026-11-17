const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getAllUsers,
  getAllJobsForAdmin,
  updateJobStatus,
} = require("../controllers/adminController");

router.use(verifyToken, authorizeRoles("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/jobs", getAllJobsForAdmin);
router.patch("/jobs/:id/status", updateJobStatus);

module.exports = router;