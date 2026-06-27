import Joi from "joi";

export const COMMUNITY_NAME_MAX_LENGTH = 100;
export const COMMUNITY_DESC_MAX_LENGTH = 1000;

const communityEditableFields = {
  communityName: Joi.string().trim().min(2).max(COMMUNITY_NAME_MAX_LENGTH),
  communityDesc: Joi.string().trim().min(5).max(COMMUNITY_DESC_MAX_LENGTH),
};

export const communitySchema = Joi.object({
  communityName: communityEditableFields.communityName.required(),
  communityDesc: communityEditableFields.communityDesc.required(),
})
  .unknown(false)
  .required();

export const updateCommunitySchema = Joi.object(communityEditableFields)
  .or("communityName", "communityDesc")
  .unknown(false)
  .required();
