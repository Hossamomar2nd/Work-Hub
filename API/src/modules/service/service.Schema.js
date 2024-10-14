import Joi from "joi";

export const createService = Joi.object({
    serviceTitle: Joi.string().required(),
    serviceDesc: Joi.string().required(),
    servicePrice: Joi.number().required(),
    serviceShortTitle: Joi.string().required(),
    serviceCategoryId: Joi.string().required(),
    deliveryTime: Joi.number().required(),
    freelancerId: Joi.string().required(),
    features: Joi.array().required(),
    serviceShortDesc: Joi.string().required(),
    revisionNumber: Joi.string().required(),
});

export const updateServiceSchema = Joi.object({
    serviceTitle: Joi.string(),
    serviceDesc: Joi.string(),
    servicePrice: Joi.number(),
    serviceShortTitle: Joi.string(),
    deliveryTime: Joi.date(),
    features: Joi.string(),
    sales: Joi.number(),
    totalRating: Joi.number()
});