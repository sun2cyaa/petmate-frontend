import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./services/api";

<<<<<<< HEAD
import IntroPage from "./pages/common/Intro/IntroPage";
import HomePage from './pages/common/Home/HomePage';
=======
import HomePage from "./pages/HomePage";
>>>>>>> 61ec50d3a956e3a8af60233e71572423ff711e8d
import SigninPage from "./pages/Auth/SigninPage";
import OAuth2Redirect from "./pages/Auth/OAuth2Redirect";
import Header from "./components/Header";

import "./styles/App.css";

function App() {
  const [isLogined, setIsLogined] = useState(false);
<<<<<<< HEAD
  const location = useLocation();
=======
  const [user, setUser] = useState(null); // 이메일/닉네임 등
>>>>>>> 61ec50d3a956e3a8af60233e71572423ff711e8d

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

<<<<<<< HEAD
 return (
    <>
      {/* intro 페이지가 아닐 때만 기본 헤더 렌더링 */}
      {location.pathname !== "/intro" && (
        <Header isLogined={isLogined} setIsLogined={setIsLogined} />
      )}

=======
  return (
    <BrowserRouter>
      <Header isLogined={isLogined} setIsLogined={setIsLogined} user={user} />
>>>>>>> 61ec50d3a956e3a8af60233e71572423ff711e8d
      <Routes>
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/" element={<HomePage />} />
<<<<<<< HEAD
        <Route
          path="/signin"
          element={<SigninPage setIsLogined={setIsLogined} />}
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFailPage />} />
=======
        <Route path="/signin" element={<SigninPage setIsLogined={setIsLogined} />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect setIsLogined={setIsLogined} />} />
>>>>>>> 61ec50d3a956e3a8af60233e71572423ff711e8d
      </Routes>
    </>
  );
}

export default App;
