const express = require("express");
const CallSession = require("../models/CallSession");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

/**
 * GET ALL REPORTED CALLS (ADMIN)
 * - shows caller & receiver
 * - adds offenderBlocked flag (🔥 FIX)
 */
router.get(
  "/reported-calls",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const calls = await CallSession.find({ isReported: true })
        .populate("caller", "name email isBlocked")
        .populate("receiver", "name email isBlocked")
        .sort({ createdAt: -1 });

      // 🔥 IMPORTANT FIX
      const formattedCalls = calls.map(call => {
        const reportedByCaller =
          call.reportedBy?.toString() === call.caller?._id.toString();

        const offender = reportedByCaller
          ? call.receiver
          : call.caller;

        return {
          ...call.toObject(),
          offenderBlocked: offender?.isBlocked || false,
        };
      });

      res.status(200).json(formattedCalls);
    } catch (error) {
      console.error("Admin reported calls error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
