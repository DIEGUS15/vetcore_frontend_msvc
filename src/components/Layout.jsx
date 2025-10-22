import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Rutas que no deben mostrar ningún navbar ni footer
  const noLayoutRoutes = ["/login", "/register"];

  // Rutas protegidas que deben mostrar el AdminNavbar
  const protectedRoutes = ["/dashboard", "/users", "/pets"];

  const isNoLayoutRoute = noLayoutRoutes.includes(location.pathname);
  const isProtectedRoute = protectedRoutes.includes(location.pathname);

  // Si es una ruta sin layout, solo mostrar el contenido
  if (isNoLayoutRoute) {
    return <>{children}</>;
  }

  // Si es una ruta protegida y el usuario está autenticado, mostrar AdminNavbar
  if (isProtectedRoute && isAuthenticated) {
    return (
      <>
        <AdminNavbar />
        {children}
      </>
    );
  }

  // Para rutas públicas, mostrar el Navbar normal y Footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
