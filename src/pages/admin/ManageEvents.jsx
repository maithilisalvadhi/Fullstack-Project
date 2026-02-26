import { useEffect, useState } from "react"
import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi"
import { api } from "../../services/api.js"
import Loader from "../../components/Loader.jsx"
import { useToast } from "../../context/ToastContext.jsx"

function ManageEvents() {
  const { addToast } = useToast()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

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

  const handleDelete = async (id) => {
    await api.deleteActivity(id)
    addToast("Activity removed.", "info")
    fetchActivities()
  }

  const filtered = activities.filter((activity) =>
    `${activity.title} ${activity.category} ${activity.location}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-900">Manage Events</h2>
          <p className="text-sm text-slate-500">Search, edit, or remove campus activities.</p>
        </div>
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
      </div>

      {loading ? (
        <Loader label="Loading events..." />
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-slate-400">
                <th className="pb-3">Event</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Seats</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((activity) => (
                <tr key={activity.id} className="text-slate-600">
                  <td className="py-3">
                    <p className="font-semibold text-slate-900">{activity.title}</p>
                    <p className="text-xs text-slate-400">{activity.location}</p>
                  </td>
                  <td className="py-3">{activity.date}</td>
                  <td className="py-3">{activity.category}</td>
                  <td className="py-3">
                    {activity.seatsLeft}/{activity.capacity}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => addToast("Edit mode coming soon.", "info")}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(activity.id)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-rose-200 hover:text-rose-500"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageEvents
