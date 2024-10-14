
import Joi from "joi";

export const addMessageSchema = Joi.object({
    conversation: Joi.string().required(),
    senderId: Joi.string().required(),
    senderType: Joi.string().required(),
    messageContent: Joi.string().required()
});

export const paramsSchema = Joi.object({
    id: Joi.string().required(),
});