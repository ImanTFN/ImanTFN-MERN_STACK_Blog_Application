const express = require("express");
const { createPostCtrl, fetchPostsCtrl,fetchPostCtrl,updatePostCtrl,
    deletePostCtrl,toggleAndLikeToPostCtrl,toggleAndDislikeToPostCtrl } = require("../../controllers/post/postCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const { photoUpload, postImgResize } = require("../../middlewares/upload/photoUpload");
const postRoute = express.Router();

postRoute.post("/",authMiddleware, photoUpload.single("image"),postImgResize, createPostCtrl);
postRoute.get("/", fetchPostsCtrl);
postRoute.put("/likes",authMiddleware, toggleAndLikeToPostCtrl);

postRoute.put("/dislikes",authMiddleware, toggleAndDislikeToPostCtrl);

postRoute.get("/:id", fetchPostCtrl);
postRoute.put("/:id",authMiddleware, updatePostCtrl);
postRoute.delete("/:id",authMiddleware, deletePostCtrl);



module.exports = postRoute;