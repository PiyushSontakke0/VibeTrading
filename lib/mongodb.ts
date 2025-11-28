import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) return mongoose;
    await mongoose.connect(process.env.MONGODB_URI as string, {
        dbName: process.env.MONGODB_NAME,
    });
    return mongoose;
};
