const CallSession = require("../models/CallSession");

/**
 * 🚩 GET ALL REPORTED CALLS
 */
exports.getReportedCalls = async (req, res) => {
  try {
    const reportedCalls = await CallSession.find({ isReported: true })
      .populate("caller", "name email")
      .populate("receiver", "name email")
      .populate("feedbacks.user", "name email");

    res.status(200).json(reportedCalls);
  } catch (error) {
    console.error("Get reported calls error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
