const express = require("express");
const User = require("../models/User");
const CallSession = require("../models/CallSession");

const { generateProgressPDF } = require("../services/pdfService");
const { sendProgressEmail } = require("../services/emailService");
const { calculateAverageScore } = require("../services/progressAnalyzer");

const router = express.Router();

router.post("/send-test-mail", async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Get user feedbacks
    const calls = await CallSession.find({
      "feedbacks.user": user._id
    });

    const feedbacks = calls.flatMap(c =>
      c.feedbacks.filter(f => f.user.toString() === user._id.toString())
    );

    if (!feedbacks.length) {
      return res.status(400).json({ message: "No feedback data found" });
    }

    // 3️⃣ Calculate score
    const avgScore = calculateAverageScore(feedbacks);

    // 4️⃣ Generate PDF
    const pdfPath = await generateProgressPDF(user, feedbacks);

    // 5️⃣ Send email
    await sendProgressEmail(user, pdfPath, avgScore);

    res.status(200).json({ message: "Test email sent successfully" });

  } catch (error) {
    console.error("MAIL ERROR:", error);
    res.status(500).json({ message: "Mail sending failed" });
  }
});

module.exports = router;
