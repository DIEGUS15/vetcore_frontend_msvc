import axiosInstance from "./axios";

/**
 * Obtener citas con paginación
 */
export const getAppointmentsRequest = ({ page = 1, limit = 10 } = {}) =>
  axiosInstance.get(`/appointments?page=${page}&limit=${limit}`);

/**
 * Crear una nueva cita
 */
export const createAppointmentRequest = (appointmentData) =>
  axiosInstance.post("/appointments", appointmentData);

/**
 * Actualizar una cita existente
 */
export const updateAppointmentRequest = (id, updatedData) =>
  axiosInstance.put(`/appointments/${id}`, updatedData);

/**
 * Eliminar una cita
 */
export const deleteAppointmentRequest = (id) =>
  axiosInstance.delete(`/appointments/${id}`);
