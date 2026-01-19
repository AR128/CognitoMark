import { Navigate } from "react-router-dom";
import { storage } from "../utils/storage";

const ProtectedRoute = ({ children }) => {
  const token = storage.get("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
