import { useEffect, useState } from "react"
import { FiCalendar, FiStar } from "react-icons/fi"
import { api } from "../../services/api.js"
import Loader from "../../components/Loader.jsx"
import ActivityCard from "../../components/ActivityCard.jsx"

function StudentDashboard() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getActivities().then((response) => {
      setActivities(response.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-display font-semibold text-slate-900">
              Your campus experience, organized.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Explore upcoming events, track participation, and never miss an opportunity.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-white">
            <FiCalendar />
            <span className="text-sm font-semibold">3 events this week</span>
          </div>
        </div>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-semibold text-slate-900">Upcoming Events</h3>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
            Updated daily
          </span>
        </div>
        {loading ? (
          <Loader label="Loading events..." />
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activities.slice(0, 3).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-semibold">Recommended for you</h3>
          <FiStar className="text-green-400" />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {activities.slice(2, 4).map((activity) => (
            <div key={activity.id} className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-semibold">{activity.title}</p>
              <p className="mt-1 text-xs text-slate-300">{activity.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default StudentDashboard
