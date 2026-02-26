import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiLock, FiMail, FiShield } from "react-icons/fi"
import { useAuth } from "../../context/AuthContext.jsx"
import { useToast } from "../../context/ToastContext.jsx"

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "admin", label: "Admin" },
]

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const result = await login(form)
    setLoading(false)
    if (result.ok) {
      addToast("Welcome back to Campus Activity Hub!", "success")
      navigate(form.role === "admin" ? "/admin/dashboard" : "/student/dashboard")
    } else {
      addToast(result.message, "error")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl gap-8 rounded-3xl bg-white p-8 shadow-soft md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold text-indigo-700">
            <FiShield />
            Secure Login
          </div>
          <h1 className="text-3xl font-display font-semibold text-slate-900">Campus Activity Hub</h1>
          <p className="text-slate-600">
            Manage clubs, sports, and campus events from a single place. Log in with your role to
            get started.
          </p>
          <div className="rounded-2xl bg-slate-900 p-6 text-slate-100">
            <p className="text-sm uppercase tracking-widest text-slate-400">Demo credentials</p>
            <div className="mt-4 space-y-2 text-sm">
              <p>Admin: admin@campus.com / 123456</p>
              <p>Student: student@campus.com / 123456</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700">Role</label>
            <div className="mt-2 flex gap-2">
              {roleOptions.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, role: role.value }))}
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    form.role === role.value
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 text-slate-600 hover:border-indigo-200"
                  }`}
                >
                  {role.label}
                </button>
              ))}
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
                placeholder="you@campus.com"
                className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
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
                placeholder="••••••"
                className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-500 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-sm text-slate-500">
            New here?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Create an account
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
