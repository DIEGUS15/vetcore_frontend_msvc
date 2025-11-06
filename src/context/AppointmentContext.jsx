import { createContext, useContext, useState } from "react";
import {
  getAppointmentsRequest,
  createAppointmentRequest,
  updateAppointmentRequest,
  deleteAppointmentRequest,
} from "../api/appointments"; // 👈 ajusta la ruta si difiere

const AppointmentContext = createContext();

export const useAppointment = () => useContext(AppointmentContext);

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAppointments: 0,
    appointmentsPerPage: 10,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  /**
   * Obtener todas las citas con paginación
   * @param {number} page - Número de página
   * @param {number} limit - Citas por página
   */
  const getAppointments = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await getAppointmentsRequest({ page, limit });
      setAppointments(res.data.appointments || []);
      setPagination({
        currentPage: res.data.pagination?.page || page,
        totalPages: res.data.pagination?.totalPages || 1,
        totalAppointments: res.data.pagination?.total || 0,
        appointmentsPerPage: limit,
      });
    } catch (error) {
      console.error("Error al obtener citas:", error);
      setErrors(
        error.response?.data?.message || "Error al obtener las citas del servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear una nueva cita
   */
  const createAppointment = async (appointmentData) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await createAppointmentRequest(appointmentData);
      setAppointments((prev) => [res.data, ...prev]);
    } catch (error) {
      setErrors(
        error.response?.data?.message || "Error al crear la cita"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar una cita existente
   */
  const updateAppointment = async (id, updatedData) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await updateAppointmentRequest(id, updatedData);
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? res.data : appointment
        )
      );
    } catch (error) {
      setErrors(
        error.response?.data?.message || "Error al actualizar la cita"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar (o desactivar) una cita
   */
  const deleteAppointment = async (id) => {
    try {
      setLoading(true);
      setErrors(null);
      await deleteAppointmentRequest(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      setErrors(
        error.response?.data?.message || "Error al eliminar la cita"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        pagination,
        loading,
        errors,
        getAppointments,
        createAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
