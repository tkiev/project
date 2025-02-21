// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Các thông tin khác (email, role, v.v.) tuỳ ý
});

module.exports = mongoose.model("User", userSchema);
