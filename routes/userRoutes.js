const { Router } = require("express");
const { protect } = require("../middlewares/auth");
const { searchUsersByName, getLastJoinedUsers, peopleYouMayKnow, deactivateAccount, blockUser, unblockUser, getSingleUserAndUsersPosts, editUserData, uploadNewProfilePhoto, removeProfilePhoto } = require("../controllers/userController");
const formidable = require("express-formidable");

const router = Router();

router.use(protect);

router.get("/searchByName/:search", searchUsersByName);
router.get("/lastJoined", getLastJoinedUsers);
router.get("/peopleYouMayKnow", peopleYouMayKnow);
router.post("/deactivate", deactivateAccount);
router.post("/block", blockUser);
router.post("/unblock", unblockUser);
router.patch("/editUserData", editUserData);
router.post("/uploadNewProfilePhoto", formidable(), uploadNewProfilePhoto);
router.delete("/removeProfilePhoto", removeProfilePhoto);
router.get("/:userId", getSingleUserAndUsersPosts);

module.exports = router;