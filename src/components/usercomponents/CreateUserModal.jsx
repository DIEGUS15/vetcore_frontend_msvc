import { useState } from "react";
import "../../styles/Modal.css";

const CreateUserModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    telephone: "",
    address: "",
    roleName: "client",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onCreate(formData);
      // Reset form
      setFormData({
        fullname: "",
        email: "",
        password: "",
        telephone: "",
        address: "",
        roleName: "client",
        isActive: true,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Crear Nuevo Usuario</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">
                Nombre Completo<span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullname"
                className="form-input"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Ingrese el nombre completo"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Email<span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Contraseña Temporal<span className="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingrese una contraseña temporal"
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telephone"
                className="form-input"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="1234567890"
                maxLength={10}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ingrese la dirección"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Rol<span className="required">*</span>
              </label>
              <select
                name="roleName"
                className="form-select"
                value={formData.roleName}
                onChange={handleChange}
                required
              >
                <option value="client">Cliente</option>
                <option value="veterinarian">Veterinario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="form-group">
              <div className="form-checkbox-group">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  className="form-checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label htmlFor="isActive" className="form-checkbox-label">
                  Usuario activo
                </label>
              </div>
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
              {loading ? "" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
