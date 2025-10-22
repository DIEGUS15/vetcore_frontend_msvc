import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePet } from "../context/PetContext";
import PetTable from "../components/petcomponents/PetTable";
import CreatePetModal from "../components/petcomponents/CreatePetModal";
import UpdatePetModal from "../components/petcomponents/UpdatePetModal";
import "../styles/PetsPage.css";

const PetsPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { pets, pagination, loading, errors, getPets, createPet, updatePet, deletePet } = usePet();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 10;

  // Check if user is authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Load pets on mount and when page changes
  useEffect(() => {
    loadPets(currentPage);
  }, [currentPage]);

  const loadPets = async (page) => {
    try {
      await getPets(page, petsPerPage);
    } catch (error) {
      console.error("Error loading pets:", error);
    }
  };

  const handleCreatePet = async (petData) => {
    await createPet(petData);
  };

  const handleUpdatePet = async (petId, petData) => {
    await updatePet(petId, petData);
  };

  const handleDeletePet = async (petId) => {
    await deletePet(petId);
  };

  const handleEditClick = (pet) => {
    setSelectedPet(pet);
    setIsUpdateModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Check if user can create pets (admin or veterinarian)
  const canCreate = currentUser?.role === "admin" || currentUser?.role === "veterinarian";

  // Check if user can modify pets (admin or receptionist)
  const canModify = currentUser?.role === "admin" || currentUser?.role === "receptionist";

  return (
    <div className="pets-page">
      <div className="pets-page-container">
        <div className="pets-page-header">
          <div>
            <h1 className="pets-page-title">Gestión de Mascotas</h1>
            <p className="pets-page-subtitle">
              Administra el registro de mascotas del sistema VetCore
            </p>
          </div>
        </div>

        <div className="pets-page-content">
          <div className="pets-page-actions">
            <div style={{ color: "#4a5568" }}>
              <strong>Total de mascotas:</strong> {pagination.totalPets}
            </div>
            {canCreate && (
              <button
                className="btn-create-pet"
                onClick={() => setIsCreateModalOpen(true)}
                disabled={loading}
              >
                <span style={{ fontSize: "1.25rem" }}>+</span>
                Registrar Nueva Mascota
              </button>
            )}
          </div>

          {errors && (
            <div className="error-container">
              <div className="error-message">{errors}</div>
            </div>
          )}

          {loading && pets.length === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p style={{ marginTop: "1rem", color: "#718096" }}>
                Cargando mascotas...
              </p>
            </div>
          ) : pets.length === 0 ? (
            <div className="no-pets-message">
              <p>No hay mascotas registradas en el sistema.</p>
              {canCreate && <p>Haz clic en "Registrar Nueva Mascota" para agregar una.</p>}
            </div>
          ) : (
            <PetTable
              pets={pets}
              pagination={pagination}
              onEdit={handleEditClick}
              onDelete={handleDeletePet}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {canCreate && (
        <CreatePetModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreatePet}
        />
      )}

      {canModify && (
        <UpdatePetModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedPet(null);
          }}
          onUpdate={handleUpdatePet}
          pet={selectedPet}
        />
      )}
    </div>
  );
};

export default PetsPage;
