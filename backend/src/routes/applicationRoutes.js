const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");

router.post("/", verifyToken, authorizeRoles("student"), applyToJob);
router.get("/my", verifyToken, authorizeRoles("student"), getMyApplications);
router.get("/job/:jobId", verifyToken, authorizeRoles("recruiter", "admin"), getApplicationsByJob);
router.patch("/:id/status", verifyToken, authorizeRoles("recruiter", "admin"), updateApplicationStatus);

module.exports = router;