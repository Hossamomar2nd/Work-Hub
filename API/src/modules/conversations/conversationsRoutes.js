
import express from "express";
import auth from '../../middleware/auth.middleware.js'
import { validateParams, validation } from "../../middleware/val.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addConversation, deleteConversation, getAllConversations, getConversationById, getConversationsByUserId, updateConversation } from "./conversationsController.js";
import { conversationSchema, updateConversationSchema } from "./conversationsSchema.js";
import endPoints from "../../middleware/endPoints.js";

const router = express.Router();

router.get("/getAllConversations", asyncHandler(getAllConversations)); // auth(endPoints.admin),
router.get("/getConversationsByUserId/:id", asyncHandler(getConversationsByUserId)); // auth(endPoints.admin),
router.get("/getConversationById/:id", asyncHandler(getConversationById)); // auth(endPoints.admin),
router.post("/addConversation", validation(conversationSchema), asyncHandler(addConversation)); // auth(endPoints.allUsers),
router.put("/updateConversation/:id", validation(updateConversationSchema), validateParams(), asyncHandler(updateConversation)); // auth(endPoints.allUsers),
router.delete("/deleteConversation/:id", validateParams(), asyncHandler(deleteConversation)); // auth(endPoints.allUsers),

export default router;