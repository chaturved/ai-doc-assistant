import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // needed to send cookies
});

// Interceptor to attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // call /auth/refresh
      try {
        const { data } = await axios.post("/api/auth/refresh", null, {
          withCredentials: true,
        });
        localStorage.setItem("access_token", data.access_token);
        error.config.headers.Authorization = `Bearer ${data.access_token}`;
        return axios.request(error.config);
      } catch {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
