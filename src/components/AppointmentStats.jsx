import { useAppointment } from "../context/AppointmentContext";
import "../styles/AppointmentStats.css";

const AppointmentStats = () => {
  const { getAppointmentStats, loading } = useAppointment();

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="stats-loading-spinner"></div>
      </div>
    );
  }

  const stats = getAppointmentStats();

  const statCards = [
    {
      key: "total",
      label: "Total de Citas",
      value: stats.total,
      icon: "📅",
      description: "Todas tus citas",
      bgIcon: "📊",
    },
    {
      key: "pendiente",
      label: "Pendientes",
      value: stats.pendientes,
      icon: "⏳",
      description: "Por confirmar",
      bgIcon: "⏳",
    },
    {
      key: "confirmada",
      label: "Confirmadas",
      value: stats.confirmadas,
      icon: "✅",
      description: "Próximas citas",
      bgIcon: "✓",
    },
    {
      key: "completada",
      label: "Completadas",
      value: stats.completadas,
      icon: "🎉",
      description: "Finalizadas",
      bgIcon: "✓",
    },
    {
      key: "cancelada",
      label: "Canceladas",
      value: stats.canceladas,
      icon: "❌",
      description: "No realizadas",
      bgIcon: "✕",
    },
  ];

  return (
    <div className="appointment-stats">
      {statCards.map((stat) => (
        <div key={stat.key} className={`stat-card ${stat.key}`}>
          <div className="stat-header">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-icon">{stat.icon}</span>
          </div>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-description">{stat.description}</div>
          <div className="stat-background-icon">{stat.bgIcon}</div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentStats;
