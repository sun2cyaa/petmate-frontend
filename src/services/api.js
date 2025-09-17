// src/services/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8090";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,   // refreshToken HttpOnly 쿠키
  timeout: 10000,
});

// === 토큰 유틸 ===
const getAccessToken = () => localStorage.getItem("accessToken") || "";
const setAccessToken = (t) =>
  t ? localStorage.setItem("accessToken", t) : localStorage.removeItem("accessToken");

export const getAuthHeaders = () => {
  const t = getAccessToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// 401 처리: refresh 후 한 번만 재시도
const tryRefresh = async () => {
  try {
    console.log("[api] tryRefresh 호출");
    const res = await axios.post(`${API_BASE}/auth/refresh`, null, { withCredentials: true });
    console.log("[api] refresh 응답:", res.status, res.data);
    const newToken = res?.data?.accessToken;
    if (newToken) {
      setAccessToken(newToken);
      console.log("[api] 새 accessToken 저장:", newToken.slice(0, 20) + "...");
      return newToken;
    }
    return null;
  } catch (err) {
    console.warn("[api] refresh 실패", err?.response?.status, err?.response?.data);
    return null;
  }
};

// 인터셉터로 모든 요청/응답 로그
api.interceptors.request.use((config) => {
  console.log("[api] 요청:", config.method?.toUpperCase(), config.url, {
    headers: config.headers,
    data: config.data,
  });
  return config;
});
api.interceptors.response.use(
  (res) => {
    console.log("[api] 응답:", res.status, res.config.url, res.data);
    return res;
  },
  (err) => {
    console.warn("[api] 응답 에러:", err?.response?.status, err?.config?.url, err?.response?.data);
    return Promise.reject(err);
  }
);

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

// 공통 래퍼
export const apiRequest = {
  get: async (url, config = {}) => {
    try {
      return await api.get(url, { ...config, headers: { ...config.headers, ...getAuthHeaders() } });
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
      return await api.post(url, data, { ...config, headers: { ...config.headers, ...getAuthHeaders() } });
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
      return await api.put(url, data, { ...config, headers: { ...config.headers, ...getAuthHeaders() } });
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
      return await api.delete(url, { ...config, headers: { ...config.headers, ...getAuthHeaders() } });
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
