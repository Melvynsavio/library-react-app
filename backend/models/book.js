const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
      maxlength: 50,
    },

    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10000,
      default: 1,
    },

    available: {
      type: Number,
      default: 1,
      min: 0,
      max: 10000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
