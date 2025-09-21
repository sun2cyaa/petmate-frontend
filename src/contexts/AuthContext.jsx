// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe } from "../services/api";
import { signin as apiSignin, signout as apiSignout } from "../services/authService";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const normalizeRole = (v) => {
    let r = String(v ?? "1").trim();
    if ((r.startsWith('"') && r.endsWith('"')) || (r.startsWith("'") && r.endsWith("'"))) r = r.slice(1, -1).trim();
    return ["1", "2", "3", "4", "9"].includes(r) ? r : "1";
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLogined, setIsLogined] = useState(false);
    const [currentMode, setCurrentMode] = useState(() => {
        return localStorage.getItem("currentMode") || "owner";
    });

    // 앱 시작 시 토큰 있으면 1회만 me 호출
    useEffect(() => {
        const t = localStorage.getItem("accessToken");
        if (!t) return;
        (async () => {
            try {
                const me = await fetchMe({ silent: true });
                if (me) {
                    setUser({
                        ...me,
                        role: normalizeRole(me.role)
                    });
                    setIsLogined(true);
                } else {
                    setUser(null);
                    setIsLogined(false);
                }
            } catch {
                setUser(null);
                setIsLogined(false);
            }
        })();
    }, []);

    // 다른 탭에서의 로그인/로그아웃 상태 변경 감지 (실시간 동기화)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'accessToken') {
                if (e.newValue && e.newValue !== e.oldValue) {
                    // 다른 탭에서 로그인됨
                    console.log('🔄 다른 탭에서 로그인 감지, 사용자 정보 동기화 중...');
                    hydrateMe();
                } else if (!e.newValue && e.oldValue) {
                    // 다른 탭에서 로그아웃됨
                    console.log('🚪 다른 탭에서 로그아웃 감지, 현재 탭도 로그아웃 처리');
                    setUser(null);
                    setIsLogined(false);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = async (credentials) => {
        const res = await apiSignin(credentials.id, credentials.pw);
        const me = await fetchMe({ silent: true });       // 로그인 직후 1회
        if (me) {
            setUser({
                ...me,
                role: normalizeRole(me.role)
            });
            setIsLogined(true);
        }
        return res;
    };

    const hydrateMe = async () => {                     // 소셜 리다이렉트 후 등
        try {
            const me = await fetchMe({ silent: true });
            if (me) {
                setUser({
                    ...me,
                    role: normalizeRole(me.role)
                });
                setIsLogined(true);
            } else {
                setUser(null);
                setIsLogined(false);
            }
        } catch {
            setUser(null);
            setIsLogined(false);
        }
    };

    const switchMode = (mode) => {
        setCurrentMode(mode);
        localStorage.setItem("currentMode", mode);
    };

    const logout = async () => {
        try {
            await apiSignout();
        } finally {
            console.log('🚪 로그아웃 처리 중... (다른 탭에도 동기화됨)');
            localStorage.removeItem("accessToken");
            localStorage.removeItem("currentMode");
            setUser(null);
            setIsLogined(false);
            setCurrentMode("owner");
        }
    };

    const value = useMemo(() => ({
        user,
        isLogined,
        currentMode,
        setIsLogined,
        setUser,
        login,
        logout,
        hydrateMe,
        switchMode
    }), [user, isLogined, currentMode]);

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
