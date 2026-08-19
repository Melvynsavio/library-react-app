const express = require("express");
const User = require("../models/User");
const {
  cleanText,
  isValidEmail,
  isValidName,
  sendValidationError,
} = require("../utils/validation");

const router = express.Router();

// ==========================================
// GET ALL USERS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// ==========================================
// REGISTER
// ==========================================

router.post("/register", async (req, res) => {
  try {
    const body = req.body || {};
    const name = cleanText(body.name);
    const email = cleanText(body.email).toLowerCase();
    const password =
      typeof body.password === "string" ? body.password : "";
    const errors = {};

    if (!isValidName(name)) {
      errors.name = "Enter a valid name using letters, spaces, apostrophes, or hyphens";
    }
    if (!isValidEmail(email)) {
      errors.email = "Enter a valid email address";
    }
    if (password.length < 8 || password.length > 72) {
      errors.password = "Password must be between 8 and 72 characters";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must include a lowercase letter";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must include an uppercase letter";
    } else if (!/\d/.test(password)) {
      errors.password = "Password must include a number";
    }

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const user = new User({
      name,
      email,
      password,
      role: "User",
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        status: savedUser.status,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(400).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {
  try {
    const body = req.body || {};
    const email = cleanText(body.email).toLowerCase();
    const password =
      typeof body.password === "string" ? body.password : "";
    const errors = {};

    if (!isValidEmail(email)) {
      errors.email = "Enter a valid email address";
    }
    if (!password || password.length > 72) {
      errors.password = "Enter a valid password";
    }

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        message: "User account is inactive",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

module.exports = router;
