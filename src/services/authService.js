// src/services/authService.js
import api from "./api";

const API_BASE =
    (typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.VITE_API_BASE) ||
    process.env.REACT_APP_API_BASE ||
    "http://localhost:8090";

/** 로그인 */
export const signin = async (id, pw) => {
    const res = await api.post("/auth/signin", { id, pw });
    const { accessToken } = res.data || {};
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    return res;
};

/** 회원가입 */
export const signup = (id, pw, mail) =>
    api.post("/auth/signup", { id, pw, mail });

/** 로그아웃: 백엔드 실패해도 조용히 처리 */
export const signout = async () => {
    const t = localStorage.getItem("accessToken");
    localStorage.removeItem("accessToken"); // 우선 제거
    try {
        await api.post(
            "/auth/signout",
            null,
            {
                headers: t ? { Authorization: `Bearer ${t}` } : {},
                validateStatus: () => true, // 401/403도 예외 미발생
            }
        );
    } catch (_) { /* ignore */ }
};

/** 공용 OAuth 시작 */
export const startOAuthLogin = (provider, next = "/home") => {
    // Spring Security 표준 엔드포인트 사용
    const url =
        `${API_BASE}/oauth2/authorization/${encodeURIComponent(provider)}`
        + `?next=${encodeURIComponent(next)}`;
    window.location.href = url;
};

/** 네이버 간편로그인 단축 함수 */
export const startNaverLogin = (next = "/home") =>
    startOAuthLogin("naver", next);

/** OAuth2 리다이렉트 처리: 쿼리/해시 둘 다 지원 */
export const handleOAuth2Redirect = () => {
    const sp = new URLSearchParams(window.location.search);
    const hp = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const access =
        sp.get("accessToken") || hp.get("accessToken") || null;
    const next =
        sp.get("next") || sessionStorage.getItem("postLoginRedirect") || "/home";

    if (access) {
        localStorage.setItem("accessToken", decodeURIComponent(access));
        sessionStorage.removeItem("postLoginRedirect");
        return { ok: true, next };
    }
    return { ok: false, next: "/signin" };
};
