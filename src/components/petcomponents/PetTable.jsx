import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/PetTable.css";

const PetTable = ({ pets, pagination, onEdit, onDelete, onPageChange, loading }) => {
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState(null);

  // Check if user can edit/delete (admin or receptionist)
  const canModify = user?.role === "admin" || user?.role === "receptionist";

  const handleDelete = async (petId, petName) => {
    if (window.confirm(`¿Estás seguro de que quieres desactivar a ${petName}?`)) {
      setDeletingId(petId);
      try {
        await onDelete(petId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      onPageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      onPageChange(pagination.currentPage + 1);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getGenderClass = (gender) => {
    if (!gender) return "unknown";
    const g = gender.toLowerCase();
    if (g === "male" || g === "macho" || g === "m") return "male";
    if (g === "female" || g === "hembra" || g === "f") return "female";
    return "unknown";
  };

  const getGenderLabel = (gender) => {
    if (!gender) return "N/A";
    const g = gender.toLowerCase();
    if (g === "male" || g === "macho" || g === "m") return "Macho";
    if (g === "female" || g === "hembra" || g === "f") return "Hembra";
    return gender;
  };

  return (
    <>
      <div className="pet-table-container">
        <table className="pet-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Raza</th>
              <th>Edad</th>
              <th>Peso (kg)</th>
              <th>Sexo</th>
              <th>Dueño</th>
              {canModify && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.petId}>
                <td>
                  {pet.photo ? (
                    <img
                      src={pet.photo}
                      alt={pet.petName}
                      className="pet-photo"
                    />
                  ) : (
                    <div className="pet-photo-placeholder">
                      {getInitials(pet.petName)}
                    </div>
                  )}
                </td>
                <td style={{ fontWeight: "600" }}>{pet.petName}</td>
                <td>{pet.species || "N/A"}</td>
                <td>{pet.breed || "N/A"}</td>
                <td>{pet.age ? `${pet.age} años` : "N/A"}</td>
                <td>{pet.weight ? `${pet.weight} kg` : "N/A"}</td>
                <td>
                  <span className={`pet-gender ${getGenderClass(pet.gender)}`}>
                    {getGenderLabel(pet.gender)}
                  </span>
                </td>
                <td>{pet.owner || "N/A"}</td>
                {canModify && (
                  <td>
                    <div className="pet-actions">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => onEdit(pet)}
                        disabled={loading}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(pet.petId, pet.petName)}
                        disabled={deletingId === pet.petId || loading}
                      >
                        {deletingId === pet.petId ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Mostrando {pets.length} de {pagination.totalPets} mascotas
          {" - "}Página {pagination.currentPage} de {pagination.totalPages}
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={pagination.currentPage === 1 || loading}
          >
            ← Anterior
          </button>
          <span className="pagination-page">{pagination.currentPage}</span>
          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={pagination.currentPage === pagination.totalPages || loading}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </>
  );
};

export default PetTable;
