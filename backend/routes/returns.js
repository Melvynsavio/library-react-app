const express = require("express");

const Return = require("../models/Return");
const Issue = require("../models/Issue");
const Book = require("../models/Book");

const router = express.Router();

// Fine per late day
const FINE_PER_DAY = 5;

// ==========================================
// GET ALL RETURNS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const returns = await Return.find()
      .populate("bookId")
      .populate("memberId")
      .populate("issueId")
      .sort({ createdAt: -1 });

    res.json(returns);
  } catch (error) {
    console.error("GET RETURNS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch returned books",
      error: error.message,
    });
  }
});

// ==========================================
// RETURN BOOK
// ==========================================

router.post("/", async (req, res) => {
  try {
    const { issueId, returnDate } = req.body;

    if (!issueId) {
      return res.status(400).json({
        message: "Issue ID is required",
      });
    }

    // Find issue
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        message: "Issue record not found",
      });
    }

    // Prevent duplicate return
    if (issue.status === "Returned") {
      return res.status(400).json({
        message: "This book has already been returned",
      });
    }

    // Find book
    const book = await Book.findById(issue.bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Calculate return date
    const actualReturnDate = returnDate
      ? new Date(returnDate)
      : new Date();

    const dueDate = new Date(issue.dueDate);

    // Calculate late days
    let lateDays = 0;

    if (actualReturnDate > dueDate) {
      const difference =
        actualReturnDate.getTime() - dueDate.getTime();

      lateDays = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );
    }

    // Calculate fine
    const fine = lateDays * FINE_PER_DAY;

    // Create return record
    const returnRecord = new Return({
      issueId: issue._id,
      bookId: issue.bookId,
      memberId: issue.memberId,
      returnDate: actualReturnDate,
      dueDate: issue.dueDate,
      lateDays,
      fine,
      status: lateDays > 0 ? "Late" : "Returned",
    });

    const savedReturn = await returnRecord.save();

    // Update issue
    issue.returnDate = actualReturnDate;
    issue.status = "Returned";
    issue.fine = fine;

    await issue.save();

    // Increase available book count
    book.available = book.available + 1;

    // Update status
    if (book.available > 0) {
      book.status = "Available";
    }

    await book.save();

    // Populate return record
    const populatedReturn = await Return.findById(
      savedReturn._id
    )
      .populate("bookId")
      .populate("memberId")
      .populate("issueId");

    res.status(201).json({
      message: "Book returned successfully",
      return: populatedReturn,
      fine,
      lateDays,
    });
  } catch (error) {
    console.error("RETURN BOOK ERROR:", error);

    res.status(500).json({
      message: "Failed to return book",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE RETURN
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const returnRecord = await Return.findById(req.params.id)
      .populate("bookId")
      .populate("memberId")
      .populate("issueId");

    if (!returnRecord) {
      return res.status(404).json({
        message: "Return record not found",
      });
    }

    res.json(returnRecord);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch return record",
      error: error.message,
    });
  }
});

module.exports = router;