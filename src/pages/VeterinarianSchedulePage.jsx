import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getVeterinarianScheduleRequest } from "../api/appointment";
import { FiCalendar, FiClock, FiUser, FiEdit } from "react-icons/fi";
import { MdPets } from "react-icons/md";
import RegisterAttentionModal from "../components/RegisterAttentionModal";

const VeterinarianSchedulePage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isAttentionModalOpen, setIsAttentionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Verificar que el usuario es veterinario
  useEffect(() => {
    if (currentUser?.role !== "veterinarian") {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // Cargar agenda cuando cambia la fecha
  useEffect(() => {
    loadSchedule(selectedDate);
  }, [selectedDate]);

  const loadSchedule = async (fecha) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getVeterinarianScheduleRequest(fecha);

      if (res.data && res.data.success) {
        setSchedule(res.data.data || []);
      }
    } catch (err) {
      console.error("Error loading schedule:", err);
      setError(
        err.response?.data?.message || "Error al cargar la agenda"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pendiente: "bg-amber-100 text-amber-700 border-amber-200",
      confirmada: "bg-sky-100 text-sky-700 border-sky-200",
      completada: "bg-emerald-100 text-emerald-700 border-emerald-200",
      cancelada: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return badges[status] || badges.pendiente;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendiente: "Pendiente",
      confirmada: "Confirmada",
      completada: "Completada",
      cancelada: "Cancelada",
    };
    return labels[status] || status;
  };

  const handleAttendAppointment = (appointment) => {
    // Redirigir a la nueva página de atención médica
    navigate(`/appointments/${appointment.appointmentId}/medical-attention`);
  };

  const handleAttentionSuccess = () => {
    loadSchedule(selectedDate);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
            <FiCalendar className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Mi Programación
            </h1>
            <p className="text-slate-600">
              Consulta tus citas programadas por fecha
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">
              Seleccionar fecha:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <span className="text-sm text-slate-600">
              {schedule.length} cita{schedule.length !== 1 ? "s" : ""} programada
              {schedule.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Cargando agenda...</p>
        </div>
      ) : schedule.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCalendar className="text-slate-400 text-2xl" />
          </div>
          <p className="text-slate-600 mb-2">
            No tienes citas programadas para esta fecha
          </p>
          <p className="text-slate-500 text-sm">
            Selecciona otra fecha para ver tu programación
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Mascota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedule.map((appointment) => (
                  <tr
                    key={appointment.appointmentId}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-900 font-medium">
                        <FiClock className="text-sky-600" />
                        {appointment.hora.substring(0, 5)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <MdPets className="text-emerald-600 text-sm" />
                        </div>
                        <span className="text-slate-900 font-medium">
                          {appointment.petName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-700">
                        <FiUser className="text-slate-400" />
                        {appointment.clientName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700 max-w-xs truncate">
                        {appointment.motivo}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                          appointment.status
                        )}`}
                      >
                        {getStatusLabel(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.status !== "completada" &&
                        appointment.status !== "cancelada" && (
                          <button
                            onClick={() => handleAttendAppointment(appointment)}
                            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors"
                          >
                            <FiEdit className="w-4 h-4" />
                            Atender
                          </button>
                        )}
                      {appointment.status === "completada" && (
                        <span className="text-emerald-600 text-sm font-medium">
                          Atendida
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register Attention Modal */}
      <RegisterAttentionModal
        isOpen={isAttentionModalOpen}
        onClose={() => setIsAttentionModalOpen(false)}
        appointment={selectedAppointment}
        onSuccess={handleAttentionSuccess}
      />
    </div>
  );
};

export default VeterinarianSchedulePage;
