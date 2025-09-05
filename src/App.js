import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./services/api";

import HomePage from "./pages/HomePage";
import SigninPage from "./pages/Auth/SigninPage";
import OAuth2Redirect from "./pages/Auth/OAuth2Redirect";
import Header from "./components/Header";

import "./styles/App.css";

function App() {
  const [isLogined, setIsLogined] = useState(false);
  const [user, setUser] = useState(null); // 이메일/닉네임 등

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLogined(false);
      setUser(null);
      return;
    }
    // /auth/me로 프로필 조회
    api
      .get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        setIsLogined(true);
        setUser(res.data); // { userId, email, nickname, picture, provider, roles }
      })
      .catch(() => {
        setIsLogined(false);
        setUser(null);
        localStorage.removeItem("accessToken");
      });
  }, []);

  return (
    <BrowserRouter>
      <Header isLogined={isLogined} setIsLogined={setIsLogined} user={user} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SigninPage setIsLogined={setIsLogined} />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect setIsLogined={setIsLogined} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
