import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";


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

  useEffect(() => {
    
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLogined(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Header isLogined={isLogined} setIsLogined={setIsLogined} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SigninPage setIsLogined={setIsLogined} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
