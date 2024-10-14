
import express from "express";
import { validateParams, validation } from "../../middleware/val.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addOrder, deleteOrder, getAllOrders, getUserOrders, updateOrder, updateOrderStatus } from "./ordersController.js";
import { orderSchema } from "./ordersSchema.js";
import auth from '../../middleware/auth.middleware.js';
import endPoints from "../../middleware/endPoints.js";

const router = express.Router();

router.get("/getAllOrders", asyncHandler(getAllOrders)); //auth(endPoints.admin),
router.get("/getUserOrders/:role/:id", asyncHandler(getUserOrders)); //auth(endPoints.admin),
router.post("/addOrder", validation(orderSchema), asyncHandler(addOrder));
router.put("/updateOrder/:id", validateParams(), validation(orderSchema), asyncHandler(updateOrder));
router.put("/updateOrderStatus/:id", asyncHandler(updateOrderStatus));
router.delete("/deleteOrder/:id", validateParams(), asyncHandler(deleteOrder));


export default router;