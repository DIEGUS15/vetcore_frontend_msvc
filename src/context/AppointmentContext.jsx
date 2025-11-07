import { createContext, useState, useContext } from "react";
import {
  getAppointmentsRequest,
  createAppointmentRequest,
  getVeterinariansRequest,
} from "../api/appointment.js";
import { getSchedule } from "../api/schedule";
import { useAuth } from "./AuthContext";

const AppointmentContext = createContext();

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointment must be used within an AppointmentProvider");
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [filters, setFilters] = useState({
    status: null,
    includeInactive: false,
  });

  /**
   * Get all appointments for the authenticated client
   * @param {Object} params - Query parameters
   * @param {string} [params.status] - Filter by status
   * @param {boolean} [params.includeInactive] - Include inactive appointments
   */
  const getAppointments = async (params = {}) => {
    try {
      setLoading(true);
      setErrors(null);

      // Merge params with current filters
      const queryParams = { ...filters, ...params };

      let res;

      // If the authenticated user is a veterinarian, fetch schedule from schedule service
      if (user?.role === "veterinarian") {
        try {
          const scheduleData = await getSchedule(user.id);
          // scheduleData may be an array or an object with items
          const items = Array.isArray(scheduleData)
            ? scheduleData
            : scheduleData?.items || scheduleData?.data || [];

          // Map schedule items to the appointment shape expected by the UI
          const mapped = items.map((it) => ({
            appointmentId: it.appointmentId || it.id,
            fecha: it.date || it.fecha,
            hora: it.slotTime || it.hora,
            motivo: it.reason || it.motivo,
            status: (it.status || "").toLowerCase(),
            petName: it.petName || it.pet || "-",
            veterinarianName: user.fullname || "",
          }));

          setAppointments(mapped || []);
          return { data: mapped };
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Error al obtener el horario del veterinario";
          setErrors(errorMessage);
          console.error("Error fetching schedule for veterinarian:", error);
          throw error;
        }
      }

      // Default: call appointments service
      res = await getAppointmentsRequest(queryParams);

      if (res.data) {
        setAppointments(res.data.data || []);
        // Update filters if params were provided
        if (Object.keys(params).length > 0) {
          setFilters(queryParams);
        }
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener las citas";
      setErrors(errorMessage);
      console.error("Error fetching appointments:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment data
   * @param {string} appointmentData.fecha - Date (YYYY-MM-DD)
   * @param {string} appointmentData.hora - Time (HH:MM)
   * @param {string} appointmentData.motivo - Reason
   * @param {number} appointmentData.petId - Pet ID
   * @param {number} appointmentData.veterinarianId - Veterinarian ID
   */
  const createAppointment = async (appointmentData) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await createAppointmentRequest(appointmentData);

      if (res.data && res.data.success) {
        // Refresh appointments list after creating
        await getAppointments(filters);
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al crear la cita";
      setErrors(errorMessage);
      console.error("Error creating appointment:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get list of available veterinarians
   */
  const getVeterinarians = async () => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await getVeterinariansRequest();

      if (res.data) {
        // Extract veterinarians array from response
        const vets = res.data.data?.veterinarians || res.data.veterinarians || [];
        setVeterinarians(vets);
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener veterinarios";
      setErrors(errorMessage);
      console.error("Error fetching veterinarians:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter appointments by status
   * @param {string|null} status - Status to filter by (pendiente, confirmada, completada, cancelada)
   */
  const filterByStatus = async (status) => {
    await getAppointments({ ...filters, status });
  };

  /**
   * Toggle include inactive appointments
   */
  const toggleIncludeInactive = async () => {
    const newIncludeInactive = !filters.includeInactive;
    await getAppointments({ ...filters, includeInactive: newIncludeInactive });
  };

  /**
   * Clear all filters
   */
  const clearFilters = async () => {
    const defaultFilters = {
      status: null,
      includeInactive: false,
    };
    setFilters(defaultFilters);
    await getAppointments(defaultFilters);
  };

  /**
   * Clear errors
   */
  const clearErrors = () => {
    setErrors(null);
  };

  /**
   * Get appointment statistics
   */
  const getAppointmentStats = () => {
    const total = appointments.length;
    const pendientes = appointments.filter((apt) => apt.status === "pendiente").length;
    const confirmadas = appointments.filter((apt) => apt.status === "confirmada").length;
    const completadas = appointments.filter((apt) => apt.status === "completada").length;
    const canceladas = appointments.filter((apt) => apt.status === "cancelada").length;

    return {
      total,
      pendientes,
      confirmadas,
      completadas,
      canceladas,
    };
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        veterinarians,
        loading,
        errors,
        filters,
        getAppointments,
        createAppointment,
        getVeterinarians,
        filterByStatus,
        toggleIncludeInactive,
        clearFilters,
        clearErrors,
        getAppointmentStats,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
