import { useAuth } from "../context/AuthContext.jsx";
import { Navigate, Outlet } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ roles }) => {
  const { user, isAdmin, isManager, isEmployee } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.some((role) => role === user.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;