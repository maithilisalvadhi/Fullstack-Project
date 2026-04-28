import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login.jsx"
import Register from "./pages/auth/Register.jsx"
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import CreateActivity from "./pages/admin/CreateActivity.jsx"
import ManageEvents from "./pages/admin/ManageEvents.jsx"
import Participation from "./pages/admin/Participation.jsx"
import NotificationsAdmin from "./pages/admin/NotificationsAdmin.jsx"
import StudentDashboard from "./pages/student/StudentDashboard.jsx"
import BrowseActivities from "./pages/student/BrowseActivities.jsx"
import EventDetails from "./pages/student/EventDetails.jsx"
import MyParticipation from "./pages/student/MyParticipation.jsx"
import NotificationsStudent from "./pages/student/NotificationsStudent.jsx"
import CalendarView from "./pages/student/CalendarView.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import DashboardLayout from "./components/DashboardLayout.jsx"
import ToastContainer from "./components/ToastContainer.jsx"
import { useAuth } from "./context/AuthContext.jsx"

function App() {
  const { user } = useAuth()

  return (
    <div className="app-gradient min-h-screen">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="create" element={<CreateActivity />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="participation" element={<Participation />} />
          <Route path="notifications" element={<NotificationsAdmin />} />
        </Route>

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout role="student" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="browse" element={<BrowseActivities />} />
          <Route path="event/:id" element={<EventDetails />} />
          <Route path="my-activities" element={<MyParticipation />} />
          <Route path="notifications" element={<NotificationsStudent />} />
          <Route path="calendar" element={<CalendarView />} />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to={
                user
                  ? user.role === "admin"
                    ? "/admin/dashboard"
                    : "/student/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
