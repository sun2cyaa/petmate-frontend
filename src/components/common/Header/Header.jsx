import { Link } from "react-router-dom";
import "./Header.css";
import { signout } from "../../../services/authService";
import { useRef, useState, useEffect } from "react";
import {
  MapPin, Dog, User, Home, LogOut,
  Map, CreditCard, Star, CalendarCheck, ClipboardList, Building2, Package
} from "lucide-react"; 

function Header({ isLogined, setIsLogined, user }) {
  const [userOpen, setUserOpen] = useState(false);
  const closeTimer = useRef(null);

  const handleLogout = async () => {
    try {
      await signout();
      setIsLogined(false);
      alert("로그아웃 되었습니다.");
    } catch (_) {}
  };

  const displayName =
    user?.name || user?.nickname || user?.email || user?.userId || "사용자";

  const profileSrc =
    user?.profileImage || user?.picture || user?.avatarUrl || null;

  const onUserEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setUserOpen(true);
  };
  const onUserLeave = () => {
    closeTimer.current = setTimeout(() => {
      setUserOpen(false);
      closeTimer.current = null;
    }, 120);
  };

  const onUserToggleClick = () => setUserOpen((v) => !v);

  const locationAddress = user?.address || "위치를 설정해주세요";

  // 스크롤할때 쉐도우 효과줌.
  useEffect(() => {
    const handleScroll = () => {
      const headerEl = document.querySelector("header");
      if (!headerEl) return;
      if (window.scrollY > 10) {
        headerEl.classList.add("scrolled");
      } else {
        headerEl.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-left">
          <Link to="/notice" className="top-btn highlight">공지사항</Link>
          <Link to="/event" className="top-btn highlight">이벤트</Link>
        </div>
        <div className="top-right">
          {!isLogined ? (
            <div className="auth-box">
              <Link to="/signin" className="auth-btn auth-outline">로그인</Link>
            </div>
          ) : (
            <div
              className={`header_dropdown user-dropdown ${userOpen ? "open" : ""}`}
              onMouseEnter={onUserEnter}
              onMouseLeave={onUserLeave}
            >
              <button type="button" className="user-badge" onClick={onUserToggleClick}>
                <div className="avatar">
                  {profileSrc ? (
                    <img src={profileSrc} alt="프로필" className="avatar-img" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="avatar-fallback">
                      {displayName?.trim()?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <span className="user-name">{displayName}</span>
              </button>
              <div className="user-menu">
                <Link to="/pets" className="user-menu_item">
                  <Dog size={16} className="menu-icon" /> 내 펫 관리
                </Link>
                <Link to="/profile" className="user-menu_item">
                  <User size={16} className="menu-icon" /> 프로필 관리
                </Link>
                <Link to="/address" className="user-menu_item">
                  <Home size={16} className="menu-icon" /> 주소 관리
                </Link>
                <div className="user-menu_divider"></div>
                <button className="user-menu_item user-menu_logout" onClick={handleLogout}>
                  <LogOut size={16} className="menu-icon" /> 로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="main-nav">
        {/* 로고 */}
        <div className="logo-wrap">
          <Link to="/home" className="logo"><h2>Petmate</h2></Link>
        </div>

        {/* 로그인 했을 때 모든 메뉴 표시 */}
        <nav className="nav">
          {isLogined ? (
            <>
              <Link to="/map"><Map size={16} className="nav-icon" /> 지도</Link>
              <Link to="/payment"><CreditCard size={16} className="nav-icon" /> 결제</Link>
              <Link to="/favorites"><Star size={16} className="nav-icon" /> 즐겨찾기</Link>
              <Link to="/bookings"><CalendarCheck size={16} className="nav-icon" /> 예약내역</Link>
              <Link to="/booking"><ClipboardList size={16} className="nav-icon" /> 예약관리</Link>
              <Link to="/companymanage"><Building2 size={16} className="nav-icon" /> 업체관리</Link>
              <Link to="/product"><Package size={16} className="nav-icon" /> 상품관리</Link>
            </>
          ) : (
            <>
              <Link to="/map"><Map size={16} className="nav-icon" /> 지도</Link>
            </>
          )}
        </nav>

        {/* 내 주소 */}
        <div className="header-address">
          {isLogined ? (
            <Link to="/address">
              <MapPin size={18} color="#eb9666" style={{ marginRight: "6px" }} />
              {locationAddress}
            </Link>
          ) : (
            <span>
              <MapPin size={18} color="#eb9666" style={{ marginRight: "6px" }} />
              로그인 후 이용 가능
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
