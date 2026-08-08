const express = require("express");
const router = express.Router();
const {
  logActivity,
} = require("../logger");

const Member = require("../models/Member");

// ==========================================
// GET MEMBERS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({
      createdAt: -1,
    });

    res.json(members);

  } catch (error) {
    console.error("GET MEMBERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch members",
      error: error.message,
    });
  }
});

// ==========================================
// GET MEMBER
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(
      req.params.id
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json(member);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch member",
      error: error.message,
    });
  }
});

// ==========================================
// CREATE MEMBER
// ==========================================

router.post("/", async (req, res) => {
  try {
    console.log("MEMBER DATA RECEIVED:");
    console.log(req.body);

    const {
      name,
      email,
      phone,
      address,
      membershipType,
      status,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message:
          "Name, email and phone are required",
      });
    }

    const existingMember =
      await Member.findOne({
        email: email.toLowerCase(),
      });

    if (existingMember) {
      return res.status(400).json({
        message:
          "A member with this email already exists",
      });
    }

    const member = new Member({
      name,
      email,
      phone,
      address: address || "",
      membershipType:
        membershipType || "Regular",
      status: status || "Active",
    });

    const savedMember = await member.save();
    logActivity(
  "MEMBER ADDED",
  `${savedMember.name} (${savedMember.email})`
);

    console.log("MEMBER CREATED:");
    console.log(savedMember);

    res.status(201).json(savedMember);

  } catch (error) {
    console.error(
      "CREATE MEMBER ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to create member",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE MEMBER
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const member =
      await Member.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json(member);

  } catch (error) {
    console.error(
      "UPDATE MEMBER ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to update member",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE MEMBER
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const member =
      await Member.findByIdAndDelete(
        req.params.id
      );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json({
      message: "Member deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE MEMBER ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to delete member",
      error: error.message,
    });
  }
});

module.exports = router;