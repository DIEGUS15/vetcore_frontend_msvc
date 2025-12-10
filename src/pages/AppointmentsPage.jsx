import { useEffect, useState } from "react";
import { useAppointment } from "../context/AppointmentContext";
import AppointmentStats from "../components/AppointmentStats";
import AppointmentFilters from "../components/AppointmentFilters";
import AppointmentList from "../components/AppointmentList";
import CreateAppointmentModal from "../components/CreateAppointmentModal";
import { FiCalendar } from "react-icons/fi";

const AppointmentsPage = () => {
  const { getAppointments } = useAppointment();
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Cargando tus citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-xl p-8 mb-8 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <FiCalendar className="text-slate-900 text-xl" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Mis Citas
              </h1>
            </div>
            <p className="text-slate-300">
              Gestiona las citas de tus mascotas
            </p>
          </div>
          <button
            className="bg-white text-sky-600 px-7 py-3.5 rounded-lg font-semibold transition-all hover:bg-slate-50 hover:shadow-lg flex items-center gap-2"
            onClick={handleOpenModal}
          >
            <span className="text-xl">+</span>
            Agendar Nueva Cita
          </button>
        </div>
      </div>

      {/* Stats */}
      <AppointmentStats />

      {/* Filters */}
      <AppointmentFilters />

      {/* Appointments List */}
      <div className="mt-6">
        <AppointmentList onCreateClick={handleOpenModal} />
      </div>

      {/* Create Appointment Modal */}
      <CreateAppointmentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default AppointmentsPage;
