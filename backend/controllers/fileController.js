const File = require("../models/File");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const uploadDir = path.join(__dirname, "../uploads"); // Đường dẫn thư mục lưu file

// Khóa và thuật toán mã hoá đơn giản (chỉ ví dụ)
const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.FILE_ENCRYPTION_KEY, "hex"); 
// FILE_ENCRYPTION_KEY bạn có thể tự generate 32 bytes => convert sang hex => lưu trong .env
const iv = crypto.randomBytes(16); // initialization vector

exports.viewFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "Không tìm thấy file." });
    }

    // Nếu file được mã hoá, bạn cần giải mã trước khi gửi
    // Ví dụ, nếu không mã hoá, dữ liệu gốc nằm ở file.encryptedData:
    const pdfBuffer = file.encryptedData; // hoặc dữ liệu đã được giải mã

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.originalName}"`
    );
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Lỗi view file:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn file để upload." });
    }

    // Kiểm tra xem file đã tồn tại trong DB chưa
    const existingFile = await File.findOne({ originalName: req.file.originalname });
    if (existingFile) {
      return res.status(400).json({ message: "File đã tồn tại. Vui lòng đổi tên file trước khi upload." });
    }

    // Mã hoá dữ liệu
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(req.file.buffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Lưu vào DB
    const newFile = new File({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      encryptedData: encrypted,
      uploader: req.user.userId,
    });
    await newFile.save();

    res.json({ message: "Upload thành công.", fileId: newFile._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.getFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "Không tìm thấy file." });
    }

    // Giải mã
    // Ở đây ta cần IV để giải mã, ví dụ ta có thể lưu IV kèm theo encryptedData
    // hoặc tính toán cách lưu/truyền IV. Ở ví dụ này, mình giả sử IV được lưu cứng (chưa tối ưu)
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(file.encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // Thay vì cho tải trực tiếp, ta có thể stream:
    res.setHeader("Content-Type", file.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );
    return res.send(decrypted);

    // Hoặc nếu muốn hiển thị trên browser (ví dụ file PDF), 
    // có thể setContent-Type và trả về buffer để preview
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
};
exports.getAllFiles = async (req, res) => {
  try {
    const all = await File.find({}); 
    // all = [ { _id, originalName, ... }, { ... }, ... ]

    // Tạo object để map: originalName -> file (chỉ lưu file đầu tiên hoặc file cuối)
    const uniqueByName = {};
    // Lưu file đầu tiên gặp được:
    // (Nếu bạn muốn lấy file mới nhất, bạn đảo ngược thứ tự duyệt)
    for (const f of all) {
      if (!uniqueByName[f.originalName]) {
        uniqueByName[f.originalName] = f;
      }
    }

    const uniqueFiles = Object.values(uniqueByName);
    // => Mảng file đã loại trùng lặp

    res.json(uniqueFiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
};