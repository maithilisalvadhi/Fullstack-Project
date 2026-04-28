import { useEffect, useState } from "react"
import { FiFilter, FiSearch } from "react-icons/fi"
import ActivityCard from "../../components/ActivityCard.jsx"
import Loader from "../../components/Loader.jsx"
import { api } from "../../services/api.js"
import { useToast } from "../../context/ToastContext.jsx"
import { useAuth } from "../../context/AuthContext.jsx"

const categories = ["All", "Club", "Sports", "Event"]

function BrowseActivities() {
  const { addToast } = useToast()
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")

  const fetchActivities = () => {
    setLoading(true)
    api.getActivities().then((response) => {
      setActivities(response.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const handleRegister = async (activity) => {
    await api.registerForActivity({ activityId: activity.id, student: user?.name })
    addToast("You are registered for the event!", "success")
    fetchActivities()
  }

  const filtered = activities.filter((activity) => {
    const matchesQuery = `${activity.title} ${activity.description}`
      .toLowerCase()
      .includes(query.toLowerCase())
    const matchesCategory = category === "All" ? true : activity.category === category
    return matchesQuery && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-display font-semibold text-slate-900">Browse Activities</h2>
            <p className="text-sm text-slate-500">Search clubs, sports, and events.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <FiSearch className="text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search activities"
                className="w-full text-sm text-slate-700 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <FiFilter className="text-slate-400" />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="bg-transparent text-sm text-slate-600 focus:outline-none"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading activities..." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onAction={handleRegister}
              actionLabel="Register Now"
              detailsLink={`/student/event/${activity.id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BrowseActivities
