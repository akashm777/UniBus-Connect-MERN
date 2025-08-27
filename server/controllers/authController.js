import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || "unibus-secret-key";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register new user
// @route POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Normalize
    name = (name || "").toString().trim();
    email = (email || "").toString().trim().toLowerCase();
    password = (password || "").toString();

    // Validations
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      token,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = (email || "").toString().trim().toLowerCase();
    password = (password || "").toString();

    // Safety checks
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
