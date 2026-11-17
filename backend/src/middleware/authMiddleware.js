const { auth, db, FieldValue } = require("../config/firebaseAdmin");

// 1. Verify Firebase ID Token & attach user + Firestore role to req.user
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing or invalid Authorization header",
      });
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await auth.verifyIdToken(idToken);

    const userRef = db.collection("users").doc(decodedToken.uid);
    let userDoc = await userRef.get();

    // Agar Phase 5 ka purana user hai aur Firestore doc missing hai, to auto-create karein
    if (!userDoc.exists) {
      const defaultProfile = {
        uid: decodedToken.uid,
        fullName: decodedToken.name || "JobConnect User",
        email: decodedToken.email || "",
        role: "student",
        phone: "",
        skills: [],
        education: "",
        profileImage: decodedToken.picture || "",
        createdAt: FieldValue.serverTimestamp(),
      };
      await userRef.set(defaultProfile);
      userDoc = await userRef.get();
    }

    const userData = userDoc.data();
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: userData.role || "student",
      fullName: userData.fullName || "",
    };

    next();
  } catch (error) {
    console.error("verifyToken error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

// 2. Role-Based Authorization Middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${allowedRoles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };