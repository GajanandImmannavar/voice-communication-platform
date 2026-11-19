const cron = require("node-cron");
const User = require("../models/User");
const CallSession = require("../models/CallSession");

const { generateProgressPDF } = require("../services/pdfService");
const { sendProgressEmail } = require("../services/emailService");
const { calculateAverageScore } = require("../services/progressAnalyzer");

cron.schedule("0 9 * * MON", async () => {
  console.log("📧 Weekly progress job started");

  const users = await User.find({ role: "user" });

  for (const user of users) {
    const calls = await CallSession.find({
      "feedbacks.user": user._id
    });

    const feedbacks = calls.flatMap(c =>
      c.feedbacks.filter(f => f.user.toString() === user._id.toString())
    );

    if (!feedbacks.length) continue;

    const avgScore = calculateAverageScore(feedbacks);
    const pdfPath = await generateProgressPDF(user, feedbacks);

    await sendProgressEmail(user, pdfPath, avgScore);
  }

  console.log("✅ Weekly progress emails sent");
});
