import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const ClientMedicalHistoryPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState(null);
  const [activeTab, setActiveTab] = useState('historial');
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [dewormings, setDewormings] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchData();
  }, [petId]);

  const handleDownloadPDF = async (recordId) => {
    try {
      const response = await axios.get(`/appointments/medical-records/${recordId}/pdf`, {
        responseType: 'blob'
      });

      // Verificar si la respuesta es realmente un PDF
      const contentType = response.headers['content-type'];
      console.log('Content-Type:', contentType);
      console.log('Response data type:', response.data.type);
      console.log('Response data size:', response.data.size);

      // Si es JSON significa que hubo un error
      if (contentType && contentType.includes('application/json')) {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        console.error('Error del servidor:', errorData);
        alert(`Error: ${errorData.message || 'Error al generar el PDF'}`);
        return;
      }

      // Crear un blob y descargarlo
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `registro-medico-${recordId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      console.error('Error completo:', error.response);
      alert(`Error al descargar el PDF: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Obtener datos de la mascota
      const petRes = await axios.get(`/patients/pets`);
      const currentPet = petRes.data.pets?.find(
        p => p.petId === parseInt(petId)
      );

      if (!currentPet) {
        throw new Error('Mascota no encontrada');
      }

      setPet(currentPet);

      // Obtener historial médico
      try {
        const historyRes = await axios.get(`/appointments/patients/${petId}/medical-history`);
        if (historyRes.data.success) {
          setMedicalHistory(historyRes.data.data || []);
        }
      } catch (error) {
        console.error('Error al cargar historial:', error);
      }

      // Obtener vacunas
      try {
        const vaccinationsRes = await axios.get(`/appointments/patients/${petId}/vaccinations`);
        if (vaccinationsRes.data.success) {
          setVaccinations(vaccinationsRes.data.data || []);
        }
      } catch (error) {
        console.error('Error al cargar vacunas:', error);
      }

      // Obtener desparasitaciones
      try {
        const dewormingsRes = await axios.get(`/appointments/patients/${petId}/dewormings`);
        if (dewormingsRes.data.success) {
          setDewormings(dewormingsRes.data.data || []);
        }
      } catch (error) {
        console.error('Error al cargar desparasitaciones:', error);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar la información de la mascota');
      navigate('/pets');
    } finally {
      setLoading(false);
    }
  };

  const loadRecordAttachments = async (recordId) => {
    try {
      const res = await axios.get(`/appointments/medical-records/${recordId}/attachments`);
      if (res.data.success) {
        setAttachments(res.data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar archivos:', error);
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    if (record.recordId) {
      loadRecordAttachments(record.recordId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">No se encontró la mascota</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header con información de la mascota */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Foto de la mascota */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 shrink-0">
              {pet.photo ? (
                <img src={pet.photo} alt={pet.petName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                  🐾
                </div>
              )}
            </div>

            {/* Información de la mascota */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Historial Médico - {pet.petName}
              </h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Especie:</span> {pet.species}
                </div>
                <div>
                  <span className="font-semibold">Raza:</span> {pet.breed || 'No especificada'}
                </div>
                <div>
                  <span className="font-semibold">Edad:</span> {pet.age} años
                </div>
                <div>
                  <span className="font-semibold">Peso:</span> {pet.weight} kg
                </div>
                <div>
                  <span className="font-semibold">Género:</span> {pet.gender}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
              <button
                onClick={() => window.open(`${axios.defaults.baseURL}/appointments/patients/${petId}/medical-history-pdf`, '_blank')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                <span>📄</span>
                Descargar Historial Completo
              </button>
              <button
                onClick={() => window.open(`${axios.defaults.baseURL}/appointments/patients/${petId}/vaccination-certificate-pdf`, '_blank')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <span>💉</span>
                Certificado de Vacunación
              </button>
              <button
                onClick={() => navigate('/pets')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Volver
              </button>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('historial')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'historial'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Historial de Consultas ({medicalHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('vacunas')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'vacunas'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Vacunas ({vaccinations.length})
            </button>
            <button
              onClick={() => setActiveTab('desparasitaciones')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'desparasitaciones'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Desparasitaciones ({dewormings.length})
            </button>
          </div>

          {/* Contenido de los tabs */}
          <div className="p-6">
            {activeTab === 'historial' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Historial de Consultas</h3>

                {medicalHistory.length === 0 ? (
                  <p className="text-gray-500">No hay consultas registradas aún.</p>
                ) : (
                  <div className="space-y-4">
                    {medicalHistory.map((record) => (
                      <div key={record.recordId} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              {new Date(record.fecha).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Estado: <span className={`font-semibold ${
                                record.status === 'finalizado' ? 'text-green-600' : 'text-yellow-600'
                              }`}>
                                {record.status === 'finalizado' ? 'Finalizado' : 'En curso'}
                              </span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDownloadPDF(record.recordId)}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Descargar PDF
                            </button>
                            <button
                              onClick={() => handleViewRecord(selectedRecord?.recordId === record.recordId ? null : record)}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              {selectedRecord?.recordId === record.recordId ? 'Ocultar Detalles' : 'Ver Detalles'}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Motivo de Consulta</p>
                            <p className="text-gray-800">{record.motivoConsulta}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Diagnóstico</p>
                            <p className="text-gray-800">{record.diagnostico || 'Pendiente'}</p>
                          </div>
                        </div>

                        {selectedRecord?.recordId === record.recordId && (
                          <div className="mt-4 pt-4 border-t space-y-4">
                            {record.anamnesis && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700">Anamnesis</p>
                                <p className="text-gray-800 whitespace-pre-wrap">{record.anamnesis}</p>
                              </div>
                            )}

                            {record.vitalSigns && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">Signos Vitales</p>
                                <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded">
                                  {record.vitalSigns.temperatura && (
                                    <div>
                                      <p className="text-xs text-gray-600">Temperatura</p>
                                      <p className="font-medium">{record.vitalSigns.temperatura}°C</p>
                                    </div>
                                  )}
                                  {record.vitalSigns.peso && (
                                    <div>
                                      <p className="text-xs text-gray-600">Peso</p>
                                      <p className="font-medium">{record.vitalSigns.peso} kg</p>
                                    </div>
                                  )}
                                  {record.vitalSigns.frecuenciaCardiaca && (
                                    <div>
                                      <p className="text-xs text-gray-600">Frecuencia Cardíaca</p>
                                      <p className="font-medium">{record.vitalSigns.frecuenciaCardiaca} lpm</p>
                                    </div>
                                  )}
                                  {record.vitalSigns.frecuenciaRespiratoria && (
                                    <div>
                                      <p className="text-xs text-gray-600">Frecuencia Respiratoria</p>
                                      <p className="font-medium">{record.vitalSigns.frecuenciaRespiratoria} rpm</p>
                                    </div>
                                  )}
                                  {record.vitalSigns.presionArterial && (
                                    <div>
                                      <p className="text-xs text-gray-600">Presión Arterial</p>
                                      <p className="font-medium">{record.vitalSigns.presionArterial} mmHg</p>
                                    </div>
                                  )}
                                  {record.vitalSigns.condicionCorporal && (
                                    <div>
                                      <p className="text-xs text-gray-600">Condición Corporal</p>
                                      <p className="font-medium">{record.vitalSigns.condicionCorporal}/5</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {record.examenFisico && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700">Examen Físico</p>
                                <p className="text-gray-800 whitespace-pre-wrap">{record.examenFisico}</p>
                              </div>
                            )}

                            {record.tratamiento && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700">Tratamiento</p>
                                <p className="text-gray-800 whitespace-pre-wrap">{record.tratamiento}</p>
                              </div>
                            )}

                            {record.procedimientosRealizados && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700">Procedimientos Realizados</p>
                                <p className="text-gray-800 whitespace-pre-wrap">{record.procedimientosRealizados}</p>
                              </div>
                            )}

                            {record.observaciones && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700">Observaciones</p>
                                <p className="text-gray-800 whitespace-pre-wrap">{record.observaciones}</p>
                              </div>
                            )}

                            {record.proximaConsulta && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700">Próxima Consulta Sugerida</p>
                                <p className="text-gray-800">{new Date(record.proximaConsulta).toLocaleDateString()}</p>
                              </div>
                            )}

                            {attachments.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">Archivos Médicos</p>
                                <div className="grid grid-cols-3 gap-3">
                                  {attachments.map((file) => (
                                    <div key={file.attachmentId} className="border rounded-lg p-3">
                                      <p className="font-medium text-sm">{file.fileName}</p>
                                      <p className="text-xs text-gray-600">{file.fileType}</p>
                                      <p className="text-xs text-gray-500">{(file.fileSize / 1024).toFixed(2)} KB</p>
                                      <button
                                        onClick={() => window.open(`${axios.defaults.baseURL}/appointments/medical-records/attachments/${file.attachmentId}/download`, '_blank')}
                                        className="mt-2 text-blue-600 hover:underline text-sm"
                                      >
                                        Descargar
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'vacunas' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Calendario de Vacunación</h3>

                {vaccinations.length === 0 ? (
                  <p className="text-gray-500">No hay vacunas registradas aún.</p>
                ) : (
                  <div className="space-y-4">
                    {vaccinations.map((vaccination) => (
                      <div key={vaccination.vaccinationId} className="border rounded-lg p-4 bg-white">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Vacuna</p>
                            <p className="text-lg">{vaccination.nombreVacuna}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Fecha de Aplicación</p>
                            <p>{new Date(vaccination.fechaAplicacion).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Próxima Dosis</p>
                            <p className={vaccination.proximaDosis ? 'font-semibold text-blue-600' : ''}>
                              {vaccination.proximaDosis ? new Date(vaccination.proximaDosis).toLocaleDateString() : 'No programada'}
                            </p>
                          </div>
                          {vaccination.lote && (
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Lote</p>
                              <p>{vaccination.lote}</p>
                            </div>
                          )}
                          {vaccination.fabricante && (
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Fabricante</p>
                              <p>{vaccination.fabricante}</p>
                            </div>
                          )}
                          {vaccination.observaciones && (
                            <div className="col-span-3">
                              <p className="text-sm font-semibold text-gray-700">Observaciones</p>
                              <p className="text-gray-600">{vaccination.observaciones}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'desparasitaciones' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Calendario de Desparasitación</h3>

                {dewormings.length === 0 ? (
                  <p className="text-gray-500">No hay desparasitaciones registradas aún.</p>
                ) : (
                  <div className="space-y-4">
                    {dewormings.map((deworming) => (
                      <div key={deworming.dewormingId} className="border rounded-lg p-4 bg-white">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Producto</p>
                            <p className="text-lg">{deworming.producto}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Tipo de Parásito</p>
                            <p className="capitalize">{deworming.tipoParasito}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Fecha de Aplicación</p>
                            <p>{new Date(deworming.fechaAplicacion).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Próxima Dosis</p>
                            <p className={deworming.proximaDosis ? 'font-semibold text-blue-600' : ''}>
                              {deworming.proximaDosis ? new Date(deworming.proximaDosis).toLocaleDateString() : 'No programada'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Vía de Administración</p>
                            <p className="capitalize">{deworming.viaAdministracion}</p>
                          </div>
                          {deworming.peso && (
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Peso</p>
                              <p>{deworming.peso} kg</p>
                            </div>
                          )}
                          {deworming.dosis && (
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Dosis</p>
                              <p>{deworming.dosis}</p>
                            </div>
                          )}
                          {deworming.observaciones && (
                            <div className="col-span-3">
                              <p className="text-sm font-semibold text-gray-700">Observaciones</p>
                              <p className="text-gray-600">{deworming.observaciones}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientMedicalHistoryPage;
