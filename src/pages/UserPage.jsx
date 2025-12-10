import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import UserTable from "../components/usercomponents/UserTable";
import CreateUserModal from "../components/usercomponents/CreateUserModal";
import UpdateUserModal from "../components/usercomponents/UpdateUserModal";
import { FiUsers } from "react-icons/fi";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
            <FiUsers className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
            <p className="text-slate-600">
              Administra todos los usuarios del sistema VetCore
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div></div>
          <button
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={loading}
          >
            <span className="text-xl">+</span>
            Crear Nuevo Usuario
          </button>
        </div>

        {/* Error Message */}
        {errors && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-medium">{errors}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && users.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-600">Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="text-slate-400 text-2xl" />
            </div>
            <p className="text-slate-600 mb-2">No hay usuarios registrados en el sistema.</p>
            <p className="text-slate-500 text-sm">
              Haz clic en "Crear Nuevo Usuario" para agregar uno.
            </p>
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
