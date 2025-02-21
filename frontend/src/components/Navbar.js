// frontend/src/components/Navbar.js
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

function Navbar() {
  const handleLogout = () => {
    // Xoá token, chuyển hướng trang
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Logo / Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              My Document Sharing
            </Link>
          </Typography>

          {/* Nếu chưa đăng nhập => hiển thị nút Auth, nếu đăng nhập => hiển thị nút Logout */}
          {!isLoggedIn ? (
            <Button color="inherit" component={Link} to="/auth">
              Đăng nhập / Đăng ký
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/files">
                Quản lý File
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
