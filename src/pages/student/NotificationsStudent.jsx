import { useEffect, useState } from "react"
import { api } from "../../services/api.js"
import Loader from "../../components/Loader.jsx"
import { useToast } from "../../context/ToastContext.jsx"

function NotificationsStudent() {
  const { addToast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = () => {
    setLoading(true)
    api.getNotifications("student").then((response) => {
      setNotifications(response.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id) => {
    await api.markNotificationRead(id)
    addToast("Marked as read.", "success")
    fetchNotifications()
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <h2 className="text-xl font-display font-semibold text-slate-900">Notifications</h2>
      <p className="text-sm text-slate-500">Stay updated with campus updates.</p>

      {loading ? (
        <Loader label="Loading notifications..." />
      ) : (
        <div className="mt-6 space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                <span className="text-xs text-slate-400">{notification.date}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    notification.status === "read"
                      ? "bg-slate-100 text-slate-500"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {notification.status}
                </span>
                {notification.status !== "read" && (
                  <button
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsStudent
