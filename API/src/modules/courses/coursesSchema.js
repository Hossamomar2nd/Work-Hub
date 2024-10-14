import Joi from "joi";

export const CoursesSchema = Joi.object({
    categoryId: Joi.string().required(),
    courseTitle: Joi.string().required(),
    courseDesc: Joi.string().required(),
    courseDuration: Joi.string().required(),
    proffName: Joi.string().required(),
    ProffDesc: Joi.string().required(),
    courseLink: Joi.string().required(),
    aboutCourse: Joi.string().required()
});


export const updateCoursesSchema = Joi.object({
    courseTitle: Joi.string(),
    courseDesc: Joi.string(),
    courseDuration: Joi.string()
});

