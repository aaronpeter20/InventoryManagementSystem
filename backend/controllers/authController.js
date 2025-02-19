import User from "../models/User.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login request received:", { email, password }); // Log the request

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found:", email); // Log if user is not found
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email); // Log if password is invalid
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" }), // Send token in response
    });
  } catch (error) {
    console.error("Error during login:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
};

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" }), 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user. Please try again." });
  }
};