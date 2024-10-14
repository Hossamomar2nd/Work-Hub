
import mongoose from "mongoose";
const { Schema } = mongoose;

const freelancerSchema = new Schema ({
    name: {
        type: String,
        required: true,
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
    },
    coverImage_url: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    desc: {
        type: String,
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
    languages: {
        type: [String],
        required: false
    },
    skills: {
        type: [String],
        required: false
    },
    servicesCount: {
        type: Number,
        required: false,
        default: 0
    },
    specialization: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'freelancer'
    },
    token: {
        type: String,
        required: false
    }
},{
    timestamps: true
});

export default mongoose.model("freelancer", freelancerSchema);