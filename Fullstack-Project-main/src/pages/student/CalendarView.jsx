import { useEffect, useMemo, useState } from "react"
import { api } from "../../services/api.js"
import { useAuth } from "../../context/AuthContext.jsx"
import Loader from "../../components/Loader.jsx"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const buildCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  const startOffset = firstDay.getDay()

  for (let i = 0; i < startOffset; i += 1) {
    days.push(null)
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day))
  }

  return days
}

function CalendarView() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getRegistrations(), api.getActivities()]).then(([regs, acts]) => {
      setRegistrations(regs.data)
      setActivities(acts.data)
      setLoading(false)
    })
  }, [])

  const eventDays = useMemo(() => {
    const activityMap = new Map(activities.map((activity) => [activity.id, activity]))
    const dates = registrations
      .filter((registration) => registration.student === user?.name)
      .map((registration) => activityMap.get(registration.activityId))
      .filter(Boolean)
      .map((activity) => new Date(activity.date))
    return new Set(dates.map((date) => date.toDateString()))
  }, [registrations, activities, user])

  const today = new Date()
  const days = buildCalendar(today.getFullYear(), today.getMonth())

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-900">Calendar View</h2>
          <p className="text-sm text-slate-500">Your registered events highlighted in green.</p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
      </div>

      {loading ? (
        <Loader label="Loading calendar..." />
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-widest text-slate-400">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="h-16" />
              }
              const isToday = date.toDateString() === today.toDateString()
              const isEvent = eventDays.has(date.toDateString())
              return (
                <div
                  key={date.toISOString()}
                  className={`flex h-16 flex-col items-center justify-center rounded-2xl border text-sm ${
                    isEvent
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-slate-100 text-slate-600"
                  } ${isToday ? "ring-2 ring-indigo-400" : ""}`}
                >
                  {date.getDate()}
                  {isEvent && <span className="text-[10px] font-semibold">Event</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarView
