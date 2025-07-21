import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
// const User = require("../models/User");
import User from "../models/User.js";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";

const signup = async (req, res, next) => {
  // const email_ent = await User.findOne({email});

  try {
    const { firstName, lastName, email, role , password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(404).json({ message: "All fields are required" });
    }

    let email_ent = await User.findOne({ email });

    if (email_ent) {
      return res.status(400).json({
        status: false,
        message: "Email already exists, please login",
      });
    }

    const hashedpassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      role,
      password: hashedpassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.SECRETKEY,
      { expiresIn: "3d" }
    );

    // Set the token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access for security
      secure: false, // Use true in production (HTTPS required)
      sameSite: "None", // Prevent CSRF attacks
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in ms
    });

    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    console.error(`Failed to create user : ${err}`);
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(req.body);
    if (!user) {
      return res.status(400).json({ emailMessage: "User not found" });
    }

    const checkpassword = await bcryptjs.compare(password, user.password);

    if (!checkpassword) {
      return res.status(400).json({ passwordMessage: "Incorrect password" });
    }

    console.log("Password Match: ", checkpassword);
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRETKEY,
      { expiresIn: "3d" }
    );

    // Set the token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access for security
      secure: process.env.NODE_ENV === "production", // Use true in production (HTTPS required)
      // secure: true, // Use true in production (HTTPS required)
      sameSite: "None", // Prevent CSRF attacks
      // sameSite: "strict", // Prevent CSRF attacks
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in ms
    });

    res.json({ message: "Login successful!" });
  } catch (err) {
    console.log(`Error while trying to login : ${err}`);
    next(err);
  }
};


const forgot_password = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.SECRETKEY, {
      expiresIn: "15m",
    });

    // Send email with reset link (example using nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email service provider
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    const mailOptions = {
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. The link expires in 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset link." });
    next(error);
  }
};

const reset_password = async (req, res, next) => {
  const { token } = req.params; // Get token from URL
  const { password } = req.body; // Get password from request body
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const user = await User.findById(decoded.id); //maybe _id
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcryptjs.hash(password, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    path: "/",
  });
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
    expires: new Date(0), // Expire immediately
  });

  res.json({ message: "Logged out successfully" });
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Assuming you have the user ID from the token
    console.log("User ID:", userId); // Debugging

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    console.log("Password Match: ", isMatch); // Debugging
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password" });
    next(error);
  }
};

export { signup, signin, forgot_password, reset_password, logout, changePassword };
