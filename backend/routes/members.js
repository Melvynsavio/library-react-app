const express = require("express");
const mongoose = require("mongoose");
const Member = require("../models/Member");
const Issue = require("../models/Issue");
const {
  cleanText,
  isValidEmail,
  isValidPhone,
  pick,
  sendValidationError,
} = require("../utils/validation");

const router = express.Router();

const MEMBERSHIP_TYPES = ["Regular", "Premium", "Student"];
const STATUSES = ["Active", "Inactive"];

const validateMember = (payload) => {
  const data = pick(payload, [
    "name",
    "email",
    "phone",
    "address",
    "membershipType",
    "status",
  ]);
  const errors = {};

  data.name = cleanText(data.name);
  data.email = cleanText(data.email).toLowerCase();
  data.phone = cleanText(data.phone);
  data.address = cleanText(data.address);
  data.membershipType = cleanText(data.membershipType) || "Regular";
  data.status = cleanText(data.status) || "Active";

  if (data.name.length < 2 || data.name.length > 100) {
    errors.name = "Name must be between 2 and 100 characters";
  }
  if (!isValidEmail(data.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!isValidPhone(data.phone)) {
    errors.phone = "Enter a valid phone number with 7 to 15 digits";
  }
  if (data.address.length > 300) {
    errors.address = "Address cannot exceed 300 characters";
  }
  if (!MEMBERSHIP_TYPES.includes(data.membershipType)) {
    errors.membershipType = "Select a valid membership type";
  }
  if (!STATUSES.includes(data.status)) {
    errors.status = "Select a valid member status";
  }

  return { data, errors };
};

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
    const { data, errors } = validateMember(req.body);

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    const existingMember = await Member.findOne({ email: data.email });
    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: "A member with this email already exists",
        errors: { email: "Email must be unique" },
      });
    }

    const member = new Member(data);

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

    const { data, errors } = validateMember(req.body);

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    const duplicateEmail = await Member.findOne({
      email: data.email,
      _id: { $ne: id },
    });
    if (duplicateEmail) {
      return res.status(409).json({
        success: false,
        message: "A member with this email already exists",
        errors: { email: "Email must be unique" },
      });
    }

    const member = await Member.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

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

    const activeIssue = await Issue.exists({
      memberId: id,
      status: "Issued",
    });

    if (activeIssue) {
      return res.status(409).json({
        success: false,
        message: "Return all issued books before deleting this member",
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
