
import Joi from "joi";

export const clientSchema = Joi.object({
    clientName: Joi.string().required(),
    clientEmail: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    clientPassword: Joi.string().min(8).max(20).pattern(new RegExp("^(?=.?[A-Z])(?=.?[a-z])(?=.*?[0-9]).{8,}$")).required(),
    clientConfirmPassword: Joi.string().min(8).max(20).pattern(new RegExp("^(?=.?[A-Z])(?=.?[a-z])(?=.*?[0-9]).{8,}$")).required(),
    clientImage_url: Joi.string().required(),
    clientDesc: Joi.string().max(100).required(),
    clientCountry: Joi.string().required(),
    clientLastLogin: Joi.string().isoDate()
});

export const updateClientSchema = Joi.object({
    clientName: Joi.string(),
    clientEmail: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    clientPassword: Joi.string().min(8).max(20).pattern(new RegExp("^(?=.?[A-Z])(?=.?[a-z])(?=.*?[0-9]).{8,}$")),
    clientNewPassword: Joi.string().min(8).max(20).pattern(new RegExp("^(?=.?[A-Z])(?=.?[a-z])(?=.*?[0-9]).{8,}$")),
    clientConfirmNewPassword: Joi.string().min(8).max(20).pattern(new RegExp("^(?=.?[A-Z])(?=.?[a-z])(?=.*?[0-9]).{8,}$")),
    clientImage_url: Joi.string(),
    clientDesc: Joi.string().max(100),
    clientCountry: Joi.string(),
    clientLastLogin: Joi.string().isoDate()
});

export const updateInfoSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    image_url: Joi.string(),
});

