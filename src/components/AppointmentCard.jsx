import { formatDate, formatTime, isToday, isUpcoming } from "../utils/appointmentUtils";
import "../styles/AppointmentCard.css";

const AppointmentCard = ({ appointment }) => {
  const {
    appointmentId,
    fecha,
    hora,
    motivo,
    status,
    petName,
    veterinarianName,
  } = appointment;

  const showTodayBadge = isToday(fecha);
  const showUpcomingIndicator = isUpcoming(fecha, hora);

  return (
    <div className="appointment-card">
      {showUpcomingIndicator && <div className="appointment-upcoming-indicator" />}

      <div className="appointment-card-header">
        <div className="appointment-date-time">
          <div className="appointment-date">
            <span>📅</span>
            {formatDate(fecha)}
          </div>
          <div className="appointment-time">
            <span>🕐</span>
            {formatTime(hora)}
          </div>
        </div>
        <span className={`appointment-status-badge ${status}`}>
          {status}
        </span>
      </div>

      <div className="appointment-card-body">
        <div className="appointment-info-row">
          <span className="appointment-info-icon">🐾</span>
          <span className="appointment-info-label">Mascota:</span>
          <span className="appointment-info-value">{petName}</span>
        </div>

        <div className="appointment-info-row">
          <span className="appointment-info-icon">👨‍⚕️</span>
          <span className="appointment-info-label">Veterinario:</span>
          <span className="appointment-info-value">{veterinarianName}</span>
        </div>

        <div className="appointment-motivo">
          <div className="appointment-motivo-label">Motivo de la cita</div>
          <div className="appointment-motivo-text">{motivo}</div>
        </div>
      </div>

      <div className="appointment-card-footer">
        <span className="appointment-id">Cita #{appointmentId}</span>
        {showTodayBadge && (
          <div className="appointment-today-badge">
            <span>⭐</span>
            Hoy
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
