const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/upload", uploadRoutes);
app.use("/api/ai", aiRoutes);

// Test route
app.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.json({ message: "Backend is working" });
});
app.get("/", (req, res) => {
  res.send("IdentityHub Backend is Running 🚀");
});

// Start server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});