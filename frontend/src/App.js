// frontend/src/App.js
import ProtectedRoute from "./components/ProtectedRoute";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import FilePage from "./pages/FilePage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/files" element={<FilePage />} />
        {/* Bạn có thể thêm ProtectedRoute cho /files nếu muốn */}
      </Routes>
    </Router>
  );
}
<Route
  path="/files"
  element={
    <ProtectedRoute>
      <FilePage />
    </ProtectedRoute>
  }
/>
export default App;
