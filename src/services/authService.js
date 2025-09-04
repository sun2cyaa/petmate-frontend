import api from "./api";

// 로그인
export const signin = async (id, pw) => {
  const res = await api.post("/auth/signin", { id, pw });
  const { accessToken } = res.data;

  localStorage.setItem("accessToken", accessToken);
  return res;
};

// 회원가입
export const signup = (id, pw, mail) =>
  api.post("/auth/signup", { id, pw, mail });

// 로그아웃
export const signout = async () => {
  localStorage.removeItem("accessToken");
  return api.post("/auth/signout");
};
