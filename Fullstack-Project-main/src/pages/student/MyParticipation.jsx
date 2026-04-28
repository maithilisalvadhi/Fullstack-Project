import { useEffect, useMemo, useState } from "react"
import { api } from "../../services/api.js"
import Loader from "../../components/Loader.jsx"
import { useAuth } from "../../context/AuthContext.jsx"
import { useToast } from "../../context/ToastContext.jsx"

function MyParticipation() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [registrations, setRegistrations] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)
    Promise.all([api.getRegistrations(), api.getActivities()]).then(([regs, acts]) => {
      setRegistrations(regs.data)
      setActivities(acts.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const rows = useMemo(() => {
    const activityMap = new Map(activities.map((activity) => [activity.id, activity]))
    return registrations
      .filter((registration) => registration.student === user?.name)
      .map((registration) => ({
        ...registration,
        activity: activityMap.get(registration.activityId),
      }))
  }, [registrations, activities, user])

  const handleCancel = async (id) => {
    await api.cancelRegistration(id)
    addToast("Registration cancelled.", "info")
    fetchData()
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-900">My Participation</h2>
          <p className="text-sm text-slate-500">Track your registered events.</p>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading participation..." />
      ) : rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
          You have not registered for any activities yet.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{row.activity?.title}</p>
                <p className="text-xs text-slate-400">
                  {row.activity?.date} • {row.activity?.location}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                  {row.status}
                </span>
                <button
                  type="button"
                  onClick={() => handleCancel(row.id)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-rose-200 hover:text-rose-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyParticipation
