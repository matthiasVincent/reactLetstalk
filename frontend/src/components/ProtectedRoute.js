import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthService } from "./services/AuthService";

export function ProtectedRoute({ children }) {
  const [user] = useState(() => new AuthService().getCurrentUser())
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
