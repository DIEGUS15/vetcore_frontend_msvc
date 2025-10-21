import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import UserTable from "../components/usercomponents/UserTable";
import CreateUserModal from "../components/usercomponents/CreateUserModal";
import UpdateUserModal from "../components/usercomponents/UpdateUserModal";
import "../styles/UserPage.css";

const UserPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { users, pagination, loading, errors, getUsers, createUser, updateUser, deleteUser } = useUser();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Check if user is admin
  useEffect(() => {
    if (currentUser?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // Load users on mount and when page changes
  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const loadUsers = async (page) => {
    try {
      await getUsers(page, usersPerPage);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleCreateUser = async (userData) => {
    await createUser(userData);
  };

  const handleUpdateUser = async (userId, userData) => {
    await updateUser(userId, userData);
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="user-page">
      {/* Header */}
      <div className="user-page-container">
        <div className="user-page-header">
          <div>
            <h1 className="user-page-title">Gestión de Usuarios</h1>
            <p className="user-page-subtitle">
              Administra todos los usuarios del sistema VetCore
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="user-page-content">
          <div className="user-page-actions">
            <div></div>
            <button
              className="btn-create-user"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={loading}
            >
              <span style={{ fontSize: "1.25rem" }}>+</span>
              Crear Nuevo Usuario
            </button>
          </div>

          {errors && (
            <div className="error-container">
              <div className="error-message">{errors}</div>
            </div>
          )}

          {loading && users.length === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p style={{ marginTop: "1rem", color: "#718096" }}>
                Cargando usuarios...
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="no-users-message">
              <p>No hay usuarios registrados en el sistema.</p>
              <p>Haz clic en "Crear Nuevo Usuario" para agregar uno.</p>
            </div>
          ) : (
            <UserTable
              users={users}
              pagination={pagination}
              onEdit={handleEditClick}
              onDelete={handleDeleteUser}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />

      <UpdateUserModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedUser(null);
        }}
        onUpdate={handleUpdateUser}
        user={selectedUser}
      />
    </div>
  );
};

export default UserPage;
