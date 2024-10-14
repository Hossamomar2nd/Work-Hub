import mongoose from "mongoose";
const { Schema } = mongoose;

const chatbotMessage = new Schema({
    conversationId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    senderType: {
        type: String,
        required: true,
    },
    senderMessage: {
        type: String,
        required: true,
    }
},{
    timestamps: true
});

export default mongoose.model("chatbotMessage", chatbotMessage);