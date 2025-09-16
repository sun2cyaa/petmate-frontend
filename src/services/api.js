// src/services/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8090";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,   // 쿠키 사용 (refreshToken HttpOnly)
  timeout: 10000,
});

// === 토큰 유틸 ===
const getAccessToken = () => localStorage.getItem("accessToken") || "";
const setAccessToken = (t) => (t ? localStorage.setItem("accessToken", t) : localStorage.removeItem("accessToken"));

export const getAuthHeaders = () => {
  const t = getAccessToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// 401 처리: refresh 후 한 번만 재시도
const tryRefresh = async () => {
  try {
    const res = await axios.post(`${API_BASE}/auth/refresh`, null, { withCredentials: true });
    const newToken = res?.data?.accessToken;
    if (newToken) {
      setAccessToken(newToken);
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
};

// /auth/me
export const fetchMe = async ({ silent = false } = {}) => {
  try {
    const res = await api.get("/auth/me", { headers: getAuthHeaders() });
    return res?.data;
  } catch (e) {
    if (e?.response?.status === 401) {
      const t = await tryRefresh();
      if (t) {
        const res = await api.get("/auth/me", { headers: { Authorization: `Bearer ${t}` } });
        return res?.data;
      }
      if (!silent) {
        setAccessToken("");
        if (!window.location.pathname.includes("/signin")) window.location.href = "/signin";
      }
      return null;
    }
    throw e;
  }
};

// 공통 래퍼들 (인터셉터 없이, 헤더는 호출부에서 넘기거나 자동으로 합침)
export const apiRequest = {
  get: async (url, config = {}) => {
    try {
      const res = await api.get(url, { ...config, headers: { ...config.headers, ...getAuthHeaders() } });
      return res;
    } catch (e) {
      if (e?.response?.status === 401) {
        const t = await tryRefresh();
        if (t) return await api.get(url, { ...config, headers: { ...config.headers, Authorization: `Bearer ${t}` } });
        setAccessToken("");
      }
      throw e;
    }
  },
  post: async (url, data, config = {}) => {
    try {
      const res = await api.post(url, data, { ...config, headers: { ...config.headers, ...getAuthHeaders() } });
      return res;
    } catch (e) {
      if (e?.response?.status === 401) {
        const t = await tryRefresh();
        if (t) return await api.post(url, data, { ...config, headers: { ...config.headers, Authorization: `Bearer ${t}` } });
        setAccessToken("");
      }
      throw e;
    }
  },
  put: async (url, data, config = {}) => {
    try {
      const res = await api.put(url, data, { ...config, headers: { ...config.headers, ...getAuthHeaders() } });
      return res;
    } catch (e) {
      if (e?.response?.status === 401) {
        const t = await tryRefresh();
        if (t) return await api.put(url, data, { ...config, headers: { ...config.headers, Authorization: `Bearer ${t}` } });
        setAccessToken("");
      }
      throw e;
    }
  },
  delete: async (url, config = {}) => {
    try {
      const res = await api.delete(url, { ...config, headers: { ...config.headers, ...getAuthHeaders() } });
      return res;
    } catch (e) {
      if (e?.response?.status === 401) {
        const t = await tryRefresh();
        if (t) return await api.delete(url, { ...config, headers: { ...config.headers, Authorization: `Bearer ${t}` } });
        setAccessToken("");
      }
      throw e;
    }
  },
};

export default api;
