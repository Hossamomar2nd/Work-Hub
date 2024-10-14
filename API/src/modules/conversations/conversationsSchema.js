
import Joi from "joi";

export const conversationSchema = Joi.object({
    freelancer: Joi.string().required(),
    client: Joi.string().required(),
    readByFreelancer: Joi.boolean(),
    readByClient: Joi.boolean(),
    lastMessage: Joi.string()
});

export const updateConversationSchema = Joi.object({
    freelancer: Joi.string(),
    client: Joi.string(),
    readByFreelancer: Joi.boolean(),
    readByClient: Joi.boolean(),
    lastMessage: Joi.string()
});