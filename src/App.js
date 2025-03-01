import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Registration";
import Dashboard from "./components/Dashboard";
import InvitePage from "./components/InvitePage";

function PrivateRoute({ element }) {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? element : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/join/:userId" element={<InvitePage />} />
      </Routes>
    </Router>
  );
}

export default App;
