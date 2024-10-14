
import conversationModel from "../../../DB/models/conversation_model.js";
import messageModel from "../../../DB/models/message_model.js";
import freelancerModel from "../../../DB/models/freelancer_model.js";
import clientModel from "../../../DB/models/client_model.js";

// Get All Messages
export const getAllMessages = async (req, res) => {
    try {
        const allMessages = await messageModel.find().populate("conversation");
        
        if(allMessages.length !== 0) {
            return res.status(200).json(allMessages);
        }
        res.status(200).json({ msg:"No messages found!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Somthing went wrong!" });
    }
}

// Get Messages By Conversation ID
export const getMessagesByConversationId = async (req, res) => {
    try {
        const conversationId = req.params.id
        const messages = await messageModel.find({conversation: conversationId});

        if(messages.length !== 0) {
            return res.status(200).json(messages);
        }
        
        res.status(200).json({ msg:"No messages found!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Somthing went wrong!" });
    }
}

// Add Message
export const addMessage = async (req, res) => {
    try {
        const conversationId = req.body.conversation;

        let conversationData = await conversationModel.findById(conversationId);

        if(conversationData) {
            const senderId = req.body.senderId;
            let senderData;

            switch(req.body.senderType) {
                case "freelancer":
                    senderData = await freelancerModel.findById(senderId);
                  break;
                case "client":
                    senderData = await clientModel.findById(senderId);
                  break;
                default:
                    return res.status(400).json({ msg:"invalid role!" });
            }

            if(senderData) {
                senderData = await messageModel.find({ senderId: senderId });

                const date = new Date();
                const time = date.getTime();
                
                const newMessage = new messageModel({
                    conversation : conversationId,
                    senderId : req.body.senderId,
                    senderType : req.body.senderType,
                    messageContent : req.body.messageContent,
                    creationDate: time
                });
        
                await newMessage.save();
        
                const filter = { _id: conversationId };
                const update = {
                    $set: { lastMessage: newMessage._id },
                };

                await conversationModel.updateOne(filter, update);

                return res.status(200).json({ msg:"Message has been created successfuly."});
            }
            res.status(400).json({ msg:"Invalid Sender ID" });
        }
        res.status(400).json({ msg:"Invalid Conversation ID" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Somthing went wrong!");
    }
}

// Update Message Status
export const updateMessageStatus = async (req, res) => {
    try {
        const messageId = req.params.id;
        const messageToUpdate = await messageModel.findById(messageId);

        if(messageToUpdate) {
            const filter = { _id: messageId };
            const update = { $set: { messageStatus: "seen" } };
            await messageModel.updateOne(filter, update);
            return res.status(200).json({ msg:"Message has been updated successfuly." });
        }

        res.status(400).json({ msg:"There is no message with such id to update." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Somthing went wrong!" });
    }
}

export const updateMessagesStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const role = req.params.role;

        const messageToUpdate = await messageModel.find({senderId: userId, senderType: role});

        if(messageToUpdate) {
            const filter = { senderId: userId, senderType: role };
            const update = { $set: { messageStatus: "seen" } };
            await messageModel.updateMany(filter, update);
            return res.status(200).json({ msg:"Messages has been updated successfuly." });
        }

        res.status(404).json({ msg:"No messages found!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Somthing went wrong!" });
    }
}

// Update Message
export const updateMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const messageToUpdate = await messageModel.findById(messageId);

        if(messageToUpdate) {
            const filter = { _id: messageId };
            const update = { $set: { messageContent: req.body.messageContent } };
            await messageModel.updateOne(filter, update);
            return res.status(200).send("Message has been updated successfuly.");
        }

        res.status(200).send("There is no message with such id to update.");
    } catch (error) {
        console.log(error);
        res.status(500).send("Somthing went wrong!");
    }
}

// Delete Message
export const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id
        const messageToDelete = await messageModel.findById(messageId);

        if(messageToDelete){

            const filter = { _id: messageId };

            await messageModel.deleteOne(filter);
            res.status(200).send("Message has been deleted successfuly.");
        }
        else {
            res.status(200).send("Message deletion failed.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Somthing went wrong!");
    }
}