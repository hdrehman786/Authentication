import User from "../models/model.js";
import jwt from "jsonwebtoken";

export const getUserData = async (req, res) => {
  try {
 
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ msg: "No authentication token provided" });
    }

  
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ msg: "Invalid or expired token" });
    }

   
    const userId = decoded.userId;

 
    const user = await User.findById(userId).select('-password -resetOtp -verifyOtp -resetExpireAt -verifyOtpExpireAt');
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    
    // if (!user.isActive) {
    //   return res.status(403).json({ msg: "Account not verified. Please verify your account" });
    // }

  
    res.status(200).json({
      msg: "User data retrieved successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.created_at || user.createdAt, // Match your schema
        updatedAt: user.updated_at || user.updatedAt  // Match your schema
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};