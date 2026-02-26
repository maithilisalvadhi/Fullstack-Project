import axios from "axios"

const sleep = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock Axios adapter so we can keep an Axios-based API without a real backend.
const mockRequest = (data, delay) =>
  axios({
    adapter: async (config) => {
      await sleep(delay)
      return {
        data,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      }
    },
  })

const STORAGE_KEYS = {
  activities: "cah_activities",
  registrations: "cah_registrations",
  notifications: "cah_notifications",
}

const seedActivities = [
  {
    id: "act-1",
    title: "Robotics Club Showcase",
    description: "Showcase intelligent robotics projects and demos.",
    category: "Club",
    level: "Beginner",
    date: "Mar 12, 2026",
    time: "5:00 PM",
    capacity: 40,
    seatsLeft: 12,
    location: "Innovation Lab",
  },
  {
    id: "act-2",
    title: "Campus Marathon Training",
    description: "Weekly training session for the campus marathon.",
    category: "Sports",
    level: "Intermediate",
    date: "Mar 18, 2026",
    time: "6:30 AM",
    capacity: 60,
    seatsLeft: 26,
    location: "Athletics Field",
  },
  {
    id: "act-3",
    title: "Art & Design Hackathon",
    description: "A 24-hour creative sprint for designers and makers.",
    category: "Event",
    level: "All Levels",
    date: "Mar 22, 2026",
    time: "10:00 AM",
    capacity: 80,
    seatsLeft: 41,
    location: "Studio Hall",
  },
  {
    id: "act-4",
    title: "Women in Leadership Panel",
    description: "Panel discussion with industry leaders and alumni.",
    category: "Event",
    level: "All Levels",
    date: "Mar 27, 2026",
    time: "4:30 PM",
    capacity: 120,
    seatsLeft: 75,
    location: "Main Auditorium",
  },
  {
    id: "act-5",
    title: "Green Campus Volunteer Drive",
    description: "Tree planting and sustainability initiatives.",
    category: "Club",
    level: "Beginner",
    date: "Apr 1, 2026",
    time: "3:00 PM",
    capacity: 50,
    seatsLeft: 20,
    location: "North Lawn",
  },
]

const seedRegistrations = [
  {
    id: "reg-1",
    activityId: "act-1",
    student: "Ava Thompson",
    status: "Confirmed",
  },
  {
    id: "reg-2",
    activityId: "act-3",
    student: "Lucas Martinez",
    status: "Waitlist",
  },
]

const seedNotifications = [
  {
    id: "noti-1",
    title: "Welcome to Campus Activity Hub!",
    message: "Explore clubs, sports, and events curated for you.",
    audience: "student",
    date: "Feb 20, 2026",
    status: "unread",
  },
  {
    id: "noti-2",
    title: "Admin Reminder",
    message: "Review participation metrics before Friday.",
    audience: "admin",
    date: "Feb 24, 2026",
    status: "read",
  },
]

// Seed localStorage once for a consistent demo experience.
const loadOrSeed = (key, seed) => {
  const stored = localStorage.getItem(key)
  if (stored) return JSON.parse(stored)
  localStorage.setItem(key, JSON.stringify(seed))
  return seed
}

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const api = {
  getActivities: async () => {
    const activities = loadOrSeed(STORAGE_KEYS.activities, seedActivities)
    return mockRequest(activities)
  },
  getActivityById: async (id) => {
    const activities = loadOrSeed(STORAGE_KEYS.activities, seedActivities)
    const activity = activities.find((item) => item.id === id)
    return mockRequest(activity)
  },
  createActivity: async (payload) => {
    const activities = loadOrSeed(STORAGE_KEYS.activities, seedActivities)
    const newActivity = {
      ...payload,
      id: `act-${Date.now()}`,
      seatsLeft: payload.capacity,
    }
    const updated = [newActivity, ...activities]
    saveData(STORAGE_KEYS.activities, updated)
    return mockRequest(newActivity, 600)
  },
  updateActivity: async (id, payload) => {
    const activities = loadOrSeed(STORAGE_KEYS.activities, seedActivities)
    const updated = activities.map((activity) =>
      activity.id === id ? { ...activity, ...payload } : activity
    )
    saveData(STORAGE_KEYS.activities, updated)
    return mockRequest(updated.find((activity) => activity.id === id))
  },
  deleteActivity: async (id) => {
    const activities = loadOrSeed(STORAGE_KEYS.activities, seedActivities)
    const updated = activities.filter((activity) => activity.id !== id)
    saveData(STORAGE_KEYS.activities, updated)
    return mockRequest({ ok: true })
  },
  getRegistrations: async () => {
    const registrations = loadOrSeed(STORAGE_KEYS.registrations, seedRegistrations)
    return mockRequest(registrations)
  },
  registerForActivity: async ({ activityId, student }) => {
    const registrations = loadOrSeed(STORAGE_KEYS.registrations, seedRegistrations)
    const newRegistration = {
      id: `reg-${Date.now()}`,
      activityId,
      student,
      status: "Confirmed",
    }
    const updated = [newRegistration, ...registrations]
    saveData(STORAGE_KEYS.registrations, updated)

    const activities = loadOrSeed(STORAGE_KEYS.activities, seedActivities)
    const updatedActivities = activities.map((activity) =>
      activity.id === activityId
        ? { ...activity, seatsLeft: Math.max(activity.seatsLeft - 1, 0) }
        : activity
    )
    saveData(STORAGE_KEYS.activities, updatedActivities)

    return mockRequest(newRegistration, 600)
  },
  cancelRegistration: async (registrationId) => {
    const registrations = loadOrSeed(STORAGE_KEYS.registrations, seedRegistrations)
    const registration = registrations.find((item) => item.id === registrationId)
    const updated = registrations.filter((item) => item.id !== registrationId)
    saveData(STORAGE_KEYS.registrations, updated)

    if (registration) {
      const activities = loadOrSeed(STORAGE_KEYS.activities, seedActivities)
      const updatedActivities = activities.map((activity) =>
        activity.id === registration.activityId
          ? { ...activity, seatsLeft: activity.seatsLeft + 1 }
          : activity
      )
      saveData(STORAGE_KEYS.activities, updatedActivities)
    }

    return mockRequest({ ok: true })
  },
  getNotifications: async (audience) => {
    const notifications = loadOrSeed(STORAGE_KEYS.notifications, seedNotifications)
    const filtered = notifications.filter((notification) => notification.audience === audience)
    return mockRequest(filtered)
  },
  sendNotification: async ({ title, message, audience }) => {
    const notifications = loadOrSeed(STORAGE_KEYS.notifications, seedNotifications)
    const newNotification = {
      id: `noti-${Date.now()}`,
      title,
      message,
      audience,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "unread",
    }
    const updated = [newNotification, ...notifications]
    saveData(STORAGE_KEYS.notifications, updated)
    return mockRequest(newNotification, 600)
  },
  markNotificationRead: async (id) => {
    const notifications = loadOrSeed(STORAGE_KEYS.notifications, seedNotifications)
    const updated = notifications.map((notification) =>
      notification.id === id ? { ...notification, status: "read" } : notification
    )
    saveData(STORAGE_KEYS.notifications, updated)
    return mockRequest({ ok: true })
  },
}
