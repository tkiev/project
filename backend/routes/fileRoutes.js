// backend/routes/fileRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // Dùng memory storage để lấy buffer
const fileController = require("../controllers/fileController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/view/:id", authMiddleware, fileController.viewFile);
router.post("/upload", authMiddleware, upload.single("file"), fileController.uploadFile);
router.get("/:id", authMiddleware, fileController.getFile);
router.get("/", fileController.getAllFiles);
// Nếu chỉ người đăng nhập mới thấy danh sách, bỏ comment authMiddleware.
// Nếu muốn cho ai cũng thấy danh sách file, bỏ authMiddleware đi.

module.exports = router;
