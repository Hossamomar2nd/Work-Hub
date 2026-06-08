import express from "express";
import valMiddleware, {
  validateParams,
} from "../../middleware/val.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import auth from "../../middleware/auth.middleware.js";
import endPoints from "../../middleware/endPoints.js";
import login, { logout, signup } from "./authController.js";
import { loginSchema, signupSchema } from "./authSchema.js";
import { upload } from "../../middleware/uploadImages.js";

const router = express.Router();

router.post(
  "/signup/:role",
  upload.single("image"),
  valMiddleware(signupSchema, {
    includeParams: true,
    assignValidatedData: true,
  }),
  asyncHandler(signup),
);
router.post(
  "/login",
  valMiddleware(loginSchema, { assignValidatedData: true }),
  asyncHandler(login),
);
router.put(
  "/logout/:id",
  auth(endPoints.allUsers),
  validateParams(),
  asyncHandler(logout),
);
// router.put('/uploadImage/:id/:role', upload.single('image'), uploadImage);

export default router;
