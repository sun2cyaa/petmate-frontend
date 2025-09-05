import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Redirect = ({ setIsLogined }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const access = params.get("accessToken");

    if (access) {
      localStorage.setItem("accessToken", access);
      setIsLogined?.(true);
      navigate("/", { replace: true });
    } else {
      navigate("/signin?error=oauth2", { replace: true });
    }
  }, [navigate, setIsLogined]);

  return <div style={{ padding: 16 }}>로그인 처리중...</div>;
};

export default OAuth2Redirect;
