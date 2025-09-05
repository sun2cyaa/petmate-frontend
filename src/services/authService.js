import api from "./api";

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://localhost:8090";

export const signin = async (id, pw) => {
  const res = await api.post("/auth/signin", { id, pw });
  const { accessToken } = res.data;
  localStorage.setItem("accessToken", accessToken);
  return res;
};

export const signup = (id, pw, mail) =>
  api.post("/auth/signup", { id, pw, mail });

export const signout = async () => {
  localStorage.removeItem("accessToken");
  return api.post("/auth/signout");
};

// 네이버 간편로그인
export const startNaverLogin = () => {
  const redirect = `${window.location.origin}/oauth2/redirect`;
  window.location.href = `${API_BASE}/auth/oauth2/authorize/naver?redirect_uri=${encodeURIComponent(
    redirect
  )}`;
};

export const handleOAuth2Redirect = () => {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const access = params.get("accessToken");
  if (access) {
    localStorage.setItem("accessToken", access);
    return true;
  }
  return false;
};
