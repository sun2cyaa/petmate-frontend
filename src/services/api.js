// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8090",
  withCredentials: false,   // 쿠키 미사용
  timeout: 10000,
});

// ▲ 방어적 인터셉터: 항상 헤더 JWT, withCredentials 강제 OFF
api.interceptors.request.use((config) => {
  config.withCredentials = false;
  const token = localStorage.getItem("accessToken");
  if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
});

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleAuthError = (error, { silent } = {}) => {
  if (error?.response?.status === 401) {
    if (silent) return null;
    localStorage.removeItem("accessToken");
    if (!window.location.pathname.includes("/signin")) window.location.href = "/signin";
    return null;
  }
  throw error;
};

// /auth/me
export const fetchMe = async ({ silent = false } = {}) => {
  try {
    const res = await api.get("/auth/me"); // 헤더/withCredentials는 인터셉터가 처리
    return res?.data;
  } catch (e) {
    const r = handleAuthError(e, { silent });
    if (r === null) return null;
    throw e;
  }
};

// 공통 래퍼
export const apiRequest = {
  get: async (url, config = {}) => {
    try {
      return await api.get(url, config);
    } catch (error) {
      const r = handleAuthError(error, { silent: config.silent });
      if (r === null) return null;
    }
  },
  post: async (url, data, config = {}) => {
    try {
      return await api.post(url, data, config);
    } catch (error) {
      const r = handleAuthError(error, { silent: config.silent });
      if (r === null) return null;
    }
  },
  put: async (url, data, config = {}) => {
    try {
      return await api.put(url, data, config);
    } catch (error) {
      const r = handleAuthError(error, { silent: config.silent });
      if (r === null) return null;
    }
  },
  delete: async (url, config = {}) => {
    try {
      return await api.delete(url, config);
    } catch (error) {
      const r = handleAuthError(error, { silent: config.silent });
      if (r === null) return null;
    }
  },
};

export default api;
