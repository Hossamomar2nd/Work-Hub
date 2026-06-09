import express from "express";
import auth from "../../middleware/auth.middleware.js";
import {
  addPost,
  getPost,
  getAllPosts,
  addLike,
  updatePost,
  addComment,
  uploadPostMedia,
  removeLike,
  getUserPosts,
  getCommunityPosts,
  deletePost,
  deleteComment,
  getPostlikesCount,
} from "./postController.js";
import postEndPoints from "./endpoint.js";
import { postSchema } from "./postSchema.js";
import { validation } from "../../middleware/val.middleware.js";
import { upload } from "../../middleware/uploadImages.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.get("/getAllPosts", asyncHandler(getAllPosts));
router.get("/getUserPosts/:id", asyncHandler(getUserPosts));
router.get("/getCommunityPosts/:id", asyncHandler(getCommunityPosts));
router.get("/getPostlikesCount/:id", asyncHandler(getPostlikesCount));
router.post(
  "/addPost",
  auth(postEndPoints.createPost),
  validation(postSchema),
  asyncHandler(addPost),
);
router.put(
  "/uploadPostMedia/:id",
  auth(postEndPoints.uploadMedia),
  upload.single("media"),
  asyncHandler(uploadPostMedia),
);
router.put(
  "/addLike/:postId/:userId/:role",
  auth(postEndPoints.addLike),
  asyncHandler(addLike),
);
router.put(
  "/removeLike/:postId/:userId/:role",
  auth(postEndPoints.removeLike),
  asyncHandler(removeLike),
);
router.put(
  "/deleteComment/:postId/:commentText",
  auth(postEndPoints.deleteComment),
  asyncHandler(deleteComment),
);
router.put(
  "/addComment/:postId/:userId/:role",
  auth(postEndPoints.addComment),
  asyncHandler(addComment),
);
router.put(
  "/updatePost/:id",
  auth(postEndPoints.updatePost),
  asyncHandler(updatePost),
);
router.delete(
  "/deletePost/:id",
  auth(postEndPoints.deletePost),
  asyncHandler(deletePost),
);

export default router;
