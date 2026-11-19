const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateProgressPDF = (user, feedbacks) => {
  return new Promise((resolve) => {
    const fileName = `Progress_Report_${user.name}.pdf`;
    const filePath = path.join(__dirname, "..", "reports", fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Communication Progress Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.moveDown();

    feedbacks.forEach((f, index) => {
      doc.text(`Session ${index + 1}`);
      doc.text(`Score: ${f.score}`);
      doc.text(`Corrected Version: ${f.aiFeedback.correctedVersion || "N/A"}`);
      doc.moveDown();
    });

    doc.text("Keep practicing. Your communication is improving day by day!");
    doc.end();

    resolve(filePath);
  });
};
