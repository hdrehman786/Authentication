import mongoose from "mongoose";
import { config } from "dotenv";


const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB Connected...");
    }catch (e) {
        console.error(e);
        process.exit(1);
    }
}


export default connectDB;