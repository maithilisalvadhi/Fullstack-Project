import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiMail, FiUser, FiLock } from "react-icons/fi"
import { useAuth } from "../../context/AuthContext.jsx"
import { useToast } from "../../context/ToastContext.jsx"

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { addToast } = useToast()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const result = await register(form)
    setLoading(false)
    if (result.ok) {
      addToast("Account created successfully!", "success")
      navigate("/student/dashboard")
    } else {
      addToast(result.message, "error")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-soft">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-semibold text-slate-900">Create Student Account</h1>
          <p className="text-sm text-slate-600">
            Join campus clubs, register for events, and track participation.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <FiUser className="text-slate-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
                placeholder="Jordan Lee"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <FiMail className="text-slate-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
                placeholder="you@campus.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <FiLock className="text-slate-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
                placeholder="••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-500 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
