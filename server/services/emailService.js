const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // no-reply@gmail.com
    pass: process.env.MAIL_PASS  // app password
  }
});

exports.sendProgressEmail = async (user, pdfPath, avgScore) => {
  let subject = "Your Communication Progress Report";
  let message = "";

  if (avgScore < 4) {
    message = "Keep going! Every practice makes you better.";
  } else if (avgScore < 7) {
    message = "Great progress! You're improving steadily.";
  } else {
    message = "Excellent work! Your communication skills are strong.";
  }

  await transporter.sendMail({
    from: `"Voice Coach AI" <no-reply@gmail.com>`,
    to: user.email,
    subject,
    text: `
Hi ${user.name},

${message}

Please find your detailed progress report attached.

Best regards,
Voice Coach AI Team
    `,
    attachments: [{ path: pdfPath }]
  });
};
