import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const VeterinarianDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/appointments/dashboard/veterinarian');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      alert('Error al cargar las estadísticas del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Cargando dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">No se pudo cargar el dashboard</div>
      </div>
    );
  }

  const { statistics, alerts, upcomingVaccinations, upcomingDewormings, recentConsultations, upcomingAppointments } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Veterinario</h1>
          <p className="text-gray-600">Resumen de tu actividad y alertas importantes</p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Citas de hoy */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Citas de Hoy</p>
                <p className="text-3xl font-bold text-blue-600">{statistics.todayAppointments}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          {/* Citas pendientes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Citas Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">{statistics.pendingAppointments}</p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
          </div>

          {/* Casos activos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Casos Activos</p>
                <p className="text-3xl font-bold text-orange-600">{statistics.activeCases}</p>
              </div>
              <div className="text-4xl">🏥</div>
            </div>
          </div>

          {/* Completadas este mes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completadas (Mes)</p>
                <p className="text-3xl font-bold text-green-600">{statistics.completedThisMonth}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {(alerts.upcomingVaccinations > 0 || alerts.upcomingDewormings > 0) && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Alertas Importantes</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  {alerts.upcomingVaccinations > 0 && (
                    <p>• {alerts.upcomingVaccinations} vacuna(s) próxima(s) a vencer en los próximos 7 días</p>
                  )}
                  {alerts.upcomingDewormings > 0 && (
                    <p>• {alerts.upcomingDewormings} desparasitación(es) próxima(s) a vencer en los próximos 7 días</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximas citas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Próximas Citas</h2>
              <button
                onClick={() => navigate('/schedule')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver todas →
              </button>
            </div>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500">No hay citas próximas</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.appointmentId} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-medium text-gray-800">{appointment.motivo}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.fecha).toLocaleDateString()} - {appointment.hora}
                    </p>
                    <p className="text-xs text-gray-500">
                      Estado: <span className="capitalize">{appointment.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consultas recientes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Consultas Recientes</h2>
            {recentConsultations.length === 0 ? (
              <p className="text-gray-500">No hay consultas recientes</p>
            ) : (
              <div className="space-y-3">
                {recentConsultations.map((consultation) => (
                  <div key={consultation.recordId} className="border-l-4 border-green-500 pl-4 py-2">
                    <p className="font-medium text-gray-800">{consultation.motivoConsulta}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(consultation.fecha).toLocaleDateString()}
                    </p>
                    {consultation.diagnostico && (
                      <p className="text-xs text-gray-500">
                        Diagnóstico: {consultation.diagnostico.substring(0, 50)}...
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vacunas próximas a vencer */}
        {upcomingVaccinations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Vacunas Próximas a Vencer (7 días)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vacuna</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Dosis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lote</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingVaccinations.map((vaccination) => (
                    <tr key={vaccination.vaccinationId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vaccination.nombreVacuna}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(vaccination.proximaDosis).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vaccination.lote || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Desparasitaciones próximas a vencer */}
        {upcomingDewormings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Desparasitaciones Próximas a Vencer (7 días)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Dosis</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingDewormings.map((deworming) => (
                    <tr key={deworming.dewormingId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {deworming.producto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {deworming.tipoParasito}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(deworming.proximaDosis).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VeterinarianDashboardPage;
