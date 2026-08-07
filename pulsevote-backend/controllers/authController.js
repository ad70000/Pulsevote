console.log("C1 Loading jwt...");


console.log("C2 Loading User model...");

const User = require("../models/User");
const { validationResult } = require("express-validator");
const generateToken = require("../utils/generateToken");

console.log("C3 Controller loaded");

// ==========================
// Register User
// ==========================
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Invalid input",
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await User.create({
      email,
      password,
      roles: [{ organisationId: null, role: "user" }],
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

// ==========================
// Register Manager
// ==========================
exports.registerManager = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Invalid input",
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const managerUser = await User.create({
      email,
      password,
      roles: [{ organisationId: null, role: "manager" }],
    });

    const token = generateToken(managerUser);

    return res.status(201).json({
      message: "Manager registered successfully",
      token,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

// ==========================
// Register Admin
// ==========================
exports.registerAdmin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Invalid input",
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Check whether an admin already exists
    const adminExists = await User.exists({
      "roles.role": "admin",
    });

    // If an admin exists, only another admin may create one
    if (adminExists) {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const requestingUser = await User.findById(req.user.id);

      const isAdmin =
        requestingUser &&
        requestingUser.roles.some((r) => r.role === "admin");

      if (!isAdmin) {
        return res.status(403).json({
          message: "Only admins can create admins",
        });
      }
    }

    const adminUser = await User.create({
      email,
      password,
      roles: [{ organisationId: null, role: "admin" }],
    });

    const token = generateToken(adminUser);

    return res.status(201).json({
      message: "Admin registered successfully",
      token,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

// ==========================
// Login
// ==========================
exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Invalid input",
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Server error",
    });
  }
};