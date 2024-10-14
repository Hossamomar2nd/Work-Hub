import mongoose from "mongoose";

export const DBconnection = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_URL);
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.log(error);
    }
}