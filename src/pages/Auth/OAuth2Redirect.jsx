// src/pages/Auth/OAuth2Redirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuth2Redirect({ setIsLogined }) {
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const href = window.location.href;
            const url = new URL(href);

            // accessToken from ?accessToken=... or #accessToken=...
            const accessRaw =
                url.searchParams.get("accessToken") ||
                new URLSearchParams(window.location.hash.replace(/^#/, "")).get("accessToken");

            if (!accessRaw) {
                navigate("/signin?error=oauth2", { replace: true });
                return;
            }

            // URL 인코딩 해제
            const access = decodeURIComponent(accessRaw);

            // next 경로 확보 (세션 저장분 우선 사용)
            const nextParam = url.searchParams.get("next");
            const storedNext = sessionStorage.getItem("postLoginRedirect");
            let next = nextParam || storedNext || "/home";

            // 안전한 내부 경로만 허용
            if (typeof next !== "string" || !next.startsWith("/")) next = "/home";

            // 토큰 저장 및 상태 반영
            localStorage.setItem("accessToken", access);
            if (storedNext) sessionStorage.removeItem("postLoginRedirect");
            setIsLogined?.(true);

            // URL 정리 후 이동
            window.history.replaceState(null, "", next);
            navigate(next, { replace: true });
        } catch {
            navigate("/signin?error=oauth2", { replace: true });
        }
    }, [navigate, setIsLogined]);

    return <div style={{ padding: 16 }}>로그인 처리중...</div>;
}
