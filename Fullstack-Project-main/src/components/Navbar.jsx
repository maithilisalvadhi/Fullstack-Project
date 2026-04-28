import { FiBell, FiLogOut } from "react-icons/fi"
import { useAuth } from "../context/AuthContext.jsx"

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between rounded-2xl bg-white/80 px-6 py-4 shadow-soft backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Campus Activity Hub</p>
        <h1 className="text-2xl font-display font-semibold text-slate-900">Welcome back, {user?.name}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-full border border-slate-200 p-2 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition"
        >
          <FiBell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-green-500" />
        </button>
        <div className="hidden text-right md:block">
          <p className="text-sm font-semibold text-slate-900">{user?.email}</p>
          <p className="text-xs uppercase tracking-widest text-slate-400">{user?.role}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-indigo-500 transition"
        >
          <FiLogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
