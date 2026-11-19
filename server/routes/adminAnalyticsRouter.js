const express = require("express");
const CallSession = require("../models/CallSession");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get(
  "/analytics",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const reportedCalls = await CallSession.find({ isReported: true });

      res.status(200).json({
        reportedCalls
      });
    } catch (err) {
      res.status(500).json({ message: "Analytics fetch failed" });
    }
  }
);

module.exports = router;
