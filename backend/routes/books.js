const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/book");
const Issue = require("../models/Issue");
const {
  cleanText,
  isValidIsbn,
  pick,
  sendValidationError,
} = require("../utils/validation");

const router = express.Router();

const validateBook = (payload) => {
  const data = pick(payload, [
    "title",
    "author",
    "category",
    "isbn",
    "quantity",
  ]);
  const errors = {};

  data.title = cleanText(data.title);
  data.author = cleanText(data.author);
  data.category = cleanText(data.category) || "General";
  data.isbn = cleanText(data.isbn).replace(/[\s-]/g, "").toUpperCase();
  data.quantity = Number(data.quantity);

  if (data.title.length < 2 || data.title.length > 150) {
    errors.title = "Title must be between 2 and 150 characters";
  }
  if (data.author.length < 2 || data.author.length > 100) {
    errors.author = "Author must be between 2 and 100 characters";
  }
  if (data.category.length > 50) {
    errors.category = "Category cannot exceed 50 characters";
  }
  if (!isValidIsbn(data.isbn)) {
    errors.isbn = "Enter a valid ISBN-10 or ISBN-13";
  }
  if (
    !Number.isInteger(data.quantity) ||
    data.quantity < 1 ||
    data.quantity > 10000
  ) {
    errors.quantity = "Quantity must be a whole number between 1 and 10,000";
  }

  return { data, errors };
};

// ==========================================
// GET ALL BOOKS
// GET /api/books
// ==========================================

router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message,
    });
  }
});

// ==========================================
// GET ONE BOOK
// GET /api/books/:id
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch book",
      error: error.message,
    });
  }
});

// ==========================================
// CREATE BOOK
// POST /api/books
// ==========================================

router.post("/", async (req, res) => {
  try {
    const { data, errors } = validateBook(req.body);

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    const existingBook = await Book.findOne({ isbn: data.isbn });
    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: "A book with this ISBN already exists",
        errors: { isbn: "ISBN must be unique" },
      });
    }

    const book = new Book({
      ...data,
      available: data.quantity,
    });

    const savedBook = await book.save();

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: savedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE BOOK
// PUT /api/books/:id
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const { data, errors } = validateBook(req.body);

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    const existingBook = await Book.findById(id);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const duplicateIsbn = await Book.findOne({
      isbn: data.isbn,
      _id: { $ne: id },
    });
    if (duplicateIsbn) {
      return res.status(409).json({
        success: false,
        message: "A book with this ISBN already exists",
        errors: { isbn: "ISBN must be unique" },
      });
    }

    const issuedCopies = existingBook.quantity - existingBook.available;
    if (data.quantity < issuedCopies) {
      return res.status(400).json({
        success: false,
        message: `Quantity cannot be lower than ${issuedCopies} currently issued copies`,
        errors: { quantity: "Quantity is lower than the issued copy count" },
      });
    }

    Object.assign(existingBook, data, {
      available: data.quantity - issuedCopies,
    });
    const book = await existingBook.save();

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE BOOK
// DELETE /api/books/:id
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const activeIssue = await Issue.exists({
      bookId: id,
      status: "Issued",
    });

    if (activeIssue) {
      return res.status(409).json({
        success: false,
        message: "Return all issued copies before deleting this book",
      });
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error: error.message,
    });
  }
});

module.exports = router;
