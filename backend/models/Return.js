const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
      unique: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    returnDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    lateDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    fine: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Returned", "Late"],
      default: "Returned",
    },
  },
  {
    timestamps: true,
  }
);

const Return = mongoose.model("Return", returnSchema);

module.exports = Return;