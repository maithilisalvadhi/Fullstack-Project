import { FiCalendar, FiUsers } from "react-icons/fi"
import { Link } from "react-router-dom"

function ActivityCard({ activity, onAction, actionLabel, detailsLink }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            {activity.category}
          </span>
          <span className="text-xs uppercase tracking-widest text-slate-400">{activity.level}</span>
        </div>
        <h3 className="mt-4 text-lg font-display font-semibold text-slate-900">{activity.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{activity.description}</p>
      </div>
      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FiCalendar className="text-indigo-500" />
          {activity.date} • {activity.time}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FiUsers className="text-green-500" />
          {activity.seatsLeft} seats left / {activity.capacity}
        </div>
        <div className="flex flex-col gap-2">
          {detailsLink && (
            <Link
              to={detailsLink}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
            >
              View Details
            </Link>
          )}
          {onAction && (
            <button
              type="button"
              onClick={() => onAction(activity)}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityCard
