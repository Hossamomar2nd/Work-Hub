
import mongoose from "mongoose";
const { Schema } = mongoose;

const adminSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: false
    },
    activityStatus: {
        type: String,
        default: 'offline',
        required: false
    },
    lastLogin: {
        type: Date,
        required: false
    },
    role: {
        type: String,
        default: 'admin',
        required: false
    },
    token: {
        type: String,
        required: false
    }
},{
    timestamps: true
});

export default mongoose.model("admin", adminSchema);