import { FiCheckCircle, FiInfo, FiXCircle } from "react-icons/fi"
import { useToast } from "../context/ToastContext.jsx"

const icons = {
  success: <FiCheckCircle className="text-green-500" />,
  error: <FiXCircle className="text-rose-500" />,
  info: <FiInfo className="text-indigo-500" />,
}

function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="pointer-events-none fixed right-6 top-6 z-50 flex w-[300px] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-white p-4 text-sm shadow-soft"
        >
          <span className="mt-1 text-lg">{icons[toast.type]}</span>
          <div>
            <p className="font-semibold text-slate-900 capitalize">{toast.type}</p>
            <p className="text-slate-600">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
