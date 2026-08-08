const express = require("express");
const Issue = require("../models/Issue");
const Book = require("../models/Book");
const Member = require("../models/Member");

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
    } = req.body;

    // Validate required fields
    if (!bookId || !memberId || !dueDate) {
      return res.status(400).json({
        message: "Book, member and due date are required",
      });
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

    // Create issue record
    const issue = new Issue({
      bookId,
      memberId,
      issueDate: issueDate || new Date(),
      dueDate,
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