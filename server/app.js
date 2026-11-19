const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const languageRoutes = require("./routes/languageRoutes");
const callRoutes = require("./routes/callRoutes");
const adminRoutes = require("./routes/adminRoutes");
const testMailRoutes = require("./routes/testMailRoutes");
const adminAnalyticsRouter = require("./routes/adminAnalyticsRouter");
const userRoutes = require("./routes/userRoutes");


const app = express();

/* ---------- GLOBAL MIDDLEWARE ---------- */
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

/* ---------- ROUTES ---------- */
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api/auth", authRoutes);
app.use("/api/language", languageRoutes);
app.use("/api/call", callRoutes);
app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminAnalyticsRouter);
app.use("/api/test", testMailRoutes);
app.use("/api/admin", require("./routes/adminBlockRoutes"));


module.exports = app;
