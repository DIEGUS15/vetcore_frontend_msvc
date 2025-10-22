import axiosInstance from "./axios.js";

/**
 * Get all pets with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Pets per page (default: 10)
 * @returns {Promise} - Promise with pets data and pagination info
 */
export const getPetsRequest = (page = 1, limit = 10) =>
  axiosInstance.get(`/patients/pets?page=${page}&limit=${limit}`);

/**
 * Create a new pet
 * @param {Object} petData - Pet data
 * @param {string} [petData.photo] - Pet's photo URL
 * @param {string} petData.petName - Pet's name
 * @param {string} [petData.species] - Pet's species
 * @param {string} [petData.breed] - Pet's breed
 * @param {number} [petData.age] - Pet's age
 * @param {number} [petData.weight] - Pet's weight
 * @param {string} [petData.gender] - Pet's gender
 * @param {string} petData.owner - Owner's name
 * @returns {Promise} - Promise with created pet data
 */
export const createPetRequest = (petData) =>
  axiosInstance.post("/patients/pets", petData);

/**
 * Update a pet by ID
 * @param {number} id - Pet ID
 * @param {Object} petData - Pet data to update
 * @returns {Promise} - Promise with updated pet data
 */
export const updatePetRequest = (id, petData) =>
  axiosInstance.put(`/patients/pets/${id}`, petData);

/**
 * Soft delete a pet (set isActive to false)
 * @param {number} id - Pet ID
 * @returns {Promise} - Promise with deactivated pet data
 */
export const deletePetRequest = (id) =>
  axiosInstance.delete(`/patients/pets/${id}`);
