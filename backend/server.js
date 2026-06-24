const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || "Server Error" });
});

if (!process.env.MONGO_URI || process.env.MONGO_URI.includes("<username>")) {
  console.error("\n❌ ERROR: MONGO_URI is not set in your .env file!");
  console.error("👉 Go to https://cloud.mongodb.com, create a free cluster, and paste your connection string in backend/.env");
  console.error("   Example: MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/doctor_appointment\n");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    const server = app.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`)
    );
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${process.env.PORT || 5000} is already in use.`);
        console.error("👉 Run this command to fix it: netstat -ano | findstr :5000  then  taskkill /PID <number> /F");
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("👉 Check your MONGO_URI in backend/.env");
    process.exit(1);
  });
