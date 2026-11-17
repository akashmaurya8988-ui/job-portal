const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", verifyToken, authorizeRoles("recruiter", "admin"), createJob);
router.put("/:id", verifyToken, authorizeRoles("recruiter", "admin"), updateJob);
router.delete("/:id", verifyToken, authorizeRoles("recruiter", "admin"), deleteJob);

module.exports = router;