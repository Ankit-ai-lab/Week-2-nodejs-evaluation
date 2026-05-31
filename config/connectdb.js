import mongoose from "mongoose";
import dotenv from "dotenv";

function connectDB() {
try {    dotenv.config();
    const MONGO_URI = process.env.MONGO_URI;
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");  
} catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); 

}
}

export default connectDB;