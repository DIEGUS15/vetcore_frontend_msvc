import { useAppointment } from "../context/AppointmentContext";
import AppointmentCard from "./AppointmentCard";
import "../styles/AppointmentList.css";

const AppointmentList = ({ onCreateClick }) => {
  const { appointments, loading, errors, getAppointments } = useAppointment();

  const handleRetry = () => {
    getAppointments();
  };

  if (loading) {
    return (
      <div className="appointments-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando citas...</p>
      </div>
    );
  }

  if (errors) {
    return (
      <div className="appointments-error">
        <h3 className="error-title">
          <span>⚠️</span>
          Error al cargar las citas
        </h3>
        <p className="error-message">{errors}</p>
        <button className="error-retry-btn" onClick={handleRetry}>
          Reintentar
        </button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="appointments-empty">
        <div className="empty-icon">📅</div>
        <h3 className="empty-title">No tienes citas agendadas</h3>
        <p className="empty-description">
          Aún no has agendado ninguna cita para tus mascotas. <br />
          ¡Comienza agendando tu primera cita!
        </p>
        {onCreateClick && (
          <button className="empty-action-btn" onClick={onCreateClick}>
            <span>➕</span>
            Agendar Primera Cita
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="appointment-list-container">
      <div className="appointments-count">
        Mostrando{" "}
        <span className="appointments-count-number">{appointments.length}</span>{" "}
        {appointments.length === 1 ? "cita" : "citas"}
      </div>
      <div className="appointments-grid">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
        ))}
      </div>
    </div>
  );
};

export default AppointmentList;
