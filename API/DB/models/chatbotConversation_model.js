import mongoose from "mongoose";
const { Schema } = mongoose;

const chatbotConversation = new Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        required: false,
    },
    senderRole: {
        type: String,
        required: true,
    }
},{
    timestamps: true
});

export default mongoose.model("chatbotConversation", chatbotConversation);