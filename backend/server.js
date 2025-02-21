// backend/server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Bật CORS toàn cục:
app.use(cors());
// Kết nối DB
connectDB();

app.use(express.json());

// Routes
app.use("/api/files", require("./routes/fileRoutes"));
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});
