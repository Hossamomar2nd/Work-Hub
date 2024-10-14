
import Joi from "joi";

export const communitySchema = Joi.object({
    communityName: Joi.string().required(),
    communityDesc: Joi.string().required(),
    communityPosts: Joi.string(),
    clientMemberIds: Joi.string(),
    freelancerMemberIds: Joi.string(),
    membersCount: Joi.number(),
});


export const updateCommunitySchema = Joi.object({
    communityName: Joi.string(),
    communityCategory: Joi.string(),
    communityPosts: Joi.string(),
    clientMemberIds: Joi.string(),
    freelancerMemberIds: Joi.string(),
    membersCount: Joi.number(),
});