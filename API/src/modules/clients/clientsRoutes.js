
import express from "express";
import auth from '../../middleware/auth.middleware.js'
import valMiddleware from '../../middleware/val.middleware.js'
import { getClientById, updateClientInfo, updateClientPassword } from './clientsController.js'
import endPoints from "../../middleware/endPoints.js";
import { updatePasswordSchema } from '../validation/validation.js'
import { validateParams } from "../../middleware/val.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { deleteClient, getAllClients } from "./clientsController.js";
import { updateInfoSchema } from "./clientsSchema.js";
import { upload } from "../../middleware/uploadImages.js";

const router = express.Router();

router.get("/getAllClients", asyncHandler(getAllClients)); // auth(endPoints.admin)
router.get("/getClientById/:id", asyncHandler(getClientById)); // auth(endPoints.admin)
router.put('/updateClientInfo/:id', validateParams(), valMiddleware(updateInfoSchema), upload.single('image'), updateClientInfo); // auth(endPoints.client)
router.put('/updateClientPassword/:id', validateParams(), valMiddleware(updatePasswordSchema), updateClientPassword); // auth(endPoints.client)
router.delete("/deleteClient/:id", validateParams(), asyncHandler(deleteClient));

export default router;