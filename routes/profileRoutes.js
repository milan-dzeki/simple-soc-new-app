const { Router } = require("express");
const { protect } = require("../middlewares/auth");
const { addHighSchoolInfo, addNewCurrentJobInfo, addNewPreviousJobInfo, addNewPreviousResidenceInfo, editSinglePreviousResidenceInfo, getUsersProfile, getMyProfile, addNewCollegeOrEducationInfo, addCurrentResidenceInfo, deleteSingleCollegeOrEducationInfo, deleteSingleCurrentJobInfo, deleteSinglePreviousJobInfo, deleteCurrentResidenceInfo, deleteSinglePreviousResidenceInfo, deleteHighSchoolInfo, editSingleCurrentJobInfo, editSinglePreviousJobInfo, editSingleCollegeOrEducationInfo } = require("../controllers/profileController");

const router = Router();

router.use(protect);
router.post("/highSchool", addHighSchoolInfo);
router.route("/highSchool")
  .post(addHighSchoolInfo)
  .delete(deleteHighSchoolInfo);

router.route("/currentJob")
  .post(addNewCurrentJobInfo)
  .patch(editSingleCurrentJobInfo);

router.delete("/currentJob/:id", deleteSingleCurrentJobInfo);
router.route("/prevJob")
  .post(addNewPreviousJobInfo)
  .patch(editSinglePreviousJobInfo);

router.delete("/prevJob/:id", deleteSinglePreviousJobInfo);
router.route("/collegeOrEdu/:infoType")
  .post(addNewCollegeOrEducationInfo)
  .patch(editSingleCollegeOrEducationInfo);

router.delete("/collegeOrEdu/:infoType/:id", deleteSingleCollegeOrEducationInfo);
router.route("/curResidence")
  .post(addCurrentResidenceInfo)
  .delete(deleteCurrentResidenceInfo);

router.route("/prevResidences")
  .post(addNewPreviousResidenceInfo)
  .patch(editSinglePreviousResidenceInfo);

router.delete("/prevResidences/:id", deleteSinglePreviousResidenceInfo);

router.get("/:userId/:whoCanSeeMyProfileInfo", getUsersProfile);
router.get("/me", getMyProfile);

module.exports = router;