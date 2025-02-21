// frontend/src/pages/AuthPage.js
import React, { useState } from "react";
import { Container, Box, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import axios from "../api/axios";

function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" hoặc "register"

  const handleRegister = async () => {
    try {
      const res = await axios.post("/auth/register", { username, password });
      alert(res.data.message || "Đăng ký thành công!");
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("Lỗi kết nối: " + error.message);
      }
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      alert("Đăng nhập thành công!");
      window.location.href = "/"; // Chuyển về trang chủ hoặc /files
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("Lỗi kết nối: " + error.message);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "register") {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 50 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {mode === "register" ? "Đăng Ký" : "Đăng Nhập"}
          </Typography>

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onSubmit={handleSubmit}
          >
            <TextField
              label="Tên đăng nhập"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Mật khẩu"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button variant="contained" color="primary" type="submit">
              {mode === "register" ? "Đăng Ký" : "Đăng Nhập"}
            </Button>
          </Box>

          <Box mt={2}>
            {mode === "register" ? (
              <Typography variant="body2">
                Đã có tài khoản?{" "}
                <Button variant="text" onClick={() => setMode("login")}>
                  Đăng nhập
                </Button>
              </Typography>
            ) : (
              <Typography variant="body2">
                Chưa có tài khoản?{" "}
                <Button variant="text" onClick={() => setMode("register")}>
                  Đăng ký
                </Button>
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AuthPage;
