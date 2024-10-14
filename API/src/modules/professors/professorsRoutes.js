
import express from "express";
import auth from '../../middleware/auth.middleware.js'
import { validateParams, validation } from "../../middleware/val.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addProfessor, deleteProfessors, getAllProfessors, updateProfessor } from "./professorsController.js";
import { addProfessorsSchema, updateProfessorsSchema } from "./professorsSchema.js";
import endPoints from "../../middleware/endPoints.js";

const router = express.Router();

router.get("/getAllProfessors", auth(endPoints.admin), asyncHandler(getAllProfessors));
router.post("/addProfessor", validation(addProfessorsSchema), auth(endPoints.admin), asyncHandler(addProfessor));
router.put("/updateProfessor/:id", validation(updateProfessorsSchema), validateParams(), auth(endPoints.admin), asyncHandler(updateProfessor));
router.delete("/deleteProfessor/:id", validateParams(), auth(endPoints.admin), asyncHandler(deleteProfessors));

export default router;