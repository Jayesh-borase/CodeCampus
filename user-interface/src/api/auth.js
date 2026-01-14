import axios from "axios";

// Base backend URL from .env


export const register = async (userData) => {
  try {
    const response = await axios.post("https://codecampus-2ypn.onrender.com/api/auth/signup", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Server error" };
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post("https://codecampus-2ypn.onrender.com/api/auth/login", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Login failed:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Server error" };
  }
};
