import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { changePasswordRequest } from "../api/auth.js";
import "../styles/ChangePasswordPage.css";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validaciones del frontend
    if (formData.newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("La nueva contraseña debe ser diferente a la actual");
      return;
    }

    setLoading(true);

    try {
      const res = await changePasswordRequest({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (res.data.success) {
        setSuccess(true);

        // Actualizar el usuario para quitar mustChangePassword
        updateUser({ mustChangePassword: false });

        // Mostrar mensaje de éxito y redirigir después de 2 segundos
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al cambiar la contraseña";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="change-password-header">
          <div className="change-password-icon">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="change-password-title">Cambiar Contraseña</h2>
          <p className="change-password-subtitle">
            {user?.mustChangePassword
              ? "Por seguridad, debes cambiar tu contraseña temporal"
              : "Actualiza tu contraseña de acceso"}
          </p>
        </div>

        {user?.mustChangePassword && (
          <div className="warning-banner">
            <div className="warning-banner-content">
              <div className="warning-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="warning-text">
                  Esta es una contraseña temporal. Por tu seguridad, cámbiala
                  ahora.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <p>¡Contraseña cambiada exitosamente! Redirigiendo...</p>
          </div>
        )}

        <form className="change-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              Contraseña Actual
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              value={formData.currentPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Ingresa tu contraseña actual"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              Nueva Contraseña
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={formData.newPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Mínimo 8 caracteres"
            />
            <span className="form-hint">
              Debe tener al menos 8 caracteres
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Nueva Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>

          <div className="button-group">
            <button
              type="submit"
              disabled={loading || success}
              className="btn btn-primary"
            >
              {loading ? "Cambiando..." : "Cambiar Contraseña"}
            </button>

            {!user?.mustChangePassword && (
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            )}
          </div>

          {user?.mustChangePassword && (
            <div className="logout-link">
              <button
                type="button"
                onClick={logout}
                className="logout-button"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
