import { useState, useEffect } from "react";
import { updateAppointmentAttentionRequest } from "../api/appointment";
import { FiX, FiCheck, FiAlertCircle } from "react-icons/fi";

const RegisterAttentionModal = ({ isOpen, onClose, appointment, onSuccess }) => {
  const [formData, setFormData] = useState({
    procedimiento: "",
    diagnostico: "",
    indicaciones: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        procedimiento: "",
        diagnostico: "",
        indicaciones: "",
      });
      setError(null);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que al menos un campo esté lleno
    if (!formData.procedimiento && !formData.diagnostico && !formData.indicaciones) {
      setError("Debe completar al menos un campo");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await updateAppointmentAttentionRequest(appointment.appointmentId, formData);

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error registrando atención:", err);
      setError(err.response?.data?.message || "Error al registrar la atención");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Registrar Atención
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Cita de {appointment?.petName} - {appointment?.hora?.substring(0, 5)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <FiX className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Motivo (readonly) */}
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Motivo de la consulta
            </label>
            <p className="text-slate-900">{appointment?.motivo}</p>
          </div>

          {/* Procedimiento */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Procedimiento realizado
            </label>
            <textarea
              name="procedimiento"
              value={formData.procedimiento}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="Describa el procedimiento realizado durante la atención..."
            />
          </div>

          {/* Diagnóstico */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Diagnóstico
            </label>
            <textarea
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="Ingrese el diagnóstico del paciente..."
            />
          </div>

          {/* Indicaciones */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Indicaciones y recomendaciones
            </label>
            <textarea
              name="indicaciones"
              value={formData.indicaciones}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="Indique las recomendaciones y cuidados a seguir..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registrando...
                </>
              ) : (
                <>
                  <FiCheck className="w-5 h-5" />
                  Registrar Atención
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterAttentionModal;
