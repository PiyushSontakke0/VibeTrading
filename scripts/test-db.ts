import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
    try {
        console.log("MONGODB_URI =", process.env.MONGODB_URI);
        console.log("MONGODB_NAME =", process.env.MONGODB_NAME);

        await mongoose.connect(process.env.MONGODB_URI as string, {
            dbName: process.env.MONGODB_NAME,
        });

        console.log("OK: Database connection succeeded");
        process.exit(0);
    } catch (err) {
        console.error("ERROR: Database connection failed");
        console.error(err);
        process.exit(1);
    }
}

main();
