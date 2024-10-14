
import mongoose from "mongoose";
const { Schema } = mongoose;

const communitySchema = new Schema ({
    communityName: {
        type: String,
        required: true
    },
    communityDesc: {
        type: String,
        required: true
    },
    communityPosts: {
        type: [mongoose.Types.ObjectId],
        required: false,
        ref: "post"
    },
    clientMembers: {
        type: [mongoose.Types.ObjectId],
        required: false,
        ref: "client"
    },
    freelancerMembers: {
        type: [mongoose.Types.ObjectId],
        required: false,
        ref: "freelancer"
    }
},{
    timestamps: true
});

export default mongoose.model("community", communitySchema);