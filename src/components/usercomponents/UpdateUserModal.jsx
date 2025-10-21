import { useState, useEffect } from "react";
import "../../styles/Modal.css";

const UpdateUserModal = ({ isOpen, onClose, onUpdate, user }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    telephone: "",
    address: "",
    roleName: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        password: "", // No pre-fill password
        telephone: user.telephone || "",
        address: user.address || "",
        roleName: user.role?.name || "client",
        isActive: user.isActive ?? true,
      });
    }
  }, [user]);

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
      // Create update data object, exclude password if empty
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      await onUpdate(user.id, updateData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Editar Usuario</h2>
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
                Nueva Contraseña
              </label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Dejar vacío para mantener la actual"
                minLength={6}
              />
              <small style={{ color: "#718096", fontSize: "0.875rem" }}>
                Dejar vacío si no desea cambiar la contraseña
              </small>
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
                  id="isActiveUpdate"
                  name="isActive"
                  className="form-checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label htmlFor="isActiveUpdate" className="form-checkbox-label">
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
              {loading ? "" : "Actualizar Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
