import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLock
} from "react-icons/fi";
import { MdPets } from "react-icons/md";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    {
      to: "/dashboard",
      icon: FiHome,
      label: "Dashboard",
      show: true,
    },
    {
      to: "/pets",
      icon: MdPets,
      label: "Mascotas",
      show: true,
    },
    {
      to: "/appointments",
      icon: FiCalendar,
      label: "Citas",
      show: user?.role !== "veterinarian",
    },
    {
      to: "/schedule",
      icon: FiCalendar,
      label: "Mi Programación",
      show: user?.role === "veterinarian",
    },
    {
      to: "/users",
      icon: FiUsers,
      label: "Usuarios",
      show: user?.role === "admin",
    },
  ];

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-slate-100 text-slate-700 border-slate-300",
      veterinarian: "bg-emerald-50 text-emerald-700 border-emerald-200",
      receptionist: "bg-sky-50 text-sky-700 border-sky-200",
      client: "bg-zinc-100 text-zinc-700 border-zinc-300",
    };
    return colors[role] || colors.client;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <MdPets className="text-white text-base" />
            </div>
            <span className="text-base font-semibold text-slate-900 hidden sm:inline">
              VetCore
            </span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) =>
              link.show ? (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  <link.icon className="text-base" />
                  <span>{link.label}</span>
                </NavLink>
              ) : null
            )}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.fullname?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left max-w-[140px]">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.fullname}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {user?.role}
                  </p>
                </div>
                <FiChevronDown className={`text-slate-400 text-sm transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-slate-900 truncate">{user?.fullname}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <NavLink
                    to="/change-password"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiLock className="w-4 h-4 mr-3" />
                    Cambiar Contraseña
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="mr-3" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-1">
            {/* User Info */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 mb-3">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.fullname?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.fullname}</p>
                <p className={`text-xs px-2 py-0.5 rounded-full border inline-block capitalize ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role}
                </p>
              </div>
            </div>

            {/* Nav Links */}
            {navLinks.map((link) =>
              link.show ? (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  <link.icon className="text-lg" />
                  <span>{link.label}</span>
                </NavLink>
              ) : null
            )}

            {/* Change Password */}
            <NavLink
              to="/change-password"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <FiLock className="text-lg" />
              <span>Cambiar Contraseña</span>
            </NavLink>

            {/* Logout */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="text-lg" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
