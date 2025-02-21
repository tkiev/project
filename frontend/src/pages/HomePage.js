// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import instance from "../api/axios";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

function HomePage() {
  const [files, setFiles] = useState([]);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    // Lấy danh sách file
    instance
      .get("/files") // GET /api/files
      .then((res) => {
        console.log("Dữ liệu nhận được:", res.data);
        setFiles(res.data);
      })
      .catch((err) => console.error("Lỗi lấy danh sách file:", err));
  }, []);

  // Hàm xem online (mở tab mới)
  const handleView = (fileId) => {
    const previewUrl = `http://localhost:5000/api/files/preview/${fileId}`;
    window.open(previewUrl, "_blank");
  };

  return (
    <Container maxWidth="md" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách File
      </Typography>

      {files.length === 0 ? (
        <Typography>Chưa có file nào.</Typography>
      ) : (
        <List>
          {files.map((file) => (
            <ListItem
              key={file._id}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              {/* Click tên file để xem online */}
              <ListItemText
                primary={
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => handleView(file._id)}
                  >
                    {file.originalName}
                  </span>
                }
              />
              
            </ListItem>
          ))}
        </List>
      )}

      {!isLoggedIn && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Bạn cần đăng nhập để xem tài liệu.
        </Typography>
      )}
    </Container>
  );
}

export default HomePage;
