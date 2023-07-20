const { Router } = require("express");
const formidable = require("express-formidable");
const { signup, login, isLoggedIn, deleteAccount } = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

const router = Router();

router.post("/signup", formidable(), signup);
router.post("/login", login);
router.post("/isLoggedIn", isLoggedIn);
router.delete("/deleteAccount", protect, deleteAccount);

module.exports = router;