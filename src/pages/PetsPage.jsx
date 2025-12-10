import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePet } from "../context/PetContext";
import PetTable from "../components/petcomponents/PetTable";
import CreatePetModal from "../components/petcomponents/CreatePetModal";
import UpdatePetModal from "../components/petcomponents/UpdatePetModal";
import { MdPets } from "react-icons/md";

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

  // Check if user can create pets (admin, veterinarian, or client with limit)
  const canCreate =
    currentUser?.role === "admin" ||
    currentUser?.role === "veterinarian" ||
    (currentUser?.role === "client" && pagination.totalPets < 5);

  // Check if user can modify pets (admin or receptionist)
  const canModify = currentUser?.role === "admin" || currentUser?.role === "receptionist";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <MdPets className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestión de Mascotas</h1>
            <p className="text-slate-600">
              Administra el registro de mascotas del sistema VetCore
            </p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-slate-600">
            <strong className="text-slate-900">Total de mascotas:</strong> {pagination.totalPets}
            {currentUser?.role === "client" && (
              <span className="ml-2 text-sm">
                (máximo 5)
              </span>
            )}
          </div>
          {canCreate && (
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={loading}
            >
              <span className="text-xl">+</span>
              Registrar Nueva Mascota
            </button>
          )}
          {currentUser?.role === "client" && pagination.totalPets >= 5 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
              <p className="text-amber-700 text-sm font-medium">
                Has alcanzado el límite de 5 mascotas
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">{errors}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && pets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Cargando mascotas...</p>
        </div>
      ) : pets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdPets className="text-slate-400 text-2xl" />
          </div>
          <p className="text-slate-600 mb-2">No hay mascotas registradas en el sistema.</p>
          {canCreate && (
            <p className="text-slate-500 text-sm">
              Haz clic en "Registrar Nueva Mascota" para agregar una.
            </p>
          )}
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
