/**
 * Format date from YYYY-MM-DD to a more readable format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString + "T00:00:00");
  const options = { year: "numeric", month: "long", day: "numeric" };

  return date.toLocaleDateString("es-ES", options);
};

/**
 * Format time from HH:MM:SS to HH:MM
 * @param {string} timeString - Time string
 * @returns {string} - Formatted time
 */
export const formatTime = (timeString) => {
  if (!timeString) return "";

  const parts = timeString.split(":");
  return `${parts[0]}:${parts[1]}`;
};

/**
 * Get status badge color class
 * @param {string} status - Appointment status
 * @returns {string} - Tailwind CSS color classes
 */
export const getStatusBadgeColor = (status) => {
  const colors = {
    pendiente: "bg-yellow-100 text-yellow-800 border-yellow-300",
    confirmada: "bg-blue-100 text-blue-800 border-blue-300",
    completada: "bg-green-100 text-green-800 border-green-300",
    cancelada: "bg-red-100 text-red-800 border-red-300",
  };

  return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
};

/**
 * Get status label in Spanish
 * @param {string} status - Appointment status
 * @returns {string} - Status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    pendiente: "Pendiente",
    confirmada: "Confirmada",
    completada: "Completada",
    cancelada: "Cancelada",
  };

  return labels[status] || status;
};

/**
 * Check if appointment is upcoming (in the future)
 * @param {string} fecha - Appointment date (YYYY-MM-DD)
 * @param {string} hora - Appointment time (HH:MM:SS)
 * @returns {boolean} - True if appointment is upcoming
 */
export const isUpcoming = (fecha, hora) => {
  if (!fecha || !hora) return false;

  const appointmentDateTime = new Date(`${fecha}T${hora}`);
  const now = new Date();

  return appointmentDateTime > now;
};

/**
 * Check if appointment is today
 * @param {string} fecha - Appointment date (YYYY-MM-DD)
 * @returns {boolean} - True if appointment is today
 */
export const isToday = (fecha) => {
  if (!fecha) return false;

  const appointmentDate = new Date(fecha + "T00:00:00");
  const today = new Date();

  return (
    appointmentDate.getDate() === today.getDate() &&
    appointmentDate.getMonth() === today.getMonth() &&
    appointmentDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Get minimum date for appointment (today)
 * @returns {string} - Date in YYYY-MM-DD format
 */
export const getMinDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

/**
 * Validate appointment form data
 * @param {Object} data - Appointment form data
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export const validateAppointmentForm = (data) => {
  const errors = {};

  if (!data.fecha) {
    errors.fecha = "La fecha es requerida";
  } else {
    const selectedDate = new Date(data.fecha + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.fecha = "No se pueden agendar citas en fechas pasadas";
    }
  }

  if (!data.hora) {
    errors.hora = "La hora es requerida";
  }

  if (!data.motivo || data.motivo.trim() === "") {
    errors.motivo = "El motivo es requerido";
  } else if (data.motivo.length < 10) {
    errors.motivo = "El motivo debe tener al menos 10 caracteres";
  }

  if (!data.petId) {
    errors.petId = "Debe seleccionar una mascota";
  }

  if (!data.veterinarianId) {
    errors.veterinarianId = "Debe seleccionar un veterinario";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sort appointments by date and time
 * @param {Array} appointments - Array of appointments
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} - Sorted appointments
 */
export const sortAppointments = (appointments, order = "desc") => {
  return [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.fecha}T${a.hora}`);
    const dateB = new Date(`${b.fecha}T${b.hora}`);

    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};
