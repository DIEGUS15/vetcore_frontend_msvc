import { useEffect, useState } from "react";
import { useAppointment } from "../context/AppointmentContext";
import AppointmentStats from "../components/AppointmentStats";
import AppointmentFilters from "../components/AppointmentFilters";
import AppointmentList from "../components/AppointmentList";
import CreateAppointmentModal from "../components/CreateAppointmentModal";
import "../styles/AppointmentsPage.css";

const AppointmentsPage = () => {
  const { getAppointments, loading, errors } = useAppointment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        await getAppointments();
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (initialLoading) {
    return (
      <div className="appointments-page">
        <div className="appointments-container">
          <div className="page-loading">
            <div className="page-loading-spinner"></div>
            <p className="page-loading-text">Cargando tus citas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <div className="appointments-container">
        {/* Header */}
        <div className="appointments-header">
          <div className="appointments-header-content">
            <div className="appointments-header-left">
              <h1 className="appointments-title">
                <span>📅</span>
                Mis Citas
              </h1>
              <p className="appointments-subtitle">
                Gestiona las citas de tus mascotas
              </p>
            </div>
            <button className="create-appointment-btn" onClick={handleOpenModal}>
              <span>➕</span>
              Agendar Nueva Cita
            </button>
          </div>
        </div>

        {/* Stats */}
        <AppointmentStats />

        {/* Filters */}
        <AppointmentFilters />

        {/* Appointments List */}
        <div className="appointments-content">
          <AppointmentList onCreateClick={handleOpenModal} />
        </div>

        {/* Create Appointment Modal */}
        <CreateAppointmentModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default AppointmentsPage;
