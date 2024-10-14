import express from "express";
import auth from '../../middleware/auth.middleware.js'
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addMessage, getMessagesByConversationId } from "./chatbotMessagesController.js";

const router = express.Router();

router.get("/getMessagesByConversationId/:id", asyncHandler(getMessagesByConversationId)); // auth(endPoints.admin),
router.post("/addMessage", asyncHandler(addMessage)); // auth(endPoints.allUsers),

export default router;