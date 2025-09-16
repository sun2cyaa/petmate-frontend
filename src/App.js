// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

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
import CompanyManagePage from "./pages/company/CompanyManagePage";
import CompanyRegisterPage from "./pages/company/CompanyRegisterPage";
import ProductManagePage from "./pages/product/ProductManagePage";
import ProductRegisterPage from "./pages/product/ProductRegisterPage";
import ProductEditPage from "./pages/product/ProductEditPage";
import Notice from "./components/common/Header/Notice";
import Event from "./components/common/Header/Event";
import PetOwnerSignupPage from "./pages/user/petowner/PetOwnerSignupPage";

import "./styles/App.css";
import Header from "./components/common/Header/Header";
import { AuthProvider, useAuth } from "./context/AuthContext";


function AppRoutes() {
  const location = useLocation();
  const { isLogined, user, setIsLogined } = useAuth();

  const hideHeader = location.pathname.startsWith("/intro");

  return (
    <>
      {!hideHeader && (
        <Header isLogined={isLogined} setIsLogined={setIsLogined} user={user} />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/intro" replace />} />

          {/* 공개 */}
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/home" element={<HomePage isLogined={isLogined} setIsLogined={setIsLogined} user={user} />} />

          {/* 인증 */}
          <Route path="/signin" element={<SigninPage setIsLogined={setIsLogined} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect setIsLogined={setIsLogined} />} />

          {/* 일반 */}
          <Route path="/map" element={<MapPage />} />
          <Route path="/pets" element={<PetManagePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/address" element={<AddressManagePage user={user} />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/fail" element={<PaymentFailPage />} />

          {/* 반려인/펫메이트 */}
          <Route path="/become-petowner" element={<PetOwnerSignupPage />} />
          <Route path="/become-petmate" element={<PetMateSignupPage />} />
          <Route path="/booking" element={<BookingManagePage />} />

          {/* 업체 */}
          <Route path="/companymanage" element={<CompanyManagePage />} />
          <Route path="/companyregister" element={<CompanyRegisterPage />} />
          <Route path="/companyform" element={<CompanyRegisterPage />} />
          <Route path="/companyform/:id" element={<CompanyRegisterPage />} />

          {/* 상품 */}
          <Route path="/product" element={<ProductManagePage />} />
          <Route path="/product/register" element={<ProductRegisterPage />} />
          <Route path="/product/edit/:productId" element={<ProductEditPage />} />

          {/* 기타 */}
          <Route path="/notice" element={<Notice />} />
          <Route path="/event" element={<Event />} />
          <Route path="/test" element={<div>Test</div>} />

          {/* 없는 경로 */}
          <Route path="*" element={<Navigate to="/intro" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
