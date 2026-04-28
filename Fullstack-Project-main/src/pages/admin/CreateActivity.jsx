import { useState } from "react"
import { api } from "../../services/api.js"
import { useToast } from "../../context/ToastContext.jsx"

const categories = ["Club", "Sports", "Event"]
const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"]

const initialForm = {
  title: "",
  description: "",
  category: "Club",
  level: "All Levels",
  date: "",
  time: "",
  capacity: 25,
  location: "",
}

function CreateActivity() {
  const { addToast } = useToast()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = "Title is required."
    if (!form.description.trim()) nextErrors.description = "Description is required."
    if (!form.date) nextErrors.date = "Date is required."
    if (!form.time) nextErrors.time = "Time is required."
    if (!form.location.trim()) nextErrors.location = "Location is required."
    if (Number(form.capacity) < 5) nextErrors.capacity = "Capacity must be at least 5."
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setLoading(true)
    await api.createActivity({
      ...form,
      date: new Date(form.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    })
    setLoading(false)
    setForm(initialForm)
    addToast("Activity created successfully.", "success")
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <h2 className="text-xl font-display font-semibold text-slate-900">Create New Activity</h2>
      <p className="mt-2 text-sm text-slate-500">
        Add new clubs, sports sessions, or campus events for students.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Activity title"
          />
          {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Brief description of the activity"
          />
          {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Level</label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Time</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          {errors.time && <p className="mt-1 text-xs text-rose-500">{errors.time}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            min="5"
          />
          {errors.capacity && <p className="mt-1 text-xs text-rose-500">{errors.capacity}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Building or hall"
          />
          {errors.location && <p className="mt-1 text-xs text-rose-500">{errors.location}</p>}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-500 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Activity"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateActivity
