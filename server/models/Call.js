const mongoose = require("mongoose");

const callSchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
    },

    // 🔴 REPORT
    isReported: {
      type: Boolean,
      default: false,
    },

    reportReason: String,

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reportedAt: Date,

    // 🧠 AI DATA
    transcript: String,

    aiFeedback: {
      issues: [String],
      improvements: [String],
      correctedVersion: String,
    },

    suggestions: [
      {
        originalText: String,
        alternatives: [String],
      }
    ],

    score: {
      type: Number,
      min: 1,
      max: 10,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Call", callSchema);
