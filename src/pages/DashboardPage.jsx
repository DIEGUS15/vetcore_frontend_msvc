import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiUsers,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";
import { MdPets } from "react-icons/md";

const DashboardPage = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Mis Mascotas",
      description: "Ver y gestionar tus mascotas",
      icon: MdPets,
      link: "/pets",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-600",
      textColor: "text-emerald-700",
    },
    {
      title: "Mis Citas",
      description: "Programar y ver citas",
      icon: FiCalendar,
      link: "/appointments",
      bgColor: "bg-sky-50",
      iconBg: "bg-sky-600",
      textColor: "text-sky-700",
    },
    ...(user?.role === "admin"
      ? [
          {
            title: "Usuarios",
            description: "Gestionar usuarios del sistema",
            icon: FiUsers,
            link: "/users",
            bgColor: "bg-amber-50",
            iconBg: "bg-amber-600",
            textColor: "text-amber-700",
          },
        ]
      : []),
  ];

  const getRoleBadge = (role) => {
    const badges = {
      admin: {
        color: "bg-slate-100 text-slate-700 border-slate-300",
        label: "Administrador",
        icon: FiShield,
      },
      veterinarian: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Veterinario",
        icon: FiUser,
      },
      receptionist: {
        color: "bg-sky-50 text-sky-700 border-sky-200",
        label: "Recepcionista",
        icon: FiUser,
      },
      client: {
        color: "bg-zinc-100 text-zinc-700 border-zinc-300",
        label: "Cliente",
        icon: FiUser,
      },
    };
    return badges[role] || badges.client;
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Bienvenido, {user?.fullname?.split(" ")[0]}
            </h1>
            <p className="text-slate-600">
              Gestiona tu cuenta y accede a todas las funcionalidades
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-2xl font-semibold">
                {user?.fullname?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Información de la Cuenta
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <FiUser className="text-slate-400" />
                    Nombre Completo
                  </label>
                  <p className="text-base font-medium text-slate-900">
                    {user?.fullname}
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <FiMail className="text-slate-400" />
                    Correo Electrónico
                  </label>
                  <p className="text-base font-medium text-slate-900 break-all">
                    {user?.email}
                  </p>
                </div>

                {/* Phone */}
                {user?.telephone && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <FiPhone className="text-slate-400" />
                      Teléfono
                    </label>
                    <p className="text-base font-medium text-slate-900">
                      {user.telephone}
                    </p>
                  </div>
                )}

                {/* Address */}
                {user?.address && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <FiMapPin className="text-slate-400" />
                      Dirección
                    </label>
                    <p className="text-base font-medium text-slate-900">
                      {user.address}
                    </p>
                  </div>
                )}

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <roleBadge.icon className="text-slate-400" />
                    Rol
                  </label>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium ${roleBadge.color}`}
                  >
                    <roleBadge.icon className="text-sm" />
                    {roleBadge.label}
                  </span>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <FiShield className="text-slate-400" />
                    Estado
                  </label>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium ${
                      user?.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        user?.isActive ? "bg-emerald-500" : "bg-red-500"
                      } animate-pulse`}
                    ></div>
                    {user?.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Accesos Rápidos
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`block p-4 rounded-lg ${action.bgColor} hover:shadow-sm transition-all duration-200 group border border-transparent hover:border-slate-200`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${action.iconBg} rounded-lg flex items-center justify-center text-white flex-shrink-0`}
                    >
                      <action.icon className="text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium ${action.textColor} text-sm`}
                      >
                        {action.title}
                      </h3>
                      <p className="text-xs text-slate-600 truncate">
                        {action.description}
                      </p>
                    </div>
                    <FiArrowRight className="text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-slate-900 rounded-xl shadow-sm p-5 text-white">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-base">
                Sistema de Gestión Veterinaria
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Accede a todas las funcionalidades del sistema desde el menú de
                navegación superior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
