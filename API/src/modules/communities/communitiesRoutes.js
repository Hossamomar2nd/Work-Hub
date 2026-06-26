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
  getCommunityById,
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
  "/getCommunity/:id",
  validateObjectIdParams("id"),
  asyncHandler(getCommunityById),
);
router.get(
  "/getAllJoinedMembersCommunities",
  asyncHandler(getAllJoinedMembersCommunities),
);
router.get(
  "/getJoinedCommunities",
  auth(endPoints.allUsersExceptAdmin),
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
router.post(
  "/joinCommunity/:communityId",
  validateObjectIdParams("communityId"),
  auth(endPoints.allUsersExceptAdmin),
  asyncHandler(joinCommunity),
);
router.delete(
  "/unjoinCommunity/:communityId",
  validateObjectIdParams("communityId"),
  auth(endPoints.allUsersExceptAdmin),
  asyncHandler(unjoinCommunity),
);
router.put(
  "/uploadCoverImage/:communityId",
  validateObjectIdParams("communityId"),
  auth(endPoints.admin),
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
