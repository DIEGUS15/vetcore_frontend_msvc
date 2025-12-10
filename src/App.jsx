import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { PetProvider } from "./context/PetContext";
import { AppointmentProvider } from "./context/AppointmentContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UserPage from "./pages/UserPage";
import PetsPage from "./pages/PetsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import VeterinarianSchedulePage from "./pages/VeterinarianSchedulePage";
import VeterinarianDashboardPage from "./pages/VeterinarianDashboardPage";
import MedicalAttentionPage from "./pages/MedicalAttentionPage";
import ClientMedicalHistoryPage from "./pages/ClientMedicalHistoryPage";
import HomePage from "./pages/HomePage";
import Products from "./pages/Products";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <PetProvider>
          <AppointmentProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/products" element={<Products />} />

                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute>
                      <ChangePasswordPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <UserPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/pets"
                  element={
                    <ProtectedRoute>
                      <PetsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/appointments"
                  element={
                    <ProtectedRoute>
                      <AppointmentsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/schedule"
                  element={
                    <ProtectedRoute>
                      <VeterinarianSchedulePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/appointments/:appointmentId/medical-attention"
                  element={
                    <ProtectedRoute>
                      <MedicalAttentionPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/my-pets/:petId/medical-history"
                  element={
                    <ProtectedRoute>
                      <ClientMedicalHistoryPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/veterinarian-dashboard"
                  element={
                    <ProtectedRoute>
                      <VeterinarianDashboardPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </BrowserRouter>
          </AppointmentProvider>
        </PetProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
