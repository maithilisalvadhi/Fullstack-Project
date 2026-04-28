import { useEffect, useState } from "react"
import { FiActivity, FiBell, FiCalendar, FiUsers } from "react-icons/fi"
import { api } from "../../services/api.js"
import Loader from "../../components/Loader.jsx"

const stats = [
  { label: "Active Activities", value: "18", icon: <FiActivity />, trend: "+4 this month" },
  { label: "Upcoming Events", value: "7", icon: <FiCalendar />, trend: "3 this week" },
  { label: "Student Participants", value: "326", icon: <FiUsers />, trend: "+12%" },
  { label: "Notifications Sent", value: "54", icon: <FiBell />, trend: "8 new" },
]

function AdminDashboard() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getActivities().then((response) => {
      setActivities(response.data.slice(0, 4))
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-indigo-100 p-2 text-indigo-600">{item.icon}</span>
              <span className="text-xs font-semibold text-green-500">{item.trend}</span>
            </div>
            <h3 className="mt-4 text-2xl font-display font-semibold text-slate-900">{item.value}</h3>
            <p className="text-sm text-slate-500">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-slate-900">Recent Activities</h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              Updated today
            </span>
          </div>
          {loading ? (
            <Loader label="Loading activities..." />
          ) : (
            <div className="mt-4 space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                    <p className="text-xs text-slate-500">
                      {activity.date} • {activity.location}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                    {activity.seatsLeft} seats left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-soft">
            <h3 className="text-lg font-display font-semibold">Quick Actions</h3>
            <p className="mt-2 text-sm text-slate-300">
              Create a new activity, send notifications, and keep students informed.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">Add new club meeting</div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">Review waitlisted students</div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">Send campus reminder</div>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h3 className="text-lg font-display font-semibold">Highlights</h3>
            <p className="mt-2 text-sm text-slate-500">
              Participation is trending upward with strong engagement in clubs and sports.
            </p>
            <div className="mt-4 rounded-2xl bg-indigo-50 px-4 py-3 text-xs text-indigo-600">
              88% of activities are above 70% capacity.
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
