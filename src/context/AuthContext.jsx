import { createContext, useContext, useEffect, useMemo, useState } from "react"

const AuthContext = createContext(null)

const ADMIN_CREDENTIALS = {
  email: "admin@campus.com",
  password: "123456",
  role: "admin",
  name: "Campus Admin",
}

const STUDENT_CREDENTIALS = {
  email: "student@campus.com",
  password: "123456",
  role: "student",
  name: "Student Member",
}

const STORAGE_KEY = "cah_user"
const STUDENT_LIST_KEY = "cah_students"

// Seed demo students for mock authentication.
const loadStudents = () => {
  const stored = localStorage.getItem(STUDENT_LIST_KEY)
  if (stored) return JSON.parse(stored)
  const seed = [
    {
      id: "stu-1",
      name: "Ava Thompson",
      email: "ava@campus.com",
      major: "Computer Science",
    },
    {
      id: "stu-2",
      name: "Lucas Martinez",
      email: "lucas@campus.com",
      major: "Business Administration",
    },
  ]
  localStorage.setItem(STUDENT_LIST_KEY, JSON.stringify(seed))
  return seed
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setUser(JSON.parse(stored))
    }
    loadStudents()
  }, [])

  const login = async ({ email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase()

    if (role === "admin") {
      if (
        normalizedEmail === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
      ) {
        const authUser = { ...ADMIN_CREDENTIALS }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
        setUser(authUser)
        return { ok: true, user: authUser }
      }
      return { ok: false, message: "Invalid admin credentials." }
    }

    if (
      normalizedEmail === STUDENT_CREDENTIALS.email &&
      password === STUDENT_CREDENTIALS.password
    ) {
      const authUser = { ...STUDENT_CREDENTIALS }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
      setUser(authUser)
      return { ok: true, user: authUser }
    }

    const students = loadStudents()
    const found = students.find((student) => student.email === normalizedEmail)
    if (!found || password.length < 4) {
      return { ok: false, message: "Invalid student credentials." }
    }

    const authUser = { ...found, role: "student" }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
    return { ok: true, user: authUser }
  }

  const register = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const students = loadStudents()
    if (students.some((student) => student.email === normalizedEmail)) {
      return { ok: false, message: "Email already registered." }
    }

    const newStudent = {
      id: `stu-${Date.now()}`,
      name,
      email: normalizedEmail,
      major: "Undeclared",
    }

    const updated = [...students, newStudent]
    localStorage.setItem(STUDENT_LIST_KEY, JSON.stringify(updated))

    if (password.length < 4) {
      return { ok: false, message: "Password must be at least 4 characters." }
    }

    const authUser = { ...newStudent, role: "student" }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
    return { ok: true, user: authUser }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
