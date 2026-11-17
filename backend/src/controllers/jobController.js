const { db, FieldValue } = require("../config/firebaseAdmin");

// GET /api/jobs (Public)
const getAllJobs = async (req, res) => {
  try {
    const { q, location, jobType, experience, recruiterId } = req.query;

    const snapshot = await db
      .collection("jobs")
      .orderBy("createdAt", "desc")
      .get();

    let jobs = snapshot.docs.map((doc) => ({
      jobId: doc.id,
      ...doc.data(),
    }));

    if (recruiterId) {
      jobs = jobs.filter((job) => job.recruiterId === recruiterId);
    } else {
      // Public listing mein sirf approved jobs dikhayein
      jobs = jobs.filter((job) => job.status === "approved");
    }

    if (q) {
      const keyword = q.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(keyword) ||
          job.companyName?.toLowerCase().includes(keyword) ||
          job.skills?.some((s) => s.toLowerCase().includes(keyword))
      );
    }
    if (location) {
      const loc = location.toLowerCase();
      jobs = jobs.filter((job) => job.location?.toLowerCase().includes(loc));
    }
    if (jobType) {
      jobs = jobs.filter(
        (job) => job.jobType?.toLowerCase() === jobType.toLowerCase()
      );
    }
    if (experience) {
      jobs = jobs.filter(
        (job) => job.experience?.toLowerCase() === experience.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("getAllJobs error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

// GET /api/jobs/:id (Public)
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const docSnap = await db.collection("jobs").doc(id).get();

    if (!docSnap.exists) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      job: { jobId: docSnap.id, ...docSnap.data() },
    });
  } catch (error) {
    console.error("getJobById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch job details" });
  }
};

// POST /api/jobs (Protected: Recruiter or Admin)
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      salary,
      jobType,
      experience,
      skills,
      companyId,
      companyName,
    } = req.body;

    if (!title || !description || !location || !salary || !jobType) {
      return res.status(400).json({
        success: false,
        message: "Title, description, location, salary, and jobType are required.",
      });
    }

    const jobRef = db.collection("jobs").doc();
    const newJob = {
      jobId: jobRef.id,
      companyId: companyId || "",
      companyName: companyName || "Hiring Company",
      recruiterId: req.user.uid,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      salary: salary.trim(),
      jobType,
      experience: experience || "Fresher",
      skills: Array.isArray(skills) ? skills : [],
      status: "approved",
      createdAt: FieldValue.serverTimestamp(),
    };

    await jobRef.set(newJob);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("createJob error:", error);
    res.status(500).json({ success: false, message: "Failed to create job" });
  }
};

// PUT /api/jobs/:id (Protected: Owner Recruiter or Admin)
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const jobRef = db.collection("jobs").doc(id);
    const docSnap = await jobRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const jobData = docSnap.data();
    if (jobData.recruiterId !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only edit your own job postings",
      });
    }

    const updates = { ...req.body };
    delete updates.jobId;
    delete updates.recruiterId;
    delete updates.createdAt;

    await jobRef.update(updates);

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error("updateJob error:", error);
    res.status(500).json({ success: false, message: "Failed to update job" });
  }
};

// DELETE /api/jobs/:id (Protected: Owner Recruiter or Admin)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const jobRef = db.collection("jobs").doc(id);
    const docSnap = await jobRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const jobData = docSnap.data();
    if (jobData.recruiterId !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only delete your own job postings",
      });
    }

    await jobRef.delete();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("deleteJob error:", error);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };