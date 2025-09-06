import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion"; // 페이지 전환 애니메이션
import api from "./services/api";

import IntroPage from "./pages/common/Intro/IntroPage";
import HomePage from "./pages/common/Home/HomePage"; 
import SigninPage from "./pages/Auth/SigninPage";
import SignupPage from "./pages/Auth/SignupPage";
import OAuth2Redirect from "./pages/Auth/OAuth2Redirect";
import MapPage from "./pages/common/Map/MapPage";
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";
import PaymentFailPage from "./pages/payment/PaymentFailPage";
import Header from "./components/Header";

import "./styles/App.css";

function App() {
  const [isLogined, setIsLogined] = useState(false);
  const [user, setUser] = useState(null); // 이메일/닉네임 등
  const location = useLocation();

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
    <>
      {/* intro 페이지가 아닐 때만 Header 표시 */}
      {!location.pathname.startsWith("/intro") && (
        <Header
          isLogined={isLogined}
          setIsLogined={setIsLogined}
          user={user}
        />
      )}

      {/* 페이지 전환 애니메이션 적용 */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* / 들어가면 /intro로 이동 */}
          <Route path="/" element={<Navigate to="/intro" replace />} />

          <Route path="/intro" element={<IntroPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signin" element={<SigninPage setIsLogined={setIsLogined} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect setIsLogined={setIsLogined} />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/fail" element={<PaymentFailPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
