const { db, FieldValue } = require("../config/firebaseAdmin");

// POST /api/applications (Student only)
const applyToJob = async (req, res) => {
  try {
    const { jobId, resumeUrl, coverLetter } = req.body;
    const studentId = req.user.uid;

    if (!jobId || !resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "jobId and resumeUrl are required.",
      });
    }

    // Check job exists
    const jobSnap = await db.collection("jobs").doc(jobId).get();
    if (!jobSnap.exists) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    const jobData = jobSnap.data();

    // Prevent duplicate application
    const existingSnap = await db
      .collection("applications")
      .where("jobId", "==", jobId)
      .where("studentId", "==", studentId)
      .get();

    if (!existingSnap.empty) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    const appRef = db.collection("applications").doc();
    const newApplication = {
      applicationId: appRef.id,
      jobId,
      jobTitle: jobData.title,
      companyName: jobData.companyName,
      studentId,
      studentName: req.user.fullName,
      studentEmail: req.user.email,
      recruiterId: jobData.recruiterId,
      resumeUrl,
      coverLetter: coverLetter ? coverLetter.trim() : "",
      status: "pending",
      appliedAt: FieldValue.serverTimestamp(),
    };

    await appRef.set(newApplication);

    // Recruiter ke liye notification create karein
    const notifRef = db.collection("notifications").doc();
    await notifRef.set({
      notificationId: notifRef.id,
      userId: jobData.recruiterId,
      message: `${req.user.fullName || "A student"} applied for ${jobData.title}.`,
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    console.error("applyToJob error:", error);
    res.status(500).json({ success: false, message: "Failed to submit application" });
  }
};

// GET /api/applications/my (Student only)
const getMyApplications = async (req, res) => {
  try {
    const snapshot = await db
      .collection("applications")
      .where("studentId", "==", req.user.uid)
      .get();

    const applications = snapshot.docs.map((doc) => ({
      applicationId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("getMyApplications error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

// GET /api/applications/job/:jobId (Recruiter/Admin only)
const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobSnap = await db.collection("jobs").doc(jobId).get();

    if (!jobSnap.exists) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (jobSnap.data().recruiterId !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only view applicants for your own jobs",
      });
    }

    const snapshot = await db
      .collection("applications")
      .where("jobId", "==", jobId)
      .get();

    const applications = snapshot.docs.map((doc) => ({
      applicationId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("getApplicationsByJob error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch applicants" });
  }
};

// PATCH /api/applications/:id/status (Recruiter/Admin only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "reviewed", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const appRef = db.collection("applications").doc(id);
    const appSnap = await appRef.get();

    if (!appSnap.exists) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const appData = appSnap.data();
    if (appData.recruiterId !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot update this application",
      });
    }

    await appRef.update({ status });

    // Student ke liye notification create karein
    const notifRef = db.collection("notifications").doc();
    await notifRef.set({
      notificationId: notifRef.id,
      userId: appData.studentId,
      message: `Your application for ${appData.jobTitle} was marked as "${status}".`,
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
    });
  } catch (error) {
    console.error("updateApplicationStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
};