const { Router } = require("express");
const formidable = require("express-formidable");
const { protect } = require("../middlewares/auth");
const { sendModalMessage, sendMessage,  getUnreadChatsCount, getChats, getSingleChatMessages, markMessagesAsSeen } = require( "../controllers/chatController" );

const router = Router();

router.use(protect);

router.post("/markMessagesAsSeen", markMessagesAsSeen);
router.get("/unreadChats", getUnreadChatsCount);
router.post("/sendModalMessage", formidable(), sendModalMessage);
router.post("/sendMessage", formidable(), sendMessage);
router.get("/:chatId/:userId", getSingleChatMessages);
router.get("/", getChats);

module.exports = router;