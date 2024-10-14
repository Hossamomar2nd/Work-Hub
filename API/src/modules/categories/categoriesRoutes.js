
import express from "express";
import { validation } from "../../middleware/val.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "./categoriesController.js";
import { addCategorySchema } from "./categoriesSchema.js";
import endPoints from "../../middleware/endPoints.js";
import auth from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get("/getAllCategories", asyncHandler(getAllCategories)); //auth(endPoints.admin),
router.post("/addCategory", validation(addCategorySchema), asyncHandler(addCategory));// auth(endPoints.admin),
router.put("/updateCategory/:id", asyncHandler(updateCategory));// auth(endPoints.admin),
router.delete("/deleteCategory/:id", asyncHandler(deleteCategory));// auth(endPoints.admin),


export default router;