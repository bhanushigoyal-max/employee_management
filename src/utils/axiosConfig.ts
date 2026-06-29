import axios from 'axios';

const baseURLCustom = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const xSimVAlue = 'default-sim-value'; // Adjust as needed

export const agent = axios.create({
  baseURL: baseURLCustom,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Env": xSimVAlue,
  },
});

agent.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["X-Env"] = xSimVAlue;
  }

  // Ensure multipart is handled if passing FormData
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

agent.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("error", error);

    try {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      const pathname = globalThis?.location?.pathname;

      const shouldRedirect =
        pathname !== "/admin/" &&
        pathname !== "/admin/account/password";

      if ((status === 401 || message === "Unauthenticated.") && shouldRedirect) {
        localStorage.removeItem("persist:root");
        localStorage.removeItem("authToken");
        globalThis.location.href = "/admin";
      }

      throw error?.response?.data ?? error;
    } catch (err) {
      console.error("Error handling interceptor", err);
      throw err;
    }
  }
);

/**
 * Multipart agent
 */
export const multiagent = axios.create({
  baseURL: baseURLCustom,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    "X-Env": xSimVAlue,
  },
});

multiagent.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["X-Env"] = xSimVAlue;
  }

  return config;
});

multiagent.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("is it coming with error", error);

    try {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 401 || message === "Unauthenticated.") {
        localStorage.removeItem("persist:root");
        localStorage.removeItem("authToken");
        globalThis.location.href = "/admin";
      }

      throw error?.response?.data ?? error;
    } catch (err) {
      console.error("Error handling interceptor", err);
      throw err;
    }
  }
);
