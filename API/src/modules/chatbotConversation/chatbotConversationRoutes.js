import express from "express";
import auth from '../../middleware/auth.middleware.js'
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addConversation } from "./chatbotConversationController.js";

const router = express.Router();

router.post("/addConversation/:id/:role", asyncHandler(addConversation)); // auth(endPoints.allUsers),

export default router;