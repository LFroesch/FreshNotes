import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isCheckingAuth: true,
    isLoggingOut: false,
    isLoggingIn: false,
    signup: async (credentials) => {
        set({ isSigningUp: true });
        try {
            const response = await axios.post("/api/auth/signup", credentials);
            set({ user: response.data.user, isSigningUp: false})
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Signup failed");
            set({ isSigningUp: false , user: null });
        }
    },
    login: async (credentials) => {
        set({ isLoggingIn: true });
        try {
            const response = await axios.post("/api/auth/login", credentials);
            set({ user: response.data.user, isLoggingIn: false });
        } catch (error) {
            set({ isLoggingIn: false, user: null });
            toast.error(error.response.data.message || "Login failed");
        }
    },
    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axios.post("/api/auth/logout");
            set({ user: null, isLoggingOut: false });
            toast.success("Logged out successfully");
        } catch (error) {
            set({ isLoggingOut: false });
            toast.error(error.response.data.message || "Logout failed");
        }
    },
    authCheck: async () => {
        try {
            set ({ isCheckingAuth: true });
            const response = await axios.get("/api/auth/auth-check");
            set({ user: response.data.user, isCheckingAuth: false });
        } catch (error) {
            set({ user: null, isCheckingAuth: false });
            console.error("Authentication check failed:", error);
        }
    }
}));