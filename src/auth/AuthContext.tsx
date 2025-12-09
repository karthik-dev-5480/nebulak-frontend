"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios, { AxiosInstance } from "axios";

interface Role {
  id: number;
  name: string;
  description: string;
  level: number;
}

// Define the structure for an item in the 'roles' array
interface UserRole {
  role: Role;
}

// Update the main User interface
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profile_pic: string | null; // Changed to match the JSON (null is possible)
  mobile: string | null;     // Changed to match the JSON (null is possible)
  address?: any[];
  paymentInformation?: any[];
  
  // 🔑 THE FIX: Add the required 'roles' property
  roles: UserRole[]; 
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  authAxios: AxiosInstance;
  reloadUser: () => Promise<void>; // <-- ADDED: Function to reload user data
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base URL of your Spring Boot API
const API_BASE_URL = "https://nebulak-backend.onrender.com/";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken).catch((err) => {
        console.warn("No valid token yet:", err.message);
        localStorage.removeItem("token");
        setToken(null);
      });
    }
  }, []);

  const fetchUser = async (jwt: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setUser(res.data);
      console.log("User profile fetched/reloaded successfully.", res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      // Optional: If fetching fails, the token might be expired.
      // You could automatically log the user out here.
      // logout();
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, { firstName, lastName, email, password });
      const jwt = response.data.jwt;
      //setToken(jwt);
      //localStorage.setItem("token", jwt);
      //await fetchUser(jwt);
      return true;
    } catch (error) {
      console.error("Signup failed", error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, { email, password });
      const jwt = response.data.jwt;
      setToken(jwt);
      localStorage.setItem("token", jwt);
      await fetchUser(jwt);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  // NEW FUNCTION to be exposed by the context
  const reloadUser = async () => {
    if (token) {
      await fetchUser(token);
    } else {
      console.warn("Attempted to reload user data without a token.");
    }
  };


  const authAxios: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
  });

  authAxios.interceptors.request.use((config) => {
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, authAxios, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};