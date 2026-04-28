import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FiArrowLeft, FiCalendar, FiMapPin, FiUsers } from "react-icons/fi"
import { api } from "../../services/api.js"
import Loader from "../../components/Loader.jsx"
import { useToast } from "../../context/ToastContext.jsx"
import { useAuth } from "../../context/AuthContext.jsx"

function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { user } = useAuth()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getActivityById(id).then((response) => {
      setActivity(response.data)
      setLoading(false)
    })
  }, [id])

  const handleRegister = async () => {
    await api.registerForActivity({ activityId: activity.id, student: user?.name })
    addToast("Registration confirmed!", "success")
    navigate("/student/my-activities")
  }

  if (loading) return <Loader label="Loading event details..." />

  if (!activity) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-sm text-slate-500">Event not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
      >
        <FiArrowLeft /> Back to activities
      </button>

      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              {activity.category}
            </span>
            <h2 className="mt-3 text-2xl font-display font-semibold text-slate-900">{activity.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{activity.description}</p>
          </div>
          <button
            type="button"
            onClick={handleRegister}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-indigo-500"
          >
            Register Now
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 p-4">
            <FiCalendar className="text-indigo-500" />
            <p className="mt-2 text-sm font-semibold text-slate-900">{activity.date}</p>
            <p className="text-xs text-slate-400">{activity.time}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4">
            <FiMapPin className="text-green-500" />
            <p className="mt-2 text-sm font-semibold text-slate-900">{activity.location}</p>
            <p className="text-xs text-slate-400">Campus venue</p>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4">
            <FiUsers className="text-indigo-500" />
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {activity.seatsLeft} seats left
            </p>
            <p className="text-xs text-slate-400">Capacity {activity.capacity}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
