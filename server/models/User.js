const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
   },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    languages: [
      {
        language: String,
        reason: String
      }
    ],
    feedbackHistory: [
      {
        sessionId: String,
        summary: String,
        score: Number,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
