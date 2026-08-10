import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("crime_ai_user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}