import { useAppointment } from "../context/AppointmentContext";
import "../styles/AppointmentFilters.css";

const AppointmentFilters = () => {
  const { filters, filterByStatus, toggleIncludeInactive, clearFilters, loading } =
    useAppointment();

  const statusOptions = [
    { value: "pendiente", label: "Pendiente", emoji: "⏳" },
    { value: "confirmada", label: "Confirmada", emoji: "✅" },
    { value: "completada", label: "Completada", emoji: "🎉" },
    { value: "cancelada", label: "Cancelada", emoji: "❌" },
  ];

  const handleStatusClick = (status) => {
    // If clicking the active filter, clear it
    if (filters.status === status) {
      filterByStatus(null);
    } else {
      filterByStatus(status);
    }
  };

  const hasActiveFilters = filters.status !== null || filters.includeInactive;

  return (
    <div className="appointment-filters">
      <div className="filters-header">
        <h3 className="filters-title">
          <span>🔍</span>
          Filtros
          {hasActiveFilters && <span className="active-filters-count">Activo</span>}
        </h3>
        {hasActiveFilters && (
          <button
            className="filters-clear-btn"
            onClick={clearFilters}
            disabled={loading}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="filters-body">
        <div className="filter-group">
          <span className="filter-label">Estado</span>
          <div className="filter-buttons">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={`filter-btn ${option.value} ${
                  filters.status === option.value ? "active" : ""
                }`}
                onClick={() => handleStatusClick(option.value)}
                disabled={loading}
              >
                <span>{option.emoji}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Visibilidad</span>
          <label className="filter-toggle">
            <input
              type="checkbox"
              className="filter-checkbox"
              checked={filters.includeInactive}
              onChange={toggleIncludeInactive}
              disabled={loading}
            />
            <span className="filter-toggle-label">Incluir citas inactivas</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AppointmentFilters;
