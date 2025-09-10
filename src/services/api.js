// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8090", // context-path 있으면 반영
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  // 토큰
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // FormData면 브라우저가 boundary 포함해서 보내게 둠
  if (config.data instanceof FormData) {
    config.headers = config.headers || {};
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
    config.transformRequest = [(d) => d];
  }

  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post("/auth/refresh"); // 쿠키 기반이면 withCredentials로 동작
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // FormData 재시도 시에도 Content-Type 강제 금지
        if (originalRequest.data instanceof FormData) {
          delete originalRequest.headers["Content-Type"];
          delete originalRequest.headers["content-type"];
          originalRequest.transformRequest = [(d) => d];
        }

        return api(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
