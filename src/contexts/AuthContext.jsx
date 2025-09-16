// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe } from "../services/api";
import { signin as apiSignin, signout as apiSignout } from "../services/authService";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const normalizeRole = (v) => {
  let r = String(v ?? "1").trim();
  if ((r.startsWith('"') && r.endsWith('"')) || (r.startsWith("'") && r.endsWith("'"))) r = r.slice(1, -1).trim();
  return ["1","2","3","4","9"].includes(r) ? r : "1";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLogined, setIsLogined] = useState(false);

  // 앱 시작 시 토큰 있으면 1회만 me 호출
  useEffect(() => {
    const t = localStorage.getItem("accessToken");
    if (!t) return;
    (async () => {
      try {
        const me = await fetchMe({ silent: true });
        if (me) { setUser({ ...me, role: normalizeRole(me.role) }); setIsLogined(true); }
        else { setUser(null); setIsLogined(false); }
      } catch {
        setUser(null); setIsLogined(false);
      }
    })();
  }, []);

  const login = async (credentials) => {
    const res = await apiSignin(credentials.id, credentials.pw);
    const me = await fetchMe({ silent: true });       // 로그인 직후 1회
    if (me) { setUser({ ...me, role: normalizeRole(me.role) }); setIsLogined(true); }
    return res;
  };

  const hydrateMe = async () => {                     // 소셜 리다이렉트 후 등
    try {
      const me = await fetchMe({ silent: true });
      if (me) { setUser({ ...me, role: normalizeRole(me.role) }); setIsLogined(true); }
      else { setUser(null); setIsLogined(false); }
    } catch {
      setUser(null); setIsLogined(false);
    }
  };

  const logout = async () => {
    try { await apiSignout(); } finally {
      localStorage.removeItem("accessToken");
      setUser(null); setIsLogined(false);
    }
  };

  const value = useMemo(() => ({
    user, isLogined, setIsLogined, setUser, login, logout, hydrateMe
  }), [user, isLogined]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
