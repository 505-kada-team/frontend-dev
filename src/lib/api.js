import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, //browser mengizinkan pengiriman dan penerimaan cookie secara otomatis untuk refresh token.
});

// --- state token disimpan di module-level (RAM), bukan di localStorage ---
let accessToken = null;

// --- callback yang di-inject dari AuthProvider ---
let onTokenRefreshed = null; // dipanggil saat token berhasil di-refresh
let onSessionExpired = null; // dipanggil saat refresh token juga gagal

export function setAccessToken(token) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}
export function setAuthHandlers({ onRefreshed, onExpired }) {
  onTokenRefreshed = onRefreshed;
  onSessionExpired = onExpired;
}

// Attach access token ke tiap request
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Endpoint yang TIDAK boleh memicu auto-refresh (hindari infinite loop)
const EXCLUDE_REFRESH = ["/auth/login", "/auth/register", "/auth/refresh"];

let isRefreshing = false;
let queue = []; // agar refresh token tidak dipanggil berulang

// Interceptor untuk menangani 401 Unauthorized
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // simpan request asli agar bisa di-retry setelah token di-refresh
    const originalRequest = error.config;
    // cek apakah request ini termasuk yang dikecualikan dari auto-refresh
    const isExcluded = EXCLUDE_REFRESH.some((path) =>
      originalRequest?.url?.includes(path),
    );

    if (
      error.response?.status === 401 &&
      // set retry hanya sekali
      !originalRequest._retry &&
      // login dan refrsh tidak boleh auto refresh
      !isExcluded
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject, originalRequest });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await api.post("/auth/refresh");
        const newToken = data.data.accessToken;

        setAccessToken(newToken);
        onTokenRefreshed?.(newToken);

        queue.forEach(({ resolve, originalRequest: req }) => {
          req.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(req));
        });
        queue = [];

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        queue.forEach(({ reject }) => reject(refreshError));
        queue = [];

        setAccessToken(null);
        onSessionExpired?.(); // <-- inilah "sinyal" ke provider bahwa sesi benar-benar habis

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
