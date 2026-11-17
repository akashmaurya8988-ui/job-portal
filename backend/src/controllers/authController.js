const { db } = require("../config/firebaseAdmin");

// GET /api/auth/me - Return verified logged-in user's full profile
const getMe = async (req, res) => {
  try {
    const userSnap = await db.collection("users").doc(req.user.uid).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: userSnap.data(),
    });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user info" });
  }
};

module.exports = { getMe };