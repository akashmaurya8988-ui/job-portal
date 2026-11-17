const express = require("express");
const router = express.Router();
const { db } = require("../config/firebaseAdmin");
const { verifyToken } = require("../middleware/authMiddleware");

router.use(verifyToken);

// GET /api/notifications - Fetch logged-in user's notifications
router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection("notifications")
      .where("userId", "==", req.user.uid)
      .get();

    const notifications = snapshot.docs
      .map((doc) => ({
        notificationId: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => (b.createdAt?._seconds || 0) - (a.createdAt?._seconds || 0));

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("getNotifications error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
});

// PATCH /api/notifications/read-all - Mark all as read
router.patch("/read-all", async (req, res) => {
  try {
    const snapshot = await db
      .collection("notifications")
      .where("userId", "==", req.user.uid)
      .where("isRead", "==", false)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { isRead: true });
    });
    await batch.commit();

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("readAll error:", error);
    res.status(500).json({ success: false, message: "Failed to update notifications" });
  }
});

// PATCH /api/notifications/:id/read - Mark single notification as read
router.patch("/:id/read", async (req, res) => {
  try {
    const notifRef = db.collection("notifications").doc(req.params.id);
    const notifSnap = await notifRef.get();

    if (!notifSnap.exists) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    if (notifSnap.data().userId !== req.user.uid) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await notifRef.update({ isRead: true });
    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("markRead error:", error);
    res.status(500).json({ success: false, message: "Failed to update notification" });
  }
});

module.exports = router;