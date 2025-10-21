import { useState } from "react";
import "../../styles/UserTable.css";

const UserTable = ({ users, pagination, onEdit, onDelete, onPageChange, loading }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro de que quieres desactivar este usuario?")) {
      setDeletingId(userId);
      try {
        await onDelete(userId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      onPageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      onPageChange(pagination.currentPage + 1);
    }
  };

  return (
    <>
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.telephone || "N/A"}</td>
                <td>
                  <span className="user-role">{user.role?.name || "N/A"}</span>
                </td>
                <td>
                  <span
                    className={`user-status ${
                      user.isActive ? "active" : "inactive"
                    }`}
                  >
                    {user.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <div className="user-actions">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit(user)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(user.id)}
                      disabled={!user.isActive || deletingId === user.id || loading}
                    >
                      {deletingId === user.id ? "Desactivando..." : "Desactivar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Mostrando {users.length} de {pagination.totalUsers} usuarios
          {" - "}Página {pagination.currentPage} de {pagination.totalPages}
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={!pagination.hasPrevPage || loading}
          >
            ← Anterior
          </button>
          <span className="pagination-page">{pagination.currentPage}</span>
          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage || loading}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </>
  );
};

export default UserTable;
