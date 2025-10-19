import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, registerRequest } from "../api/auth.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  // Verificar si hay un usuario guardado al cargar la app
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (userData) => {
    try {
      setErrors(null);
      const res = await registerRequest(userData);

      if (res.data.success) {
        // Después del registro, hacer login automáticamente
        const loginRes = await loginRequest({
          email: userData.email,
          password: userData.password,
        });

        if (loginRes.data.success) {
          const { token, user } = loginRes.data.data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          setIsAuthenticated(true);
        }
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al registrar usuario";
      setErrors(errorMessage);
      throw error;
    }
  };

  const signin = async (credentials) => {
    try {
      setErrors(null);
      const res = await loginRequest(credentials);

      if (res.data.success) {
        const { token, user } = res.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
      }

      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al iniciar sesión";
      setErrors(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        errors,
        signup,
        signin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
