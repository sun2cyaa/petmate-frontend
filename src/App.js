import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import IntroPage from "./pages/common/Intro/IntroPage";
import HomePage from './pages/common/Home/HomePage';
import SigninPage from "./pages/Auth/SigninPage";
import SignupPage from "./pages/Auth/SignupPage";
import Header from './components/common/Header/Header';


import "./styles/App.css";
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccess from './pages/payment/PaymentSuccessPage';
import PaymentFailPage from "./pages/payment/PaymentFailPage";
import MapPage from "./pages/common/Map/MapPage";

function App() {
  const [isLogined, setIsLogined] = useState(false);
  const location = useLocation();

  useEffect(() => {
    
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLogined(true);
    }
  }, []);

 return (
    <>
      {/* intro 페이지가 아닐 때만 기본 헤더 렌더링 */}
      {location.pathname !== "/intro" && (
        <Header isLogined={isLogined} setIsLogined={setIsLogined} />
      )}

      <Routes>
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signin"
          element={<SigninPage setIsLogined={setIsLogined} />}
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFailPage />} />
      </Routes>
    </>
  );
}

export default App;
