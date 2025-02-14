import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    console.log("Received signup request:", { name, email, password, role }); 

    
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists:", email); 
      return res.status(400).json({ message: "User already exists" });
    }

    
    const user = await User.create({ name, email, password, role });
    console.log("User created successfully:", user); 
    
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error during signup:", error); 
    res.status(500).json({ message: "Failed to create user. Please try again." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Received login request:", { email, password });

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      console.log("User logged in successfully:", user); 

      generateToken(res, user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      console.log("Invalid email or password:", email); 
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error); 
    res.status(500).json({ message: "Server error" });
  }
};