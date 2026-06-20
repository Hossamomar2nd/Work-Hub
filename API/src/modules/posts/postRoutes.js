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
import { commentSchema, postSchema, updatePostSchema } from "./postSchema.js";
import {
  validation,
  validateObjectIdParams,
} from "../../middleware/val.middleware.js";
import { uploadImage } from "../../middleware/uploadImages.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.get("/getAllPosts", asyncHandler(getAllPosts));
router.get("/getPost/:id", validateObjectIdParams("id"), asyncHandler(getPost));
router.get(
  "/getUserPosts/:id",
  validateObjectIdParams("id"),
  asyncHandler(getUserPosts),
);
router.get(
  "/getCommunityPosts/:id",
  validateObjectIdParams("id"),
  asyncHandler(getCommunityPosts),
);
router.get(
  "/getPostlikesCount/:id",
  validateObjectIdParams("id"),
  asyncHandler(getPostlikesCount),
);
router.post(
  "/addPost",
  auth(postEndPoints.createPost),
  validation(postSchema),
  asyncHandler(addPost),
);
router.put(
  "/uploadPostMedia/:id",
  validateObjectIdParams("id"),
  auth(postEndPoints.uploadMedia),
  uploadImage("media"),
  asyncHandler(uploadPostMedia),
);
router.put(
  "/addLike/:postId",
  validateObjectIdParams("postId"),
  auth(postEndPoints.addLike),
  asyncHandler(addLike),
);
router.put(
  "/removeLike/:postId",
  validateObjectIdParams("postId"),
  auth(postEndPoints.removeLike),
  asyncHandler(removeLike),
);
router.put(
  "/deleteComment/:postId/:commentId",
  validateObjectIdParams("postId", "commentId"),
  auth(postEndPoints.deleteComment),
  asyncHandler(deleteComment),
);
router.put(
  "/addComment/:postId",
  validateObjectIdParams("postId"),
  auth(postEndPoints.addComment),
  validation(commentSchema),
  asyncHandler(addComment),
);
router.put(
  "/updatePost/:id",
  validateObjectIdParams("id"),
  auth(postEndPoints.updatePost),
  validation(updatePostSchema),
  asyncHandler(updatePost),
);
router.delete(
  "/deletePost/:id",
  validateObjectIdParams("id"),
  auth(postEndPoints.deletePost),
  asyncHandler(deletePost),
);

export default router;
