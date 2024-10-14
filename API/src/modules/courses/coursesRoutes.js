
import express from "express";
import auth from '../../middleware/auth.middleware.js'
import { validateParams, validation } from "../../middleware/val.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addCourse, deleteCourse, enrollCourse, getAllCourses, getCourseById, getCoursesByCategoryId, getEnrolledCourses, unenrollCourse, updateCourse, uploadCourseCoverImage, uploadProffImage } from "./coursesController.js";
import { CoursesSchema, updateCoursesSchema } from "./coursesSchema.js";
import { upload } from "../../middleware/uploadImages.js";

const router = express.Router();

router.get("/getAllCourses", asyncHandler(getAllCourses)); // auth(endPoints.allUsers),
router.get("/getCourseById/:id", asyncHandler(getCourseById)); // auth(endPoints.allUsers),
router.get("/getCoursesByCategoryId/:id", asyncHandler(getCoursesByCategoryId)); // auth(endPoints.allUsers),
router.get("/getEnrolledCourses/:userId/:role", asyncHandler(getEnrolledCourses)); // auth(endPoints.allUsers),
router.post("/addCourse", validation(CoursesSchema), asyncHandler(addCourse)); // auth(endPoints.admin),
router.put("/enrollCourse/:courseId/:userId/:role", asyncHandler(enrollCourse));
router.put("/unenrollCourse/:courseId/:userId/:role", asyncHandler(unenrollCourse));
router.put("/updateCourses/:id", validation(updateCoursesSchema), validateParams(), asyncHandler(updateCourse));
router.put("/uploadCourseCoverImage/:id", upload.single('coverImage'), asyncHandler(uploadCourseCoverImage));
router.put("/uploadProffImage/:id", upload.single('image'), asyncHandler(uploadProffImage));
router.delete("/deleteCourses/:id", validateParams(), asyncHandler(deleteCourse));

export default router;