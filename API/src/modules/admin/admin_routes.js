
import express from "express";
import valMiddleware, { validateParams } from '../../middleware/val.middleware.js';
import { loginSchema, sigupSchema, updatePasswordSchema } from '../validation/validation.js';
import { addAdmin, deleteAdmin, getAllAdmins, updateAdminInfo, updateAdminPassword, uploadAdminImage } from './adminController.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import { updateInfoSchema } from "./adminSchema.js";
import auth from "../../middleware/auth.middleware.js";
import endPoints from "../../middleware/endPoints.js";
import { upload } from "../../middleware/uploadImages.js";

const router = express.Router();

router.get('/getAllAdmins', getAllAdmins); // auth(endPoints.admin)
router.post('/addAdmin', valMiddleware(sigupSchema), addAdmin);
router.put("/uploadAdminImage/:id", upload.single('image'), asyncHandler(uploadAdminImage)); // auth(endPoints.admin)
router.put("/updateAdminInfo/:id", validateParams(), valMiddleware(updateInfoSchema), asyncHandler(updateAdminInfo)); // auth(endPoints.admin)
router.put("/updateAdminPassword/:id", validateParams(), valMiddleware(updatePasswordSchema), asyncHandler(updateAdminPassword)); // auth(endPoints.admin)
router.delete("/deleteAdmin/:id", validateParams(), asyncHandler(deleteAdmin)); // auth(endPoints.admin)

export default router;