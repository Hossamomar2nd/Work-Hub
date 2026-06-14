import express from "express";
import { Types } from "mongoose";
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
import { validation } from "../../middleware/val.middleware.js";
import { upload } from "../../middleware/uploadImages.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();
const objectIdPattern = /^[a-f\d]{24}$/i;

const isObjectId = (value) => {
  return (
    typeof value === "string" &&
    objectIdPattern.test(value) &&
    Types.ObjectId.isValid(value)
  );
};

const validateObjectIdParams = (...paramNames) => {
  return (req, res, next) => {
    for (const paramName of paramNames) {
      const value = req.params[paramName];

      if (!isObjectId(value)) {
        return res
          .status(400)
          .json({ message: `${paramName} must be a valid ObjectId` });
      }
    }

    return next();
  };
};

router.get("/getAllPosts", asyncHandler(getAllPosts));
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
  upload.single("media"),
  asyncHandler(uploadPostMedia),
);
router.put(
  "/addLike/:postId/:userId/:role",
  validateObjectIdParams("postId"),
  auth(postEndPoints.addLike),
  asyncHandler(addLike),
);
router.put(
  "/removeLike/:postId/:userId/:role",
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
  "/addComment/:postId/:userId/:role",
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
