import { NavLink } from "react-router-dom"

function Sidebar({ title, subtitle, links }) {
  return (
    <aside className="flex h-full flex-col gap-6 rounded-3xl bg-slate-900 px-6 py-8 text-white shadow-soft">
      <div>
        <h2 className="text-2xl font-display font-semibold">{title}</h2>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{subtitle}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800",
              ].join(" ")
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="rounded-2xl bg-slate-800/70 p-4 text-xs text-slate-300">
        <p className="font-semibold text-white">Need help?</p>
        <p className="mt-1 text-slate-400">support@campus.com</p>
      </div>
    </aside>
  )
}

export default Sidebar
