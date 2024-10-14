
import express from "express";
import auth from '../../middleware/auth.middleware.js'
import { validateParams, validation } from "../../middleware/val.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addCommunity, deleteCommunity, getAllCommunities, getAllJoinedMembersCommunities, getJoinedCommunities, joinCommunity, unjoinCommunity, updateCommunity, uploadCoverImage } from "./communitiesController.js";
import { communitySchema, updateCommunitySchema } from "./communitiesSchema.js";
import endPoints from "../../middleware/endPoints.js";
import { upload } from "../../middleware/uploadImages.js";

const router = express.Router();

router.get("/getAllCommunities", asyncHandler(getAllCommunities));
router.get("/getAllJoinedMembersCommunities", asyncHandler(getAllJoinedMembersCommunities));
router.get("/getJoinedCommunities/:id/:role", asyncHandler(getJoinedCommunities));
router.post("/addCommunity", validation(communitySchema), asyncHandler(addCommunity));
router.put("/updateCommunity/:id", validation(updateCommunitySchema), validateParams(), asyncHandler(updateCommunity))
router.put("/joinCommunity/:communityId/:userId/:role", asyncHandler(joinCommunity));
router.put("/unjoinCommunity/:communityId/:userId/:role", asyncHandler(unjoinCommunity));
router.put("/uploadCoverImage/:id/:role", upload.single('coverImage'), asyncHandler(uploadCoverImage));
router.delete("/deleteCommunity/:id", validateParams(), asyncHandler(deleteCommunity));

export default router;