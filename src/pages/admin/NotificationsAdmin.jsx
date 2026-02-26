import { useEffect, useState } from "react"
import { api } from "../../services/api.js"
import { useToast } from "../../context/ToastContext.jsx"
import Loader from "../../components/Loader.jsx"

const audiences = [
  { value: "student", label: "Students" },
  { value: "admin", label: "Admins" },
]

function NotificationsAdmin() {
  const { addToast } = useToast()
  const [form, setForm] = useState({ title: "", message: "", audience: "student" })
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

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.message.trim()) {
      addToast("Title and message are required.", "error")
      return
    }
    await api.sendNotification(form)
    addToast("Notification sent.", "success")
    setForm({ title: "", message: "", audience: "student" })
    fetchNotifications()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="text-xl font-display font-semibold text-slate-900">Send Notification</h2>
        <p className="mt-2 text-sm text-slate-500">
          Share updates with students and campus coordinators.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Audience</label>
            <select
              name="audience"
              value={form.audience}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              {audiences.map((audience) => (
                <option key={audience.value} value={audience.value}>
                  {audience.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Notification title"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Write a quick update..."
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-500"
          >
            Send Notification
          </button>
        </form>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="text-xl font-display font-semibold text-slate-900">Sent Notifications</h2>
        {loading ? (
          <Loader label="Loading notifications..." />
        ) : (
          <div className="mt-4 space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <span className="text-xs text-slate-400">{item.date}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsAdmin
