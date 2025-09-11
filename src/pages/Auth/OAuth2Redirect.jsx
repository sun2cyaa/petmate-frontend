// src/pages/Auth/OAuth2Redirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuth2Redirect({ setIsLogined }) {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const access =
      url.searchParams.get("accessToken") ||
      new URLSearchParams(window.location.hash.slice(1)).get("accessToken");

    const next =
      url.searchParams.get("next") ||
      sessionStorage.getItem("postLoginRedirect") ||
      "/home";

    if (!access) {
      navigate("/signin?error=oauth2", { replace: true });
      return;
    }

    localStorage.setItem("accessToken", access);
    setIsLogined?.(true);

    // URL 정리 후 이동
    window.history.replaceState(null, "", next);
    navigate(next, { replace: true });
  }, [navigate, setIsLogined]);

  return <div style={{ padding: 16 }}>로그인 처리중...</div>;
}
