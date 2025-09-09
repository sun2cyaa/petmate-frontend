// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
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
import AddressManagePage from "./pages/user/owner/MyPage/Address/AddressManagePage";
import PetManagePage from "./pages/user/owner/MyPage/PetManagePage";
import ProfilePage from "./pages/user/owner/MyPage/ProfilePage";

import "./styles/App.css";
import Header from "./components/common/Header/Header";
import BecomePetmatePage from "./pages/user/petmate/BecomePetmatePage";

function App() {
  const [isLogined, setIsLogined] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    api
      .get("/auth/me", { withCredentials: true })
      .then((res) => {
        if (!mounted) return;
        setIsLogined(true);
        setUser(res.data);
      })
      .catch(() => {
        if (!mounted) return;
        setIsLogined(false);
        setUser(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {!location.pathname.startsWith("/intro") && (
        <Header isLogined={isLogined} setIsLogined={setIsLogined} user={user} />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/intro" replace />} />

          <Route path="/intro" element={<IntroPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signin" element={<SigninPage setIsLogined={setIsLogined} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect setIsLogined={setIsLogined} />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/pets" element={<PetManagePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/address" element={<AddressManagePage user={user} />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/fail" element={<PaymentFailPage />} />
          <Route path="/become-petmate" element={<BecomePetmatePage />} /> {/* 추가 */}
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
