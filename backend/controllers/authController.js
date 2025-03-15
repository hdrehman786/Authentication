import User from "../models/model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { sendMail, sendOtpMail, sendPassOtpMail } from "./mailer.js";
import validator from 'validator';


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });


    sendMail(email, name);

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      msg: "User created successfully",
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // For local development
      sameSite: 'lax', // Better for local testing; use 'none' with secure: true in production
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    // Debugging
    console.log('Setting cookie with token:', token);

    res.status(200).json({
      msg: "Login successful",
      user: {  // Removed token from response since we're using cookies
        name: user.name,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    res.status(200).json({ msg: "Logout successful" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};


export const isAuthenticated = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "Not authorized, token missing" });
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedToken;
    res.status(200).json({ msg: "User is authenticated" });
    } catch (err) {
      console.error(err);
      return res.status(401).json({ msg: "Token is not valid" });
    }
}


export const sentVerfyOtp = async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.isActive) {
      return res.status(400).json({ msg: "User is already active" });
    }

    if (user.verifyOtpExpireAt && Date.now() < user.verifyOtpExpireAt) {
      return res.status(400).json({ msg: "OTP already sent. Please wait until it expires." });
    }

    const otp = String(Math.floor(1000 + Math.random() * 9000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 60 * 60 * 1000;
    await user.save();

    sendOtpMail(user.email, otp); // Assuming sentOtpMail is defined elsewhere
    res.status(200).json({ msg: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const userId = req.body.userId;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (otp === user.verifyOtp) {
      user.isActive = true;
      user.verifyOtp = '';
      user.verifyOtpExpireAt = '';
      user.updated_at = Date.now();
      await user.save();
      res.status(200).json({ msg: "User verified successfully" });
    } else {
      res.status(400).json({ msg: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}


export const resetOtp = async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ msg: "User  not found" });
    }

    user.verifyOtp = '';
    user.verifyOtpExpireAt = '';

    const otp = String(Math.floor(1000 + Math.random() * 9000));
    user.resetOtp = otp;
    user.resetExpireAt = Date.now() + 60 * 60 * 1000;
    user.updated_at = Date.now();

    await sendOtpMail(user.email, otp);
    await user.save();

    res.status(200).json({ msg: 'OTP reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};




export const verifyResetOtp = async (req, res) => {
  const { otp } = req.body;
  const userId = req.body.userId;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (otp === user.resetOtp) {
      user.isActive = true;
      user.resetOtp = '';
      user.resetExpireAt = '';
      user.updated_at = Date.now();
      await user.save();
      res.status(200).json({ msg: "User verified successfully" });
    } else {
      res.status(400).json({ msg: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}


export const sendpassresetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ msg: "Please enter a valid email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User  not found" });
    }

    const otp = String(Math.floor(1000 + Math.random() * 9000));
    user.resetOtp = otp;
    user.resetExpireAt = Date.now() + 60 * 60 * 1000; // 1 hour
    user.updated_at = Date.now();
    await user.save();

    // Send OTP email
    try {
      await sendPassOtpMail(user.email, otp);
    } catch (mailError) {
      console.error(mailError);
      return res.status(500).json({ msg: 'Failed to send OTP' });
    }

    res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ msg: 'Server error' });
  }
};




export const resetPassword = async (req, res) => {
  const { email, newPassword, otp } = req.body;

  try {
    // Validate input
    if (!email || !newPassword || !otp) {
      return res.status(400).json({ msg: "Please provide userId, new password, and OTP" });
    }

    // Find the user by userId
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User  not found" });
    }

    // Check if the OTP is valid and not expired
    if (user.resetOtp !== otp || Date.now() > user.resetExpireAt) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.resetOtp = ''; // Clear the OTP
    user.resetExpireAt = ''; // Clear the expiration time
    user.updated_at = Date.now(); // Update the timestamp
    await user.save();

    res.status(200).json({ msg: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

