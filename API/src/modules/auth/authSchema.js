import Joi from "joi";

export const sigupSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(8).max(20).pattern(new RegExp("^(?=.?[A-Z])(?=.?[a-z])(?=.*?[0-9]).{8,}$")),
    country: Joi.string(),
    desc: Joi.string(),
    phoneNumber: Joi.string().min(11).max(20),
    image_url: Joi.string(),
});


export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(8).max(20).pattern(new RegExp("^(?=.?[A-Z])(?=.?[a-z])(?=.*?[0-9]).{8,}$")),
});