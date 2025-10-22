import { useState, useEffect } from "react";
import "../../styles/Modal.css";

const UpdatePetModal = ({ isOpen, onClose, onUpdate, pet }) => {
  const [formData, setFormData] = useState({
    photo: "",
    petName: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    owner: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pet) {
      setFormData({
        photo: pet.photo || "",
        petName: pet.petName || "",
        species: pet.species || "",
        breed: pet.breed || "",
        age: pet.age ? pet.age.toString() : "",
        weight: pet.weight ? pet.weight.toString() : "",
        gender: pet.gender || "",
        owner: pet.owner || "",
      });
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Prepare data object with only fields that have values
      const petData = {};

      // Required fields
      if (formData.petName && formData.petName.trim() !== "") {
        petData.petName = formData.petName.trim();
      }

      if (formData.owner && formData.owner.trim() !== "") {
        petData.owner = formData.owner.trim();
      }

      // Optional fields - only include if they have values
      if (formData.photo && formData.photo.trim() !== "") {
        petData.photo = formData.photo.trim();
      }

      if (formData.species && formData.species.trim() !== "") {
        petData.species = formData.species.trim();
      }

      if (formData.breed && formData.breed.trim() !== "") {
        petData.breed = formData.breed.trim();
      }

      if (formData.age && formData.age !== "") {
        petData.age = parseInt(formData.age);
      }

      if (formData.weight && formData.weight !== "") {
        petData.weight = parseFloat(formData.weight);
      }

      if (formData.gender && formData.gender !== "") {
        petData.gender = formData.gender;
      }

      await onUpdate(pet.petId, petData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar mascota");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !pet) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Editar Mascota</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">
                Nombre de la Mascota<span className="required">*</span>
              </label>
              <input
                type="text"
                name="petName"
                className="form-input"
                value={formData.petName}
                onChange={handleChange}
                placeholder="Ej: Max, Luna, Rocky"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Nombre del Dueño<span className="required">*</span>
              </label>
              <input
                type="text"
                name="owner"
                className="form-input"
                value={formData.owner}
                onChange={handleChange}
                placeholder="Nombre completo del dueño"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Especie</label>
              <input
                type="text"
                name="species"
                className="form-input"
                value={formData.species}
                onChange={handleChange}
                placeholder="Ej: Perro, Gato, Ave"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Raza</label>
              <input
                type="text"
                name="breed"
                className="form-input"
                value={formData.breed}
                onChange={handleChange}
                placeholder="Ej: Labrador, Siamés, Mestizo"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Edad (años)</label>
              <input
                type="number"
                name="age"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
                placeholder="Edad en años"
                min="0"
                step="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Peso (kg)</label>
              <input
                type="number"
                name="weight"
                className="form-input"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Peso en kilogramos"
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sexo</label>
              <select
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Seleccionar...</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">URL de Foto (Opcional)</label>
              <input
                type="text"
                name="photo"
                className="form-input"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://ejemplo.com/foto.jpg (opcional)"
              />
              <small style={{ color: "#718096", fontSize: "0.875rem" }}>
                Dejar vacío para mantener sin foto
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-modal btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn-modal btn-submit ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "" : "Actualizar Mascota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePetModal;
