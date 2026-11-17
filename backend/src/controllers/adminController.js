const { db } = require("../config/firebaseAdmin");

// GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [usersSnap, jobsSnap, appsSnap, companiesSnap] = await Promise.all([
      db.collection("users").get(),
      db.collection("jobs").get(),
      db.collection("applications").get(),
      db.collection("companies").get(),
    ]);

    const users = usersSnap.docs.map((d) => d.data());
    const totalStudents = users.filter((u) => u.role === "student").length;
    const totalRecruiters = users.filter((u) => u.role === "recruiter").length;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalStudents,
        totalRecruiters,
        totalCompanies: companiesSnap.size,
        totalJobs: jobsSnap.size,
        totalApplications: appsSnap.size,
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ success: false, message: "Failed to load admin stats" });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => doc.data());
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// GET /api/admin/jobs (All jobs regardless of status)
const getAllJobsForAdmin = async (req, res) => {
  try {
    const snapshot = await db
      .collection("jobs")
      .orderBy("createdAt", "desc")
      .get();
    const jobs = snapshot.docs.map((doc) => ({
      jobId: doc.id,
      ...doc.data(),
    }));
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("getAllJobsForAdmin error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

// PATCH /api/admin/jobs/:id/status
const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "pending", "removed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid job status" });
    }

    const jobRef = db.collection("jobs").doc(id);
    const jobSnap = await jobRef.get();
    if (!jobSnap.exists) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await jobRef.update({ status });
    res.status(200).json({
      success: true,
      message: `Job status updated to ${status}`,
    });
  } catch (error) {
    console.error("updateJobStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update job status" });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllJobsForAdmin,
  updateJobStatus,
};