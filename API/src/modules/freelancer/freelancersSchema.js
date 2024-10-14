
import Joi from "joi";

export const updateInfoSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    image_url: Joi.string(),
    phoneNumber: Joi.string().regex(/^\d{11}$/).message('Invalid phone number. Must be 11 digits.'),
    country: Joi.string(),
    desc: Joi.string()
});