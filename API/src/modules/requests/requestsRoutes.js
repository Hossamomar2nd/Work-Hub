
import express from "express";
import { validateParams, validation } from "../../middleware/val.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addRequest, deleteRequest, getAllRequests, getClientRequests, getFreelancerRequests, getUserRequests, updateRequestStatus } from "./requestsController.js";
import { requestSchema, updateRequestSchema } from "./requestsSchema.js";
import endPoints from "../../middleware/endPoints.js";
import auth from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get("/getAllRequests", asyncHandler(getAllRequests)); // auth(endPoints.admin)
router.get("/getClientRequests/:id", asyncHandler(getClientRequests)); // auth(endPoints.admin)
router.get("/getFreelancerRequests/:id", asyncHandler(getFreelancerRequests)); // auth(endPoints.admin)
router.get("/getUserRequests/:role/:id", asyncHandler(getUserRequests)); // auth(endPoints.admin)
router.post("/addRequest", validation(requestSchema), asyncHandler(addRequest)); //, auth(endPoints.admin)
router.put("/updateRequest/:id", validation(updateRequestSchema), validateParams(), asyncHandler(updateRequestStatus)); // auth(endPoints.admin),
router.delete("/deleteRequest/:id", validateParams(), asyncHandler(deleteRequest)); // auth(endPoints.admin),

export default router;