const express = require("express");
const { selectLanguage } = require("../controllers/languageController");
var authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/select", authMiddleware, selectLanguage);

module.exports = router;
