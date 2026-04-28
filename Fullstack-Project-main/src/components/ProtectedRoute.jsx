import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

function ProtectedRoute({ role, children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"} replace />
  }

  return children
}

export default ProtectedRoute
