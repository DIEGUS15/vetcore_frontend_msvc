import axiosInstance from "./axios.js";

/**
 * Get all users with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Users per page (default: 10)
 * @returns {Promise} - Promise with users data and pagination info
 */
export const getUsersRequest = (page = 1, limit = 10) =>
  axiosInstance.get(`/users?page=${page}&limit=${limit}`);

/**
 * Create a new user (admin only)
 * @param {Object} userData - User data
 * @param {string} userData.fullname - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password (will be encrypted)
 * @param {string} [userData.telephone] - User's telephone
 * @param {string} [userData.address] - User's address
 * @param {string} [userData.roleName] - User's role name (default: "client")
 * @param {boolean} [userData.isActive] - User's active status (default: true)
 * @returns {Promise} - Promise with created user data
 */
export const createUserRequest = (userData) =>
  axiosInstance.post("/users", userData);

/**
 * Update a user by ID (admin only)
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise} - Promise with updated user data
 */
export const updateUserRequest = (id, userData) =>
  axiosInstance.put(`/users/${id}`, userData);

/**
 * Soft delete a user (set isActive to false) (admin only)
 * @param {number} id - User ID
 * @returns {Promise} - Promise with deactivated user data
 */
export const deleteUserRequest = (id) =>
  axiosInstance.delete(`/users/${id}`);
