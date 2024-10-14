import mongoose from "mongoose";
import chatbotConversation from "../../../DB/models/chatbotConversation_model.js";

// Add A Conversation
export const addConversation = async (req, res) => {
    try {
        const userId = req.params.id;
        const role = req.params.role;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ msg: "Invalid Id" });
        }

        const conversationData = await chatbotConversation.find({ senderId: userId });

        if(!conversationData[0]) {
            const newConversation = new chatbotConversation({
                senderId : userId,
                senderRole : role
            });
    
            const data = await newConversation.save();

            return res.status(200).json({ msg: "Conversation created successfully", data });
        }

        return res.status(400).json({ msg: "Conversation already exists", conversationData});
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: "Server Error" });
    }
};