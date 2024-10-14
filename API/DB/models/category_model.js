
import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema ({
    categoryName: {
        type: String,
        required: true
    },
    categoryDesc: {
        type: String,
        required: true,
    }
},{
    timestamps: true
});

export default mongoose.model("category", categorySchema);