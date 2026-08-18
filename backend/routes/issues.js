const express = require("express");
const mongoose = require("mongoose");
const Issue = require("../models/Issue");
const Book = require("../models/book");
const Member = require("../models/Member");
const {
  isValidDate,
  sendValidationError,
} = require("../utils/validation");

const router = express.Router();

// ==========================================
// GET ALL ISSUED BOOKS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("bookId")
      .populate("memberId")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    console.error("GET ISSUES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch issued books",
      error: error.message,
    });
  }
});

// ==========================================
// ISSUE A BOOK
// ==========================================

router.post("/", async (req, res) => {
  try {
    const {
      bookId,
      memberId,
      issueDate,
      dueDate,
    } = req.body || {};

    const errors = {};
    const actualIssueDate = issueDate ? new Date(issueDate) : new Date();
    const actualDueDate = dueDate ? new Date(dueDate) : null;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      errors.bookId = "Select a valid book";
    }
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      errors.memberId = "Select a valid member";
    }
    if (issueDate && !isValidDate(issueDate)) {
      errors.issueDate = "Enter a valid issue date";
    } else if (actualIssueDate > new Date()) {
      errors.issueDate = "Issue date cannot be in the future";
    }
    if (!isValidDate(dueDate)) {
      errors.dueDate = "Enter a valid due date";
    } else if (actualDueDate < actualIssueDate) {
      errors.dueDate = "Due date cannot be before the issue date";
    } else if (!issueDate && actualDueDate < today) {
      errors.dueDate = "Due date cannot be in the past";
    }

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    // Find book
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Check availability
    if (book.available <= 0) {
      return res.status(400).json({
        message: "Book is currently unavailable",
      });
    }

    // Find member
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // Check member status
    if (member.status !== "Active") {
      return res.status(400).json({
        message: "Member is inactive",
      });
    }

    const existingIssue = await Issue.exists({
      bookId,
      memberId,
      status: "Issued",
    });

    if (existingIssue) {
      return res.status(409).json({
        success: false,
        message: "This member already has this book issued",
      });
    }

    // Create issue record
    const issue = new Issue({
      bookId,
      memberId,
      issueDate: actualIssueDate,
      dueDate: actualDueDate,
      status: "Issued",
      fine: 0,
    });

    const savedIssue = await issue.save();

    // Decrease available books
    book.available = book.available - 1;

    // Update book status
    if (book.available === 0) {
      book.status = "Issued";
    }

    await book.save();

    // Return populated issue
    const populatedIssue = await Issue.findById(savedIssue._id)
      .populate("bookId")
      .populate("memberId");

    res.status(201).json({
      message: "Book issued successfully",
      issue: populatedIssue,
    });
  } catch (error) {
    console.error("ISSUE BOOK ERROR:", error);

    res.status(500).json({
      message: "Failed to issue book",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE ISSUE
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const issue = await Issue.findById(req.params.id)
      .populate("bookId")
      .populate("memberId");

    if (!issue) {
      return res.status(404).json({
        message: "Issue record not found",
      });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch issue",
      error: error.message,
    });
  }
});

module.exports = router;
