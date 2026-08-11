const express = require("express");
const mongoose = require("mongoose");
const Member = require("../models/Member");

const router = express.Router();

// ==========================================
// GET ALL MEMBERS
// GET /api/members
// ==========================================

router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch members",
      error: error.message,
    });
  }
});

// ==========================================
// GET ONE MEMBER
// GET /api/members/:id
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const member =
      await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch member",
      error: error.message,
    });
  }
});

// ==========================================
// CREATE MEMBER
// POST /api/members
// ==========================================

router.post("/", async (req, res) => {
  try {
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
        success: false,
        message:
          "Name, email and phone are required",
      });
    }

    const member = new Member({
      name,
      email,
      phone,
      address,
      membershipType,
      status,
    });

    const savedMember =
      await member.save();

    res.status(201).json({
      success: true,
      message:
        "Member created successfully",
      data: savedMember,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to create member",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE MEMBER
// PUT /api/members/:id
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const member =
      await Member.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Member updated successfully",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to update member",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE MEMBER
// DELETE /api/members/:id
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const member =
      await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Member deleted successfully",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to delete member",
      error: error.message,
    });
  }
});

module.exports = router;