import Joi from "joi";

const objectIdPattern = /^[a-f\d]{24}$/i;

export const CAPTION_MAX_LENGTH = 1000;
export const COMMENT_MAX_LENGTH = 1000;

const objectId = Joi.string().trim().pattern(objectIdPattern).messages({
  "string.pattern.base": "{#label} must be a valid ObjectId",
});

const caption = Joi.string().trim().min(1).max(CAPTION_MAX_LENGTH).messages({
  "string.empty": "caption is required",
  "string.min": "caption is required",
  "string.max": `caption must be at most ${CAPTION_MAX_LENGTH} characters`,
});

export const postSchema = Joi.object({
  communityId: objectId.required(),
  caption: caption.required(),
});

export const updatePostSchema = Joi.object({
  caption: caption.optional(),
}).min(1);

export const commentSchema = Joi.object({
  comment: Joi.string()
    .trim()
    .min(1)
    .max(COMMENT_MAX_LENGTH)
    .required()
    .messages({
      "string.empty": "comment is required",
      "string.min": "comment is required",
      "string.max": `comment must be at most ${COMMENT_MAX_LENGTH} characters`,
    }),
});
