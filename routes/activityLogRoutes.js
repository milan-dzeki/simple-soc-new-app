const { Router } = require("express");
const { protect } = require("../middlewares/auth");
const { getActivityLogsForUser, deleteLog } = require("../controllers/activityLogController");

const router = Router();

router.use(protect);

router.delete("/:logId", deleteLog);
router.get("/", getActivityLogsForUser);

module.exports = router;