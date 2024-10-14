
import Joi from "joi";

export const addProfessorsSchema = Joi.object({
    proffName: Joi.string().required(),
    proffTitle: Joi.string().required(),
    proffImage_url: Joi.string(),
    ProffDesc: Joi.string()
});


export const updateProfessorsSchema = Joi.object({
    proffName: Joi.string(),
    proffTitle: Joi.string(),
    proffImage_url: Joi.string(),
    ProffDesc: Joi.string()
});

