// frontend/src/pages/FilePage.js
import React, { useState } from "react";
import PDFViewer from "../components/PDFViewer";
import axios from "../api/axios";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
} from "@mui/material";

function FilePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileId, setUploadedFileId] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload thành công!");

      // Giả sử server trả về { message: "Upload thành công.", fileId: newFile._id }
      setUploadedFileId(res.data.fileId);

      // Nếu file không phải PDF, PDFViewer sẽ không render được
      // Bạn có thể kiểm tra loại file qua selectedFile.type
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("Lỗi kết nối: " + error.message);
      }
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 50 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Upload File
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button variant="contained" component="label">
              Chọn file
              <input type="file" hidden onChange={handleFileChange} />
            </Button>

            {selectedFile && (
              <Typography variant="subtitle1">
                File đã chọn: <strong>{selectedFile.name}</strong>
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              Upload
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Nếu có uploadedFileId, hiển thị PDFViewer */}
      {uploadedFileId && (
        <Box mt={4}>
          <Typography variant="h6">
            Xem tài liệu PDF vừa upload:
          </Typography>
          <PDFViewer fileId={uploadedFileId} />
        </Box>
      )}
    </Container>
  );
}

export default FilePage;
