import { useEffect, useState } from "react";
import "../styles/appointments.css"

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setErrors(null);

        const res = await fetch("http://localhost:3003/appointments");
        if (!res.ok) throw new Error("Error al obtener citas");
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setErrors("No se pudieron cargar las citas.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="appointments-page">
      <div className="appointments-page-container">
        <div className="appointments-page-header">
          <div>
            <h1 className="appointments-page-title">Gestión de Citas</h1>
            <p className="appointments-page-subtitle">
              Administra las citas registradas en el sistema VetCore
            </p>
          </div>
        </div>

        <div className="appointments-page-content">
          <div className="appointments-page-actions">
            <div style={{ color: "#4a5568" }}>
              <strong>Total de citas:</strong> {appointments.length}
            </div>
            <button
              className="btn-create-appointment"
              onClick={() => alert("Abrir modal para crear cita")}
              disabled={loading}
            >
              <span style={{ fontSize: "1.25rem" }}>+</span>
              Registrar Nueva Cita
            </button>
          </div>

          {errors && (
            <div className="error-container">
              <div className="error-message">{errors}</div>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p style={{ marginTop: "1rem", color: "#718096" }}>
                Cargando citas...
              </p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="no-appointments-message">
              <p>No hay citas registradas en el sistema.</p>
              <p>Haz clic en "Registrar Nueva Cita" para agregar una.</p>
            </div>
          ) : (
            <div className="appointments-table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Motivo</th>
                    <th>Mascota</th>
                    <th>Cliente</th>
                    <th>Veterinario</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.appointmentId}>
                      <td>{a.appointmentId}</td>
                      <td>{a.fecha}</td>
                      <td>{a.hora}</td>
                      <td>{a.motivo}</td>
                      <td>{a.petId}</td>
                      <td>{a.clientId}</td>
                      <td>{a.veterinarianId}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            a.status === "pendiente"
                              ? "pending"
                              : a.status === "completada"
                              ? "completed"
                              : "canceled"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
