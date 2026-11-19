const mongoose = require("mongoose");

/**
 * Per-user AI feedback (VERY IMPORTANT)
 */
const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    transcript: {
      type: String,
      required: true,
    },

    aiFeedback: {
      issues: {
        type: [String],
        default: [],
      },
      improvements: {
        type: [String],
        default: [],
      },
      correctedVersion: {
        type: String,
        default: "",
      },
    },

    suggestions: [
      {
        originalText: String,
        alternatives: [String],
      },
    ],

    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/**
 * Call session schema
 */
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
      required: null,
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

    // 🧠 MULTI-USER AI FEEDBACK (KEY CHANGE)
    feedbacks: {
      type: [feedbackSchema],
      default: [],
    },

    // 🚨 REPORT SYSTEM
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("CallSession", callSchema);
