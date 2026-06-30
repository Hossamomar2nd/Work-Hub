import express from "express";
import valMiddleware, {
  validateParams,
} from "../../middleware/val.middleware.js";
import {
  sigupSchema,
  updatePasswordSchema,
} from "../validation/validation.js";
import {
  addAdmin,
  deleteAdmin,
  getAllAdmins,
  updateAdminInfo,
  updateAdminPassword,
  uploadAdminImage,
} from "./adminController.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { updateInfoSchema } from "./adminSchema.js";
import auth from "../../middleware/auth.middleware.js";
import endPoints from "../../middleware/endPoints.js";
import { upload } from "../../middleware/uploadImages.js";

const router = express.Router();

router.get(
  "/getAllAdmins",
  auth(endPoints.admin),
  asyncHandler(getAllAdmins),
);
router.post(
  "/addAdmin",
  auth(endPoints.admin),
  valMiddleware(sigupSchema),
  asyncHandler(addAdmin),
);
router.put(
  "/uploadAdminImage/:id",
  validateParams(),
  auth(endPoints.admin),
  upload.single("image"),
  asyncHandler(uploadAdminImage),
);
router.put(
  "/updateAdminInfo/:id",
  validateParams(),
  auth(endPoints.admin),
  valMiddleware(updateInfoSchema),
  asyncHandler(updateAdminInfo),
);
router.put(
  "/updateAdminPassword/:id",
  validateParams(),
  auth(endPoints.admin),
  valMiddleware(updatePasswordSchema),
  asyncHandler(updateAdminPassword),
);
router.delete(
  "/deleteAdmin/:id",
  validateParams(),
  auth(endPoints.admin),
  asyncHandler(deleteAdmin),
);

export default router;
