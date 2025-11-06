import { useState, useEffect } from "react";
import { useAppointment } from "../context/AppointmentContext";
import { usePet } from "../context/PetContext";
import { validateAppointmentForm, getMinDate } from "../utils/appointmentUtils";
import "../styles/Modal.css";
import "../styles/CreateAppointmentModal.css";

const CreateAppointmentModal = ({ isOpen, onClose }) => {
  const { createAppointment, getVeterinarians, veterinarians, loading } = useAppointment();
  const { pets, getPets } = usePet();

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    motivo: "",
    petId: "",
    veterinarianId: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load pets and veterinarians when modal opens
  useEffect(() => {
    if (isOpen) {
      getPets(1, 100); // Get all user's pets
      getVeterinarians();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate form
    const validation = validateAppointmentForm({
      ...formData,
      petId: parseInt(formData.petId),
      veterinarianId: parseInt(formData.veterinarianId),
    });

    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await createAppointment({
        ...formData,
        petId: parseInt(formData.petId),
        veterinarianId: parseInt(formData.veterinarianId),
      });

      // Success - reset form and close modal
      setFormData({
        fecha: "",
        hora: "",
        motivo: "",
        petId: "",
        veterinarianId: "",
      });
      setFormErrors({});
      onClose();
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Error al crear la cita. Intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        fecha: "",
        hora: "",
        motivo: "",
        petId: "",
        veterinarianId: "",
      });
      setFormErrors({});
      setSubmitError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content appointment-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Agendar Nueva Cita</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Pet Selection */}
            <div className="form-group">
              <label htmlFor="petId" className="form-label">
                <span className="appointment-icon-label">
                  <span>🐾</span>
                  Mascota
                </span>
                <span className="required">*</span>
              </label>
              <select
                id="petId"
                name="petId"
                value={formData.petId}
                onChange={handleChange}
                className={`form-select ${formErrors.petId ? "form-field-error" : ""}`}
                disabled={isSubmitting}
                required
              >
                <option value="">Selecciona una mascota</option>
                {pets.map((pet) => (
                  <option key={pet.petId} value={pet.petId}>
                    {pet.petName} - {pet.species}
                  </option>
                ))}
              </select>
              {formErrors.petId && (
                <div className="form-error-message">⚠️ {formErrors.petId}</div>
              )}
              {pets.length === 0 && !loading && (
                <div className="no-options">
                  No tienes mascotas registradas. Por favor, registra una mascota primero.
                </div>
              )}
            </div>

            {/* Veterinarian Selection */}
            <div className="form-group">
              <label htmlFor="veterinarianId" className="form-label">
                <span className="appointment-icon-label">
                  <span>👨‍⚕️</span>
                  Veterinario
                </span>
                <span className="required">*</span>
              </label>
              <select
                id="veterinarianId"
                name="veterinarianId"
                value={formData.veterinarianId}
                onChange={handleChange}
                className={`form-select ${
                  formErrors.veterinarianId ? "form-field-error" : ""
                }`}
                disabled={isSubmitting}
                required
              >
                <option value="">Selecciona un veterinario</option>
                {veterinarians.map((vet) => (
                  <option key={vet.id} value={vet.id}>
                    {vet.fullname}
                  </option>
                ))}
              </select>
              {formErrors.veterinarianId && (
                <div className="form-error-message">⚠️ {formErrors.veterinarianId}</div>
              )}
            </div>

            {/* Date and Time */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha" className="form-label">
                  <span className="appointment-icon-label">
                    <span>📅</span>
                    Fecha
                  </span>
                  <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  min={getMinDate()}
                  className={`form-input ${formErrors.fecha ? "form-field-error" : ""}`}
                  disabled={isSubmitting}
                  required
                />
                {formErrors.fecha && (
                  <div className="form-error-message">⚠️ {formErrors.fecha}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="hora" className="form-label">
                  <span className="appointment-icon-label">
                    <span>🕐</span>
                    Hora
                  </span>
                  <span className="required">*</span>
                </label>
                <input
                  type="time"
                  id="hora"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  className={`form-input ${formErrors.hora ? "form-field-error" : ""}`}
                  disabled={isSubmitting}
                  required
                />
                {formErrors.hora && (
                  <div className="form-error-message">⚠️ {formErrors.hora}</div>
                )}
                <span className="form-hint">Formato: HH:MM (ejemplo: 14:30)</span>
              </div>
            </div>

            {/* Reason */}
            <div className="form-group">
              <label htmlFor="motivo" className="form-label">
                <span className="appointment-icon-label">
                  <span>📋</span>
                  Motivo de la Cita
                </span>
                <span className="required">*</span>
              </label>
              <textarea
                id="motivo"
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                placeholder="Describe el motivo de la cita (mínimo 10 caracteres)"
                className={`form-textarea ${formErrors.motivo ? "form-field-error" : ""}`}
                disabled={isSubmitting}
                required
              />
              {formErrors.motivo && (
                <div className="form-error-message">⚠️ {formErrors.motivo}</div>
              )}
              <span className="form-hint">
                Ejemplo: Vacunación anual, chequeo general, consulta por síntomas, etc.
              </span>
            </div>

            {/* Submit Error */}
            {submitError && <div className="form-error">{submitError}</div>}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-modal btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn-modal btn-submit ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting || pets.length === 0 || veterinarians.length === 0}
            >
              {isSubmitting ? "" : "Agendar Cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointmentModal;
