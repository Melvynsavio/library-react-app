const express = require("express");
const router = express.Router();
const {
  logActivity,
} = require("../logger");

const Book = require("../models/Book");

// ==========================================
// GET ALL BOOKS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({
      createdAt: -1,
    });

    res.json(books);
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
});

// ==========================================
// GET ONE BOOK
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch book",
      error: error.message,
    });
  }
});

// ==========================================
// CREATE BOOK
// ==========================================

router.post("/", async (req, res) => {
  try {
    console.log("BOOK DATA RECEIVED:");
    console.log(req.body);

    const {
      title,
      author,
      category,
      isbn,
      quantity,
    } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({
        message:
          "Title, author and category are required",
      });
    }

    const bookQuantity = Number(quantity) || 1;

    const book = new Book({
      title,
      author,
      category,
      isbn: isbn || "",
      quantity: bookQuantity,
      available: bookQuantity,
      status: "Available",
    });

    const savedBook = await book.save();
    logActivity(
  "BOOK ADDED",
  `${savedBook.title} by ${savedBook.author}`
);

    console.log("BOOK CREATED:");
    console.log(savedBook);

    res.status(201).json(savedBook);

  } catch (error) {
    console.error("CREATE BOOK ERROR:", error);

    res.status(500).json({
      message: "Failed to create book",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE BOOK
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(book);

  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);

    res.status(500).json({
      message: "Failed to update book",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE BOOK
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      message: "Book deleted successfully",
    });

  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);

    res.status(500).json({
      message: "Failed to delete book",
      error: error.message,
    });
  }
});

module.exports = router;