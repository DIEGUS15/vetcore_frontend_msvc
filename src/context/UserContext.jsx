import { createContext, useState, useContext } from "react";
import {
  getUsersRequest,
  createUserRequest,
  updateUserRequest,
  deleteUserRequest,
} from "../api/user.js";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  /**
   * Get all users with pagination
   * @param {number} page - Page number
   * @param {number} limit - Users per page
   */
  const getUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await getUsersRequest(page, limit);

      if (res.data.success) {
        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener usuarios";
      setErrors(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data
   */
  const createUser = async (userData) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await createUserRequest(userData);

      if (res.data.success) {
        // Refresh the user list after creating
        await getUsers(pagination.currentPage, pagination.usersPerPage);
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al crear usuario";
      setErrors(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a user by ID (admin only)
   * @param {number} id - User ID
   * @param {Object} userData - User data to update
   */
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await updateUserRequest(id, userData);

      if (res.data.success) {
        // Update the user in the local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? res.data.data : user
          )
        );
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar usuario";
      setErrors(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Soft delete a user (set isActive to false) (admin only)
   * @param {number} id - User ID
   */
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await deleteUserRequest(id);

      if (res.data.success) {
        // Update the user's isActive status in the local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, isActive: false } : user
          )
        );
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al desactivar usuario";
      setErrors(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear errors
   */
  const clearErrors = () => {
    setErrors(null);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        pagination,
        loading,
        errors,
        getUsers,
        createUser,
        updateUser,
        deleteUser,
        clearErrors,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
