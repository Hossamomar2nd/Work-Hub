
import mongoose from "mongoose";
const { Schema } = mongoose;

const serviceSchema = new Schema({
    serviceTitle: {
        type: String,
        unique: true,
        required: true
    },
    serviceDesc: {
        type: String,
        required: true
    },
    servicePrice: {
        type: Number,
        required: true
    },
    serviceCover_url: {
        type: String,
    },
    serviceImages_url: {
        type: [String],
    },
    serviceShortTitle: {
        type: String,
        required: true
    },
    serviceShortDesc: {
        type: String,
        required: true
    },
    freelancerId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "freelancer"
    },
    serviceCategoryId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "category"
    },
    deliveryTime: {
        type: Number,
        required: true
    },
    features: {
        type: [String],
        required: true
    },
    orders: {
        type: [mongoose.Types.ObjectId],
        ref: "order"
    },
    revisionNumber: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    },
    reviews: {
        type: [mongoose.Types.ObjectId],
        ref: "review"
    },
    totalRating: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
});


export default mongoose.model("service", serviceSchema);