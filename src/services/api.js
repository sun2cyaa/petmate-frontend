// src/services/api.js
import axios from "axios";

// 단순한 axios 인스턴스 - 인터셉터 없음
const api = axios.create({
    baseURL: "http://localhost:8090",
    withCredentials: true,
});

// JWT 토큰을 헤더에 추가하는 헬퍼 함수
export const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// 401 에러 처리 헬퍼 함수
export const handleAuthError = (error) => {
    if (error?.response?.status === 401) {
        console.log('JWT 토큰 만료 - 로그아웃 처리');
        localStorage.removeItem("accessToken");
        if (!window.location.pathname.includes('/signin')) {
            window.location.href = "/signin";
        }
    }
    throw error;
};

// API 요청 래퍼 함수들
export const apiRequest = {
    get: async (url, config = {}) => {
        try {
            return await api.get(url, {
                ...config,
                headers: { ...getAuthHeaders(), ...config.headers }
            });
        } catch (error) {
            handleAuthError(error);
        }
    },
    
    post: async (url, data, config = {}) => {
        try {
            return await api.post(url, data, {
                ...config,
                headers: { ...getAuthHeaders(), ...config.headers }
            });
        } catch (error) {
            handleAuthError(error);
        }
    },
    
    put: async (url, data, config = {}) => {
        try {
            return await api.put(url, data, {
                ...config,
                headers: { ...getAuthHeaders(), ...config.headers }
            });
        } catch (error) {
            handleAuthError(error);
        }
    },
    
    delete: async (url, config = {}) => {
        try {
            return await api.delete(url, {
                ...config,
                headers: { ...getAuthHeaders(), ...config.headers }
            });
        } catch (error) {
            handleAuthError(error);
        }
    }
};

export default api;
