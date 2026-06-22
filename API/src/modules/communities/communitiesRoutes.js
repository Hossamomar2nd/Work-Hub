import express from "express";
import auth from "../../middleware/auth.middleware.js";
import {
  validateObjectIdParams,
  validation,
} from "../../middleware/val.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  addCommunity,
  deleteCommunity,
  getAllCommunities,
  getAllJoinedMembersCommunities,
  getJoinedCommunities,
  joinCommunity,
  unjoinCommunity,
  updateCommunity,
  uploadCoverImage,
} from "./communitiesController.js";
import { communitySchema, updateCommunitySchema } from "./communitiesSchema.js";
import endPoints from "../../middleware/endPoints.js";
import { uploadImage } from "../../middleware/uploadImages.js";

const router = express.Router();

router.get("/getAllCommunities", asyncHandler(getAllCommunities));
router.get(
  "/getAllJoinedMembersCommunities",
  asyncHandler(getAllJoinedMembersCommunities),
);
router.get(
  "/getJoinedCommunities/:id/:role",
  validateObjectIdParams("id"),
  asyncHandler(getJoinedCommunities),
);
router.post(
  "/addCommunity",
  auth(endPoints.admin),
  validation(communitySchema),
  asyncHandler(addCommunity),
);
router.put(
  "/updateCommunity/:id",
  validateObjectIdParams("id"),
  auth(endPoints.admin),
  validation(updateCommunitySchema),
  asyncHandler(updateCommunity),
);
router.put(
  "/joinCommunity/:communityId/:userId/:role",
  validateObjectIdParams("communityId"),
  auth(endPoints.allUsersExceptAdmin),
  asyncHandler(joinCommunity),
);
router.put(
  "/unjoinCommunity/:communityId/:userId/:role",
  validateObjectIdParams("communityId"),
  auth(endPoints.allUsersExceptAdmin),
  asyncHandler(unjoinCommunity),
);
router.put(
  "/uploadCoverImage/:id/:role",
  auth(endPoints.allUsersExceptAdmin),
  uploadImage("coverImage"),
  asyncHandler(uploadCoverImage),
);
router.delete(
  "/deleteCommunity/:id",
  validateObjectIdParams("id"),
  auth(endPoints.admin),
  asyncHandler(deleteCommunity),
);

export default router;
