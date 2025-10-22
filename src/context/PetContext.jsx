import { createContext, useState, useContext } from "react";
import {
  getPetsRequest,
  createPetRequest,
  updatePetRequest,
  deletePetRequest,
} from "../api/pet.js";

const PetContext = createContext();

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePet must be used within a PetProvider");
  }
  return context;
};

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPets: 0,
    petsPerPage: 10,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  /**
   * Get all pets with pagination
   * @param {number} page - Page number
   * @param {number} limit - Pets per page
   */
  const getPets = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await getPetsRequest(page, limit);

      if (res.data) {
        setPets(res.data.pets);
        setPagination({
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalPets: res.data.totalPets,
          petsPerPage: res.data.petsPerPage,
        });
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener mascotas";
      setErrors(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new pet
   * @param {Object} petData - Pet data
   */
  const createPet = async (petData) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await createPetRequest(petData);

      if (res.data) {
        // Refresh the pet list after creating
        await getPets(pagination.currentPage, pagination.petsPerPage);
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al crear mascota";
      setErrors(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a pet by ID
   * @param {number} id - Pet ID
   * @param {Object} petData - Pet data to update
   */
  const updatePet = async (id, petData) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await updatePetRequest(id, petData);

      if (res.data) {
        // Update the pet in the local state
        setPets((prevPets) =>
          prevPets.map((pet) =>
            pet.petId === id ? res.data.pet : pet
          )
        );
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar mascota";
      setErrors(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Soft delete a pet (set isActive to false)
   * @param {number} id - Pet ID
   */
  const deletePet = async (id) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await deletePetRequest(id);

      if (res.data) {
        // Remove the pet from the local state or mark as inactive
        setPets((prevPets) =>
          prevPets.filter((pet) => pet.petId !== id)
        );

        // Update pagination count
        setPagination((prev) => ({
          ...prev,
          totalPets: prev.totalPets - 1,
        }));
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al eliminar mascota";
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
    <PetContext.Provider
      value={{
        pets,
        pagination,
        loading,
        errors,
        getPets,
        createPet,
        updatePet,
        deletePet,
        clearErrors,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};
