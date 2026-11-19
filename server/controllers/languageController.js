const LanguageSelection = require("../models/LanguageSelection");

exports.selectLanguage = async (req, res) => {
  try {
    const { language, reason } = req.body;

    if (!language || !reason) {
      return res
        .status(400)
        .json({ message: "Language and reason are required" });
    }

    const selection = await LanguageSelection.create({
      user: req.user._id,
      language,
      reason,
    });

    res.status(201).json({
      message: "Language selection saved successfully",
      data: selection,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
