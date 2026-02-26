import { Outlet } from "react-router-dom"
import {
  FiActivity,
  FiCalendar,
  FiClipboard,
  FiHome,
  FiPieChart,
  FiPlusCircle,
  FiBell,
} from "react-icons/fi"
import Navbar from "./Navbar.jsx"
import Sidebar from "./Sidebar.jsx"

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <FiHome /> },
  { to: "/admin/create", label: "Create Activity", icon: <FiPlusCircle /> },
  { to: "/admin/events", label: "Manage Events", icon: <FiActivity /> },
  { to: "/admin/participation", label: "Participation", icon: <FiPieChart /> },
  { to: "/admin/notifications", label: "Notifications", icon: <FiBell /> },
]

const studentLinks = [
  { to: "/student/dashboard", label: "Dashboard", icon: <FiHome /> },
  { to: "/student/browse", label: "Browse Activities", icon: <FiActivity /> },
  { to: "/student/my-activities", label: "My Participation", icon: <FiClipboard /> },
  { to: "/student/notifications", label: "Notifications", icon: <FiBell /> },
  { to: "/student/calendar", label: "Calendar", icon: <FiCalendar /> },
]

function DashboardLayout({ role }) {
  const links = role === "admin" ? adminLinks : studentLinks

  return (
    <div className="flex min-h-screen flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8">
      <div className="lg:w-[270px]">
        <Sidebar
          title={role === "admin" ? "Admin Hub" : "Student Hub"}
          subtitle={role === "admin" ? "Control Center" : "Your Activities"}
          links={links}
        />
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
