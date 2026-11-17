const { db } = require("../config/firebaseAdmin");

// GET /api/users/profile?uid=... (Phase 8 mein req.user.uid se aayega)
const getUserProfile = async (req, res) => {
  try {
    const uid = req.user?.uid || req.query.uid;
    if (!uid) {
      return res.status(400).json({ success: false, message: "User UID is required" });
    }

    const userSnap = await db.collection("users").doc(uid).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }

    res.status(200).json({
      success: true,
      user: userSnap.data(),
    });
  } catch (error) {
    console.error("getUserProfile error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

// PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    const uid = req.user?.uid || req.body.uid;
    if (!uid) {
      return res.status(400).json({ success: false, message: "User UID is required" });
    }

    const { fullName, phone, skills, education, profileImage } = req.body;
    const updates = {};
    if (fullName !== undefined) updates.fullName = fullName.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (skills !== undefined) updates.skills = skills;
    if (education !== undefined) updates.education = education.trim();
    if (profileImage !== undefined) updates.profileImage = profileImage;

    await db.collection("users").doc(uid).update(updates);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("updateUserProfile error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

module.exports = { getUserProfile, updateUserProfile };