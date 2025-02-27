import mongoose from "mongoose";
import { Schema } from "mongoose";

const userModel = Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default:''},
    verifyOtpExpireAt: {type: Number, default:0},
    resetOtp: {type: String, default:''},
    isActive: {type: Boolean, default:false},
    resetExpireAt: {type: Number, default:0},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
})


const User = mongoose.model("users", userModel);

export default User;