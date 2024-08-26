import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedLayout() {
  // need to check with the server
  const isAuthenticated = localStorage.getItem("user");

  return (isAuthenticated ? <Outlet /> : <Navigate to="/login" />);
};

