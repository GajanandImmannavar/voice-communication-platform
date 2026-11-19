const User = require("../models/User");
const CallSession = require("../models/CallSession");

exports.getAnalytics = async (req, res) => {
  try {
    /* ---------------- USERS ---------------- */
    const totalUsers = await User.countDocuments();

    /* ----------- REPORTED USERS ------------ */
    const reportedCalls = await CallSession.find({ isReported: true });

    const reportedUserIds = new Set();
    reportedCalls.forEach(call => {
      reportedUserIds.add(call.caller.toString());
      reportedUserIds.add(call.receiver.toString());
    });

    const reportedUsers = reportedUserIds.size;

    /* -------- FEEDBACK BASED USERS ---------- */
    const calls = await CallSession.find({ "feedbacks.score": { $exists: true } });

    const userScores = {};
    calls.forEach(call => {
      call.feedbacks.forEach(f => {
        if (!userScores[f.user]) userScores[f.user] = [];
        userScores[f.user].push(f.score);
      });
    });

    let goodUsers = 0;
    let badUsers = 0;

    Object.values(userScores).forEach(scores => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      avg >= 6 ? goodUsers++ : badUsers++;
    });

    /* ---------- REPORT SEVERITY ------------- */
    let lowReports = 0;
    let mediumReports = 0;
    let highReports = 0;

    reportedCalls.forEach(call => {
      if (call.reportCount <= 2) lowReports++;
      else if (call.reportCount <= 5) mediumReports++;
      else highReports++;
    });

    res.json({
      totalUsers,
      reportedUsers,
      goodUsers,
      badUsers,
      lowReports,
      mediumReports,
      highReports
    });

  } catch (error) {
    console.error("ADMIN ANALYTICS ERROR:", error);
    res.status(500).json({ message: "Analytics failed" });
  }
};
