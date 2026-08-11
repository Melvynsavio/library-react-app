const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    membershipType: {
      type: String,
      enum: [
        "Regular",
        "Premium",
        "Student",
      ],
      default: "Regular",
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
      ],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("Member", memberSchema);