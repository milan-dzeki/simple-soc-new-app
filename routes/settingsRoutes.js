const { Router } = require("express");
const { protect } = require("../middlewares/auth");
const { getMySettings, changeSingleSetting, createSettingsForAll } = require("../controllers/settingsController");

const router = Router();
router.post("/createAll", createSettingsForAll);
router.use(protect);
router.route("/")
  .get(getMySettings)
  .patch(changeSingleSetting);

module.exports = router;