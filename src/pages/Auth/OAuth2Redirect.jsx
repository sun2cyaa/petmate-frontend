// src/pages/Auth/OAuth2Redirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Redirect = ({ setIsLogined }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);

    const access =
      hash.get("accessToken") || query.get("accessToken") || null;

    // 백엔드에서 붙였을 수 있는 next 파라미터 or 사전에 저장한 경로
    const next =
      query.get("next") ||
      sessionStorage.getItem("postLoginRedirect") ||
      "/home";

    if (access) {
      // 로컬스토리지 사용하는 방식일 때만 저장
      localStorage.setItem("accessToken", access);
      setIsLogined?.(true);
    }

    // URL 정리: 토큰/해시 제거 후 이동
    window.history.replaceState(null, "", next);
    navigate(next, { replace: true });

    // 실패 시
    if (!access) {
      navigate("/signin?error=oauth2", { replace: true });
    }
  }, [navigate, setIsLogined]);

  return <div style={{ padding: 16 }}>로그인 처리중...</div>;
};

export default OAuth2Redirect;
