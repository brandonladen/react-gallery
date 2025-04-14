import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'artist' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isArtist: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsArtist: (email: string, password: string) => Promise<void>;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: { firstName: string; lastName: string; email: string }) => void;
  updateUserPassword: (currentPassword: string, newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isArtist, setIsArtist] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);isAuthenticated

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (savedUser && token) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsArtist(parsedUser.role === 'artist');
      setIsAdmin(parsedUser.role === 'admin');
      console.log("Retrieved token:", token);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/v0.1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await response.json();
      console.log("Received token:", data.accessToken); // Log token

      // Decode the JWT token
      const decodedToken: any = jwtDecode(data.accessToken);
      console.log("Decoded Token:", decodedToken);

      const loggedInUser: User = {
        id: decodedToken.id || "",
        email: decodedToken.email || "", 
        firstName: decodedToken.firstName || "User", // Default to "User" if missing
        lastName: decodedToken.lastName || "Anonymous", // Default to "Anonymous" if missing
        role: decodedToken.role || "user", // Default role to "user"
        // role: "artist", // Default role to "user"
      };  

      setUser(loggedInUser);
      setIsAuthenticated(true);
      setIsArtist(loggedInUser.role === 'artist');
      setIsAdmin(loggedInUser.role === 'admin');

      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('accessToken', data.accessToken);

      toast.success(`Logged in as ${loggedInUser.role}`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message);
      throw error;
    }
  };

  // const loginAsArtist = async (email: string, password: string) => {
  //   return login(email, password);
  // };

  const loginAsArtist = async (email: string, password: string) => {
    await login(email, password); // First, login normally
  
    setUser((prevUser) => {
      if (!prevUser) return null;
  
      const updatedUser: User = { 
        ...prevUser, 
        role: "artist" as "artist" // Explicitly setting type
      };
  
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  
    setIsArtist(true);
    toast.success("Logged in as Artist");
  };
  
  

  const loginAsAdmin = async (email: string, password: string) => {
    await login(email, password);

    setUser((prevUser) => {
      if (!prevUser) return null;
  
      const updatedUser: User = { 
        ...prevUser, 
        role: "admin" as "admin" // Explicitly setting type
      };
  
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  
    setIsAdmin(true);
    toast.success("Logged in as Admin");
  };

  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
        const response = await fetch('/api/v0.1/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, firstName, lastName }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();
        console.log("Received token on registration:", data.accessToken); // Log token

        // Decode the JWT token
        const decodedToken: any = jwtDecode(data.accessToken);
        console.log("Decoded Token:", decodedToken); // Debugging

        // Extract user details from the token, fallback to provided values if missing
        const newUser: User = {
            id: decodedToken?.id || "unknown",
            email: decodedToken?.email || email,
            firstName: decodedToken?.firstName || firstName || "User",
            lastName: decodedToken?.lastName || lastName || "Anonymous",
            role: decodedToken?.role || "user",
        };

        setUser(newUser);
        setIsAuthenticated(true);

        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('accessToken', data.accessToken);

        toast.success(`Welcome ${newUser.firstName}! Registration successful.`);
    } catch (error) {
        console.error("Registration error:", error);
        toast.error(error.message);
        throw error;
    }
};

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsArtist(false);
    setIsAdmin(false);

    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');

    toast.success('Logged out successfully');
  };

  const updateUserProfile = (data: { firstName: string; lastName: string; email: string }) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const updateUserPassword = (currentPassword: string, newPassword: string) => {
    console.log('Password updated from', currentPassword, 'to', newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isArtist,
        isAdmin,
        login,
        loginAsArtist,
        loginAsAdmin,
        register,
        logout,
        updateUserProfile,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
