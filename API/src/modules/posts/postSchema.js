import Joi from "joi";

export const postSchema = Joi.object({
  communityId: Joi.string().required(),
  caption: Joi.string().required(),
  posterId: Joi.any().optional(),
  posterType: Joi.any().optional(),
});
