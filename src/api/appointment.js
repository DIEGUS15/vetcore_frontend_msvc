import axiosInstance from "./axios.js";

/**
 * Get all appointments for the authenticated client
 * @param {Object} params - Query parameters
 * @param {string} [params.status] - Filter by status (pendiente, confirmada, completada, cancelada)
 * @param {boolean} [params.includeInactive] - Include inactive appointments
 * @returns {Promise} - Promise with appointments data
 */
export const getAppointmentsRequest = (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.status) {
    queryParams.append("status", params.status);
  }

  if (params.includeInactive) {
    queryParams.append("includeInactive", "true");
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/appointments?${queryString}` : "/appointments";

  return axiosInstance.get(url);
};

/**
 * Create a new appointment
 * @param {Object} appointmentData - Appointment data
 * @param {string} appointmentData.fecha - Appointment date (YYYY-MM-DD)
 * @param {string} appointmentData.hora - Appointment time (HH:MM or HH:MM:SS)
 * @param {string} appointmentData.motivo - Reason for appointment
 * @param {number} appointmentData.petId - Pet ID
 * @param {number} appointmentData.veterinarianId - Veterinarian ID
 * @returns {Promise} - Promise with created appointment data
 */
export const createAppointmentRequest = (appointmentData) =>
  axiosInstance.post("/appointments", appointmentData);

/**
 * Get veterinarian schedule for a specific date
 * @param {string} fecha - Date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise} - Promise with veterinarian schedule data
 */
export const getVeterinarianScheduleRequest = (fecha = null) => {
  const queryParams = fecha ? `?fecha=${fecha}` : "";
  return axiosInstance.get(`/appointments/veterinarian/schedule${queryParams}`);
};

/**
 * Get veterinarians from Auth Service
 * This will be used to populate the veterinarian dropdown when creating an appointment
 * @returns {Promise} - Promise with veterinarians data
 */
export const getVeterinariansRequest = () =>
  axiosInstance.get("/users/veterinarians/list");

/**
 * Update appointment attention (procedure, diagnosis, indications)
 * @param {number} appointmentId - Appointment ID
 * @param {Object} attentionData - Attention data
 * @param {string} [attentionData.procedimiento] - Procedure performed
 * @param {string} [attentionData.diagnostico] - Diagnosis
 * @param {string} [attentionData.indicaciones] - Indications to follow
 * @returns {Promise} - Promise with updated appointment data
 */
export const updateAppointmentAttentionRequest = (appointmentId, attentionData) =>
  axiosInstance.put(`/appointments/${appointmentId}/attention`, attentionData);
