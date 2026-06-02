const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    // Stored as a bcrypt hash. Plain passwords are never saved.
    password: {
      type: String,
      required: true,
      select: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
