
import Joi from "joi";

export const addCategorySchema = Joi.object({
    categoryName: Joi.string().required(),
    categoryDesc: Joi.string().max(50).required(),
});

export const paramsSchema = Joi.object({
    id: Joi.string().required(),
});