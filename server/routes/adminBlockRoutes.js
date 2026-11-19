const express = require("express");
const router = express.Router();

const CallSession = require("../models/CallSession");
const User = require("../models/User");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

/**
 * TOGGLE BLOCK OFFENDER (ADMIN)
 */
router.put(
  "/toggle-offender/:callId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { callId } = req.params;

      const call = await CallSession.findById(callId);
      if (!call) {
        return res.status(404).json({ message: "Call not found" });
      }

      if (!call.reportedBy) {
        return res
          .status(400)
          .json({ message: "Call not reported yet" });
      }

      // Decide offender
      const offenderId =
        call.reportedBy.toString() === call.caller.toString()
          ? call.receiver
          : call.caller;

      const offender = await User.findById(offenderId);
      if (!offender) {
        return res.status(404).json({ message: "User not found" });
      }

      // 🔁 TOGGLE USER BLOCK
      offender.isBlocked = !offender.isBlocked;
      await offender.save();

      // ✅ STORE RESULT IN CALL SESSION (THIS FIXES REFRESH ISSUE)
      call.offenderBlocked = offender.isBlocked;
      await call.save();

      res.json({
        message: offender.isBlocked
          ? "User blocked"
          : "User unblocked",
        offenderId,
        isBlocked: offender.isBlocked,
      });
    } catch (error) {
      console.error("Toggle offender error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
