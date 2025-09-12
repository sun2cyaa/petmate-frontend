// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { apiRequest } from "./services/api";

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

import PetMateSignupPage from "./pages/user/petmate/PetMateSignupPage";
import BookingManagePage from "./pages/user/petmate/BookingManagePage";

import "./styles/App.css";
import Header from "./components/common/Header/Header";
import Test from "./components/test/Test";
import CompanyManagePage from "./pages/company/CompanyManagePage";
import CompanyRegisterPage from "./pages/company/CompanyRegisterPage";
import ProductManagePage from "./pages/product/ProductManagePage";
import ProductRegisterPage from './pages/product/ProductRegisterPage';
import ProductEditPage from './pages/product/ProductEditPage';

function App() {
  const [isLogined, setIsLogined] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    apiRequest
      .get("/auth/me")
      .then((res) => {
        if (!mounted) return;
        setIsLogined(true);
        setUser(res?.data);
      })
      .catch(() => {
        if (!mounted) return;
        setIsLogined(false);
        setUser(null);
      });
    return () => { mounted = false; };
  }, []);

  const hideHeader = location.pathname.startsWith("/intro");

  return (
    <>
      {!hideHeader && (
        <Header isLogined={isLogined} setIsLogined={setIsLogined} user={user} />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* 기본 진입 → 인트로 */}
          <Route path="/" element={<Navigate to="/intro" replace />} />

          {/* 무조건 공개 */}
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/home" element={<HomePage />} />

          {/* 로그인 / 회원가입 */}
          <Route path="/signin" element={<SigninPage setIsLogined={setIsLogined} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect setIsLogined={setIsLogined} />} />

          {/* 나머지 (보호 여부 미정) */}
          <Route path="/map" element={<MapPage />} />
          <Route path="/pets" element={<PetManagePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/address" element={<AddressManagePage user={user} />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/fail" element={<PaymentFailPage />} />
          <Route path="/become-petmate" element={<PetMateSignupPage />} />
          <Route path="/companymanage" element={<CompanyManagePage />} />
          <Route path="/companyregister" element={<CompanyRegisterPage />} />
          <Route path="/booking" element={<BookingManagePage />} />
          <Route path="/product" element={<ProductManagePage />} />
          <Route path="/product/register" element={<ProductRegisterPage />} />
          <Route path="/product/edit/:productId" element={<ProductEditPage />} />
          <Route path="/test" element={<Test />} />

          {/* 없는 경로 → 인트로 */}
          <Route path="*" element={<Navigate to="/intro" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
