import React, { useState, useEffect } from 'react';
import { getSchedule } from '../api/schedule';

const VetSchedule = ({ vetId }) => {
  const [scheduleData, setScheduleData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSchedule(vetId);
      // Esperamos un arreglo de VetDailySchedule
      setScheduleData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar el horario');
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vetId) {
      fetchSchedule();
    }
  }, [vetId]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  if (loading) return <div>Cargando horario...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      {scheduleData && scheduleData.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Horario del día</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mascota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scheduleData.map((appointment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.slotTime ? appointment.slotTime.toString().substring(0,5) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.petName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.clientName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.reason || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${appointment.status === 'ATTENDED' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                        {appointment.status || 'PENDIENTE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-gray-600">No hay registros de horario para este veterinario.</div>
      )}
    </div>
  );
};

export default VetSchedule;