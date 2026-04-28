import { useEffect, useMemo, useState } from "react"
import { api } from "../../services/api.js"
import Loader from "../../components/Loader.jsx"

const statuses = ["All", "Confirmed", "Waitlist", "Cancelled"]

function Participation() {
  const [registrations, setRegistrations] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("All")

  useEffect(() => {
    Promise.all([api.getRegistrations(), api.getActivities()]).then(([regs, acts]) => {
      setRegistrations(regs.data)
      setActivities(acts.data)
      setLoading(false)
    })
  }, [])

  const rows = useMemo(() => {
    const activityMap = new Map(activities.map((activity) => [activity.id, activity]))
    return registrations.map((registration) => ({
      ...registration,
      activity: activityMap.get(registration.activityId),
    }))
  }, [registrations, activities])

  const filtered = rows.filter((row) =>
    statusFilter === "All" ? true : row.status === statusFilter
  )

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-900">Participation</h2>
          <p className="text-sm text-slate-500">
            Track student registrations and attendance status.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 focus:border-indigo-500 focus:outline-none"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading participation..." />
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-slate-400">
                <th className="pb-3">Student</th>
                <th className="pb-3">Activity</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td className="py-3 font-semibold text-slate-900">{row.student}</td>
                  <td className="py-3">
                    <p className="text-slate-700">{row.activity?.title}</p>
                    <p className="text-xs text-slate-400">{row.activity?.location}</p>
                  </td>
                  <td className="py-3 text-slate-600">{row.activity?.date}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.status === "Confirmed"
                          ? "bg-green-100 text-green-600"
                          : row.status === "Waitlist"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {row.status}
                    </span>
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

export default Participation
