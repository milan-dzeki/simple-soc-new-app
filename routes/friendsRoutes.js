const { Router } = require("express");
const { protect } = require("../middlewares/auth");
const { sendFriendRequest, unsendFriendRequest, acceptFriendRequest, declineFriendRequest, unfriend, getMyFriends, getUserFriends } = require("../controllers/friendsController");

const router = Router();

router.use(protect);

router.get("/myFriends", getMyFriends);
router.get("/userFriends/:userId", getUserFriends);

router.post("/sendRequest", sendFriendRequest);
router.post("/unsendRequest", unsendFriendRequest);
router.post("/acceptRequest", acceptFriendRequest);
router.post("/declineRequest", declineFriendRequest);
router.post("/unfriend", unfriend);

module.exports = router;