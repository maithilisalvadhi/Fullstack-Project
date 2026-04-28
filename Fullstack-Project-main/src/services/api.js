import axios from "axios";

const BASE_URL = "https://railway.com/project/3e23a881-d040-4a15-9a8a-eff0191cd765?environmentId=5310bd9e-c63e-4a39-a834-c2afda1abcf0";

export const api = {
  getActivities: () => axios.get(`${BASE_URL}/activities`),

  getActivityById: (id) =>
    axios.get(`${BASE_URL}/activities/${id}`),

  createActivity: (data) =>
    axios.post(`${BASE_URL}/activities`, data),

  updateActivity: (id, data) =>
    axios.put(`${BASE_URL}/activities/${id}`, data),

  deleteActivity: (id) =>
    axios.delete(`${BASE_URL}/activities/${id}`),

  getRegistrations: () =>
    axios.get(`${BASE_URL}/registrations`),

  registerForActivity: (data) =>
    axios.post(`${BASE_URL}/registrations`, data),

  cancelRegistration: (id) =>
    axios.delete(`${BASE_URL}/registrations/${id}`),

  getNotifications: () =>
    axios.get(`${BASE_URL}/notifications`),

  sendNotification: (data) =>
    axios.post(`${BASE_URL}/notifications`, data),
};