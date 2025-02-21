// backend/models/File.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  originalName: String,
  mimeType: String,
  encryptedData: Buffer, // Lưu dữ liệu đã mã hoá
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // Có thể thêm quyền truy cập, thời gian upload, ...
});

module.exports = mongoose.model("File", fileSchema);
