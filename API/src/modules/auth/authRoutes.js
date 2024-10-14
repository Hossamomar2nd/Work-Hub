
import express from "express";
import valMiddleware, { validateParams } from '../../middleware/val.middleware.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import auth from "../../middleware/auth.middleware.js";
import endPoints from "../../middleware/endPoints.js";
import login, { logout, signup} from "./authController.js";
import { loginSchema, sigupSchema } from "./authSchema.js";
import { upload } from "../../middleware/uploadImages.js";

const router = express.Router();

router.post('/signup/:role', valMiddleware(sigupSchema), upload.single('image'), signup);
router.post('/login', valMiddleware(loginSchema), login);
router.put("/logout/:id", validateParams(), asyncHandler(logout)); // auth(endPoints.admin)
// router.put('/uploadImage/:id/:role', upload.single('image'), uploadImage);

export default router;