import Joi from "joi";

const communityEditableFields = {
  communityName: Joi.string().trim().min(1),
  communityDesc: Joi.string().trim().min(1),
};

export const communitySchema = Joi.object({
  communityName: communityEditableFields.communityName.required(),
  communityDesc: communityEditableFields.communityDesc.required(),
}).required();

export const updateCommunitySchema = Joi.object(communityEditableFields)
  .or("communityName", "communityDesc")
  .required();
