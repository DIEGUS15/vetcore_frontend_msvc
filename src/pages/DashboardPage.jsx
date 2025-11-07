import { useAuth } from "../context/AuthContext";
import VetSchedule from "../components/VetSchedule";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Bienvenido a VetCore!
            </h2>
            <p className="text-gray-600">Sistema de gestión veterinaria</p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Información de tu cuenta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Nombre Completo</p>
                <p className="text-lg font-medium text-gray-900">
                  {user?.fullname}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Correo Electrónico</p>
                <p className="text-lg font-medium text-gray-900">
                  {user?.email}
                </p>
              </div>

              {user?.telephone && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user.telephone}
                  </p>
                </div>
              )}

              {user?.address && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Dirección</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user.address}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Rol</p>
                <p className="text-lg font-medium text-gray-900 capitalize">
                  {user?.role}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user?.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user?.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>

          {user?.role === 'veterinarian' && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Mi Horario del Día
              </h3>
              <VetSchedule vetId={user.id} />
            </div>
          )}

          <div className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
            <h4 className="text-lg font-semibold text-indigo-900 mb-2">
              🎉 ¡Autenticación exitosa!
            </h4>
            <p className="text-indigo-700">
              Has iniciado sesión correctamente en el sistema VetCore. Desde
              aquí podrás acceder a todas las funcionalidades de la plataforma.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
