const { Router } = require("express");
const formidable = require("express-formidable");
const { protect } = require("../middlewares/auth");
const { createNewPhotoAlbum, deletePhotoAlbum, getMyPhotoAlbums, deletePhotoFromPhotoAlbum, addPhotosToPhotoAlbum, editPhotoAlbumName, getUserPhotoAlbums, commentOnPhoto, deletePhotoComment, likePhoto, unlikePhoto, likePhotoComment, unlikePhotoComment, getSinglePhoto, editPhotoDescription } = require("../controllers/photoAlbumController");

const router = Router();

router.use(protect);

router.delete("/photoComment/:albumId/:photoId/:commentId", deletePhotoComment);
router.get("/photo/:albumId/:photoId", getSinglePhoto);
router.route("/photoComment")
  .post(formidable(), commentOnPhoto);

router.post("/photoCommentLike", likePhotoComment);
router.post("/photoCommentUnlike", unlikePhotoComment);
router.post("/photoDescriptionChange", editPhotoDescription);
router.delete("/deletePhoto/:albumId/:photoId", deletePhotoFromPhotoAlbum);
router.post("/addPhotosToAlbum", formidable(), addPhotosToPhotoAlbum);
router.post("/editAlbumName", editPhotoAlbumName);
router.post("/photo/like", likePhoto);
router.post("/photo/unlike", unlikePhoto);
router.delete("/:albumId", deletePhotoAlbum);
router.get("/:userId", getUserPhotoAlbums);
router.get("/", getMyPhotoAlbums);
router.post("/", formidable(), createNewPhotoAlbum);

module.exports = router;