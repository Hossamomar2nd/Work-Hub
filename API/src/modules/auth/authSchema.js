import Joi from "joi";

const passwordSchema = Joi.string()
  .min(8)
  .max(20)
  .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
  .required();

const stringArrayInput = Joi.alternatives().try(
  Joi.array().items(Joi.string().trim().min(1)),
  Joi.string().trim().allow(""),
);

export const sigupSchema = Joi.object({
  role: Joi.string().valid("client", "freelancer").required(),
  name: Joi.string().trim().min(2).required(),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required(),
  password: passwordSchema,
  country: Joi.string().trim().min(2).required(),
  desc: Joi.string().trim().allow("").optional(),
  phoneNumber: Joi.when("role", {
    is: "freelancer",
    then: Joi.string().trim().min(11).max(20).required(),
    otherwise: Joi.string().trim().min(11).max(20).optional(),
  }),
  skills: Joi.when("role", {
    is: "freelancer",
    then: stringArrayInput.optional(),
    otherwise: stringArrayInput.optional(),
  }),
  languages: Joi.when("role", {
    is: "freelancer",
    then: stringArrayInput.optional(),
    otherwise: stringArrayInput.optional(),
  }),
  specialization: Joi.when("role", {
    is: "freelancer",
    then: Joi.string().trim().min(2).required(),
    otherwise: Joi.string().trim().min(2).optional(),
  }),
  image_url: Joi.string().trim().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
});
