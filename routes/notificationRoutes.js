const { Router } = require("express");
const { protect } = require("../middlewares/auth");
const { setNSt, getUnreadNotificationsCount, getNotifications, markNotificationAsRead, markNotificationAsUnread, deleteNotification } = require("../controllers/notificationController");

const router = Router();

router.use(protect);

router.get("/unreadCount", getUnreadNotificationsCount);
router.post("/markAsRead", markNotificationAsRead);
router.post("/markAsUnread", markNotificationAsUnread);
router.delete("/:notificationId", deleteNotification);
router.get("/", getNotifications);

module.exports = router;