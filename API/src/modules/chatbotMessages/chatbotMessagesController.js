import mongoose from "mongoose";
import chatbotConversation_model from "../../../DB/models/chatbotConversation_model.js";
import chatbotMessages_model from "../../../DB/models/chatbotMessages_model.js";


// Get A Conversation By User ID
export const getMessagesByConversationId = async (req, res) => {
    try {
        const conversationId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(401).json({ msg: "Invalid ID" });
        }

        let conversationData = await chatbotConversation_model.findById(conversationId);

        if(conversationData) {
            let messagesData = await chatbotMessages_model.find({conversationId: conversationId});

            return res.status(200).json({ messagesData });
        }

        return res.status(404).json({ msg: "Conversation not found" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Add user Message
export const addMessage = async (req, res) => {
    try {
        const conversationId = req.body.conversationId;
        const senderType = req.body.senderType;
        const message = req.body.message;

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(401).json({ msg: "Invalid ID" });
        }
        
        let conversationData = await chatbotConversation_model.findById(conversationId);

        if(!conversationData) {
            return res.status(404).json({ msg:"No Conversation Found" });
        }

        const newMessage = new chatbotMessages_model({
            conversationId : conversationId,
            senderType : senderType,
            senderMessage: message
        });

        await newMessage.save();

        res.status(200).json({ msg:"Message added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Internal Server Error" });
    }
}