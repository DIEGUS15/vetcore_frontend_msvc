import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const MedicalAttentionPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [pet, setPet] = useState(null);
  const [activeTab, setActiveTab] = useState('consulta');
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    motivoConsulta: '',
    anamnesis: '',
    examenFisico: '',
    diagnostico: '',
    tratamiento: '',
    procedimientosRealizados: '',
    observaciones: '',
    proximaConsulta: '',
    vitalSigns: {
      temperatura: '',
      peso: '',
      frecuenciaCardiaca: '',
      frecuenciaRespiratoria: '',
      presionArterial: '',
      condicionCorporal: '',
      hidratacion: 'normal'
    }
  });

  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Vacunas y Desparasitaciones
  const [vaccinations, setVaccinations] = useState([]);
  const [dewormings, setDewormings] = useState([]);
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [showDewormingForm, setShowDewormingForm] = useState(false);

  const [vaccinationData, setVaccinationData] = useState({
    nombreVacuna: '',
    fechaAplicacion: new Date().toISOString().split('T')[0],
    proximaDosis: '',
    lote: '',
    fabricante: '',
    observaciones: ''
  });

  const [dewormingData, setDewormingData] = useState({
    producto: '',
    tipoParasito: 'interno',
    fechaAplicacion: new Date().toISOString().split('T')[0],
    proximaDosis: '',
    peso: '',
    dosis: '',
    viaAdministracion: 'oral',
    observaciones: ''
  });

  useEffect(() => {
    fetchAppointmentData();
  }, [appointmentId]);

  const fetchAppointmentData = async () => {
    try {
      setLoading(true);

      // Obtener datos de la cita
      const appointmentRes = await axios.get(`/appointments/veterinarian/schedule`);
      const currentAppointment = appointmentRes.data.data?.find(
        cita => cita.appointmentId === parseInt(appointmentId)
      );

      if (!currentAppointment) {
        throw new Error('Cita no encontrada');
      }

      setAppointment(currentAppointment);

      // Obtener datos de la mascota
      const petRes = await axios.get(`/patients/pets`);
      const currentPet = petRes.data.pets?.find(
        p => p.petId === currentAppointment.petId
      );
      setPet(currentPet);

      // Intentar obtener el registro médico existente
      try {
        const recordRes = await axios.get(`/appointments/${appointmentId}/medical-record`);
        if (recordRes.data.success) {
          setMedicalRecord(recordRes.data.data);
          // Prellenar el formulario con datos existentes
          setFormData({
            motivoConsulta: recordRes.data.data.motivoConsulta || currentAppointment.motivo,
            anamnesis: recordRes.data.data.anamnesis || '',
            examenFisico: recordRes.data.data.examenFisico || '',
            diagnostico: recordRes.data.data.diagnostico || '',
            tratamiento: recordRes.data.data.tratamiento || '',
            procedimientosRealizados: recordRes.data.data.procedimientosRealizados || '',
            observaciones: recordRes.data.data.observaciones || '',
            proximaConsulta: recordRes.data.data.proximaConsulta || '',
            vitalSigns: recordRes.data.data.vitalSigns || formData.vitalSigns
          });
          setUploadedFiles(recordRes.data.data.attachments || []);
        }
      } catch (error) {
        // No existe registro médico aún, usar motivo de la cita
        setFormData(prev => ({
          ...prev,
          motivoConsulta: currentAppointment.motivo
        }));
      }

      // Obtener historial médico de la mascota
      if (currentAppointment.petId) {
        try {
          const historyRes = await axios.get(`/appointments/patients/${currentAppointment.petId}/medical-history`);
          if (historyRes.data.success) {
            setMedicalHistory(historyRes.data.data || []);
          }
        } catch (error) {
          console.error('Error al cargar historial:', error);
        }

        // Obtener vacunas de la mascota
        try {
          const vaccinationsRes = await axios.get(`/appointments/patients/${currentAppointment.petId}/vaccinations`);
          if (vaccinationsRes.data.success) {
            setVaccinations(vaccinationsRes.data.data || []);
          }
        } catch (error) {
          console.error('Error al cargar vacunas:', error);
        }

        // Obtener desparasitaciones de la mascota
        try {
          const dewormingsRes = await axios.get(`/appointments/patients/${currentAppointment.petId}/dewormings`);
          if (dewormingsRes.data.success) {
            setDewormings(dewormingsRes.data.data || []);
          }
        } catch (error) {
          console.error('Error al cargar desparasitaciones:', error);
        }
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar la información de la cita');
      navigate('/schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVitalSignsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [name]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let recordId = medicalRecord?.recordId;

      // Crear o actualizar el registro médico
      if (medicalRecord) {
        // Actualizar registro existente
        const res = await axios.put(`/appointments/${appointmentId}/medical-record`, formData);
        recordId = res.data.data.recordId;
        alert('Registro médico actualizado exitosamente');
      } else {
        // Crear nuevo registro
        const res = await axios.post(`/appointments/${appointmentId}/medical-record`, formData);
        recordId = res.data.data.recordId;
        setMedicalRecord(res.data.data);
        alert('Registro médico creado exitosamente');
      }

      // Subir archivos si hay
      if (files.length > 0 && recordId) {
        const formDataFiles = new FormData();
        files.forEach(file => {
          formDataFiles.append('files', file);
        });

        await axios.post(`/appointments/medical-records/${recordId}/attachments`, formDataFiles, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setFiles([]);
        alert('Archivos subidos exitosamente');
      }

      // Recargar datos
      fetchAppointmentData();

    } catch (error) {
      console.error('Error al guardar:', error);
      alert(error.response?.data?.message || 'Error al guardar el registro médico');
    }
  };

  const handleFinalize = async () => {
    if (!medicalRecord) {
      alert('Primero debes guardar el registro médico');
      return;
    }

    if (!formData.diagnostico || !formData.tratamiento) {
      alert('El diagnóstico y tratamiento son obligatorios para finalizar');
      return;
    }

    try {
      // Actualizar el registro como finalizado
      await axios.put(`/appointments/${appointmentId}/medical-record`, {
        ...formData,
        status: 'finalizado'
      });

      // Actualizar estado de la cita
      await axios.put(`/appointments/${appointmentId}/attention`, {
        procedimiento: formData.procedimientosRealizados,
        diagnostico: formData.diagnostico,
        indicaciones: formData.observaciones
      });

      alert('Consulta finalizada exitosamente');
      navigate('/veterinarian-schedule');
    } catch (error) {
      console.error('Error al finalizar:', error);
      alert('Error al finalizar la consulta');
    }
  };

  // Handlers para vacunas
  const handleVaccinationChange = (e) => {
    const { name, value } = e.target;
    setVaccinationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVaccinationSubmit = async (e) => {
    e.preventDefault();

    if (!vaccinationData.nombreVacuna || !vaccinationData.fechaAplicacion) {
      alert('El nombre de la vacuna y la fecha de aplicación son obligatorios');
      return;
    }

    try {
      const payload = {
        ...vaccinationData,
        recordId: medicalRecord?.recordId
      };

      await axios.post(`/appointments/patients/${pet.petId}/vaccinations`, payload);

      alert('Vacuna registrada exitosamente');
      setShowVaccinationForm(false);
      setVaccinationData({
        nombreVacuna: '',
        fechaAplicacion: new Date().toISOString().split('T')[0],
        proximaDosis: '',
        lote: '',
        fabricante: '',
        observaciones: ''
      });

      // Recargar vacunas
      const vaccinationsRes = await axios.get(`/appointments/patients/${pet.petId}/vaccinations`);
      if (vaccinationsRes.data.success) {
        setVaccinations(vaccinationsRes.data.data || []);
      }
    } catch (error) {
      console.error('Error al registrar vacuna:', error);
      alert(error.response?.data?.message || 'Error al registrar la vacuna');
    }
  };

  // Handlers para desparasitaciones
  const handleDewormingChange = (e) => {
    const { name, value } = e.target;
    setDewormingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDewormingSubmit = async (e) => {
    e.preventDefault();

    if (!dewormingData.producto || !dewormingData.fechaAplicacion) {
      alert('El producto y la fecha de aplicación son obligatorios');
      return;
    }

    try {
      const payload = {
        ...dewormingData,
        recordId: medicalRecord?.recordId
      };

      await axios.post(`/appointments/patients/${pet.petId}/dewormings`, payload);

      alert('Desparasitación registrada exitosamente');
      setShowDewormingForm(false);
      setDewormingData({
        producto: '',
        tipoParasito: 'interno',
        fechaAplicacion: new Date().toISOString().split('T')[0],
        proximaDosis: '',
        peso: '',
        dosis: '',
        viaAdministracion: 'oral',
        observaciones: ''
      });

      // Recargar desparasitaciones
      const dewormingsRes = await axios.get(`/appointments/patients/${pet.petId}/dewormings`);
      if (dewormingsRes.data.success) {
        setDewormings(dewormingsRes.data.data || []);
      }
    } catch (error) {
      console.error('Error al registrar desparasitación:', error);
      alert(error.response?.data?.message || 'Error al registrar la desparasitación');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!appointment || !pet) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">No se encontró la cita</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header con información de la cita */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Foto de la mascota */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {pet.photo ? (
                <img src={pet.photo} alt={pet.petName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                  🐾
                </div>
              )}
            </div>

            {/* Información de la mascota y cita */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Atención Médica - {pet.petName}
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
                  <span className="font-semibold">Fecha de Cita:</span> {appointment.fecha}
                </div>
                <div>
                  <span className="font-semibold">Hora:</span> {appointment.hora}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">Motivo:</span> {appointment.motivo}
                </div>
              </div>
            </div>

            {/* Botón volver */}
            <button
              onClick={() => navigate('/veterinarian-schedule')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Volver
            </button>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('consulta')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'consulta'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Consulta Actual
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'historial'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Historial Médico ({medicalHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('archivos')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'archivos'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Archivos ({uploadedFiles.length})
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
            {activeTab === 'consulta' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Motivo de Consulta */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Motivo de Consulta *
                  </label>
                  <input
                    type="text"
                    name="motivoConsulta"
                    value={formData.motivoConsulta}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Anamnesis */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Anamnesis (Historia relatada por el dueño)
                  </label>
                  <textarea
                    name="anamnesis"
                    value={formData.anamnesis}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción de los síntomas o condición según el dueño..."
                  />
                </div>

                {/* Signos Vitales */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Signos Vitales</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperatura (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="temperatura"
                        value={formData.vitalSigns.temperatura}
                        onChange={handleVitalSignsChange}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="38.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="peso"
                        value={formData.vitalSigns.peso}
                        onChange={handleVitalSignsChange}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="12.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frec. Cardíaca (lat/min)
                      </label>
                      <input
                        type="number"
                        name="frecuenciaCardiaca"
                        value={formData.vitalSigns.frecuenciaCardiaca}
                        onChange={handleVitalSignsChange}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="120"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frec. Respiratoria (resp/min)
                      </label>
                      <input
                        type="number"
                        name="frecuenciaRespiratoria"
                        value={formData.vitalSigns.frecuenciaRespiratoria}
                        onChange={handleVitalSignsChange}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="24"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condición Corporal (1-5)
                      </label>
                      <select
                        name="condicionCorporal"
                        value={formData.vitalSigns.condicionCorporal}
                        onChange={handleVitalSignsChange}
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="">Seleccionar</option>
                        <option value="1">1 - Muy delgado</option>
                        <option value="2">2 - Delgado</option>
                        <option value="3">3 - Normal</option>
                        <option value="4">4 - Sobrepeso</option>
                        <option value="5">5 - Obesidad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hidratación
                      </label>
                      <select
                        name="hidratacion"
                        value={formData.vitalSigns.hidratacion}
                        onChange={handleVitalSignsChange}
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="normal">Normal</option>
                        <option value="leve">Leve deshidratación</option>
                        <option value="moderada">Moderada</option>
                        <option value="severa">Severa</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Examen Físico */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Examen Físico
                  </label>
                  <textarea
                    name="examenFisico"
                    value={formData.examenFisico}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción detallada del examen físico realizado..."
                  />
                </div>

                {/* Diagnóstico */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Diagnóstico *
                  </label>
                  <textarea
                    name="diagnostico"
                    value={formData.diagnostico}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Diagnóstico veterinario..."
                  />
                </div>

                {/* Tratamiento */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tratamiento *
                  </label>
                  <textarea
                    name="tratamiento"
                    value={formData.tratamiento}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Tratamiento prescrito..."
                  />
                </div>

                {/* Procedimientos Realizados */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Procedimientos Realizados
                  </label>
                  <textarea
                    name="procedimientosRealizados"
                    value={formData.procedimientosRealizados}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Procedimientos realizados durante la consulta..."
                  />
                </div>

                {/* Observaciones */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Observaciones y Recomendaciones
                  </label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Observaciones adicionales y recomendaciones para el dueño..."
                  />
                </div>

                {/* Próxima Consulta */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Próxima Consulta Sugerida
                  </label>
                  <input
                    type="date"
                    name="proximaConsulta"
                    value={formData.proximaConsulta}
                    onChange={handleInputChange}
                    className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Upload de Archivos */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subir Archivos Médicos (Radiografías, Análisis, etc.)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border rounded bg-white"
                  />
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white px-3 py-1 rounded">
                          <span className="text-sm">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Guardar Registro
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalize}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Finalizar Consulta
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'historial' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Historial Médico de {pet.petName}</h3>
                {medicalHistory.length === 0 ? (
                  <p className="text-gray-500">No hay consultas previas registradas.</p>
                ) : (
                  <div className="space-y-4">
                    {medicalHistory.map((record) => (
                      <div key={record.recordId} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-lg">{record.motivoConsulta}</p>
                            <p className="text-sm text-gray-600">{record.fecha}</p>
                          </div>
                          <span className={`px-3 py-1 rounded text-sm ${
                            record.status === 'finalizado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.status === 'finalizado' ? 'Finalizado' : 'En curso'}
                          </span>
                        </div>
                        {record.diagnostico && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Diagnóstico:</p>
                            <p className="text-sm text-gray-600">{record.diagnostico}</p>
                          </div>
                        )}
                        {record.tratamiento && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Tratamiento:</p>
                            <p className="text-sm text-gray-600">{record.tratamiento}</p>
                          </div>
                        )}
                        {record.vitalSigns && (
                          <div className="mt-2 flex gap-4 text-sm text-gray-600">
                            {record.vitalSigns.temperatura && <span>Temp: {record.vitalSigns.temperatura}°C</span>}
                            {record.vitalSigns.peso && <span>Peso: {record.vitalSigns.peso} kg</span>}
                            {record.vitalSigns.frecuenciaCardiaca && <span>FC: {record.vitalSigns.frecuenciaCardiaca} lat/min</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'archivos' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Archivos Médicos</h3>
                {uploadedFiles.length === 0 ? (
                  <p className="text-gray-500">No hay archivos subidos aún.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.attachmentId} className="border rounded-lg p-4">
                        <p className="font-medium">{file.fileName}</p>
                        <p className="text-sm text-gray-600">{file.fileType}</p>
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
                )}
              </div>
            )}

            {activeTab === 'vacunas' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Historial de Vacunas</h3>
                  <button
                    onClick={() => setShowVaccinationForm(!showVaccinationForm)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {showVaccinationForm ? 'Cancelar' : 'Registrar Vacuna'}
                  </button>
                </div>

                {showVaccinationForm && (
                  <form onSubmit={handleVaccinationSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
                    <h4 className="font-semibold text-lg mb-3">Nueva Vacuna</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de la Vacuna *
                        </label>
                        <input
                          type="text"
                          name="nombreVacuna"
                          value={vaccinationData.nombreVacuna}
                          onChange={handleVaccinationChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Aplicación *
                        </label>
                        <input
                          type="date"
                          name="fechaAplicacion"
                          value={vaccinationData.fechaAplicacion}
                          onChange={handleVaccinationChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Próxima Dosis
                        </label>
                        <input
                          type="date"
                          name="proximaDosis"
                          value={vaccinationData.proximaDosis}
                          onChange={handleVaccinationChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lote
                        </label>
                        <input
                          type="text"
                          name="lote"
                          value={vaccinationData.lote}
                          onChange={handleVaccinationChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fabricante
                        </label>
                        <input
                          type="text"
                          name="fabricante"
                          value={vaccinationData.fabricante}
                          onChange={handleVaccinationChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Observaciones
                        </label>
                        <textarea
                          name="observaciones"
                          value={vaccinationData.observaciones}
                          onChange={handleVaccinationChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Guardar Vacuna
                      </button>
                    </div>
                  </form>
                )}

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
                            <p>{vaccination.proximaDosis ? new Date(vaccination.proximaDosis).toLocaleDateString() : 'No programada'}</p>
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Historial de Desparasitaciones</h3>
                  <button
                    onClick={() => setShowDewormingForm(!showDewormingForm)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {showDewormingForm ? 'Cancelar' : 'Registrar Desparasitación'}
                  </button>
                </div>

                {showDewormingForm && (
                  <form onSubmit={handleDewormingSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
                    <h4 className="font-semibold text-lg mb-3">Nueva Desparasitación</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Producto *
                        </label>
                        <input
                          type="text"
                          name="producto"
                          value={dewormingData.producto}
                          onChange={handleDewormingChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Parásito *
                        </label>
                        <select
                          name="tipoParasito"
                          value={dewormingData.tipoParasito}
                          onChange={handleDewormingChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="interno">Interno</option>
                          <option value="externo">Externo</option>
                          <option value="ambos">Ambos</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Aplicación *
                        </label>
                        <input
                          type="date"
                          name="fechaAplicacion"
                          value={dewormingData.fechaAplicacion}
                          onChange={handleDewormingChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Próxima Dosis
                        </label>
                        <input
                          type="date"
                          name="proximaDosis"
                          value={dewormingData.proximaDosis}
                          onChange={handleDewormingChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="peso"
                          value={dewormingData.peso}
                          onChange={handleDewormingChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dosis
                        </label>
                        <input
                          type="text"
                          name="dosis"
                          value={dewormingData.dosis}
                          onChange={handleDewormingChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vía de Administración *
                        </label>
                        <select
                          name="viaAdministracion"
                          value={dewormingData.viaAdministracion}
                          onChange={handleDewormingChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="oral">Oral</option>
                          <option value="topica">Tópica</option>
                          <option value="inyectable">Inyectable</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Observaciones
                        </label>
                        <textarea
                          name="observaciones"
                          value={dewormingData.observaciones}
                          onChange={handleDewormingChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Guardar Desparasitación
                      </button>
                    </div>
                  </form>
                )}

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
                            <p>{deworming.proximaDosis ? new Date(deworming.proximaDosis).toLocaleDateString() : 'No programada'}</p>
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

export default MedicalAttentionPage;
