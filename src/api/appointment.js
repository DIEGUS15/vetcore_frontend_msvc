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

  // Append any provided param to the query string
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    // For booleans, append explicit 'true'/'false'
    if (typeof value === "boolean") {
      queryParams.append(key, value ? "true" : "false");
      return;
    }
    queryParams.append(key, String(value));
  });

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
 * Get veterinarians from Auth Service
 * This will be used to populate the veterinarian dropdown when creating an appointment
 * @returns {Promise} - Promise with veterinarians data
 */
export const getVeterinariansRequest = () =>
  axiosInstance.get("/users/veterinarians/list");
