console.log("C1 Loading jwt...");
const jwt = require("jsonwebtoken");

console.log("C2 Loading User model...");
const User = require("../models/User");

const { validationResult } = require("express-validator");

console.log("C3 Controller loaded");

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

// Register
exports.register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Invalid input",
      errors: errors.array(),
    });
  }

  console.log("Register endpoint hit");

  const { email, password } = req.body;

  try {
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await User.create({ email, password });

    const token = generateToken(user._id);

    res.status(201).json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// Login
exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Invalid input",
      errors: errors.array(),
    });
  }

  console.log("Login endpoint hit");

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
};