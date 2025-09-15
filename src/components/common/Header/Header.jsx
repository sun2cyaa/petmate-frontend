import { Link } from "react-router-dom";
import "./Header.css";
import { signout } from "../../../services/authService";
import { useRef, useState, useEffect } from "react";
import {
  MapPin, Dog, User, Home, LogOut,
  Map, CreditCard, Star, CalendarCheck, Building2, Users
} from "lucide-react";

// 공통 헤더 컴포넌트
// props:
// - isLogined: 로그인 여부
// - setIsLogined: 로그인 상태 변경 함수
// - user: 로그인 사용자 정보 (name, nickname, email, picture, profileImage 등)
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

  // 우선순위: profileImage > picture > avatarUrl
  const profileSrc = user?.profileImage || user?.picture || user?.avatarUrl || null;

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

  // 스크롤 시 헤더 shadow 효과
  useEffect(() => {
    const handleScroll = () => {
      const headerEl = document.querySelector("header");
      if (!headerEl) return;
      if (window.scrollY > 10) headerEl.classList.add("scrolled");
      else headerEl.classList.remove("scrolled");
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
              {/* 프로필 버튼 */}
              <button type="button" className="user-badge" onClick={onUserToggleClick}>
                <div className="avatar">
                  {profileSrc ? (
                    <img
                      src={profileSrc}
                      alt="프로필"
                      className="avatar-img"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="avatar-fallback">
                      {displayName?.trim()?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <span className="user-name">{displayName}</span>
              </button>

              {/* 드롭다운 메뉴 */}
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
        <div className="logo-wrap">
          <Link to="/home" className="logo"><h2>Petmate</h2></Link>
        </div>

        <nav className="nav">
          {isLogined ? (
            <>
              {/* 공통 메뉴 */}
              <Link to="/map"><Map size={16} className="nav-icon" /> 지도</Link>
              <Link to="/payment"><CreditCard size={16} className="nav-icon" /> 결제</Link>
              <Link to="/home"><Star size={16} className="nav-icon" /> 즐겨찾기</Link>
              <Link to="/booking"><CalendarCheck size={16} className="nav-icon" /> 예약내역</Link>

              {/* 업체 관리 */}
              <div className="header_dropdown">
                <span className="nav-link">
                  <Building2 size={16} className="nav-icon" /> 업체 관리
                </span>
                <div className="header_company_manage_menu">
                  <Link to="/companymanage" className="header_company_manage_item">업체 목록</Link>
                  <Link to="/companyregister" className="header_company_manage_item">업체 등록</Link>
                </div>
              </div>

              {/* 펫메이트 관리 */}
              <div className="header_dropdown">
                <span className="nav-link">
                  <Users size={16} className="nav-icon" /> 펫메이트
                </span>
                <div className="header_petmate_menu">
                  <Link to="/booking" className="header_petmate_item">예약관리</Link>
                  <Link to="/product" className="header_petmate_item">상품관리</Link>
                </div>
              </div>

              {/* 펫메이트 되기 */}
              <Link to="/become-petmate" className="nav-link">펫메이트 되기</Link>
            </>
          ) : (
            <>
              <Link to="/map"><Map size={16} className="nav-icon" /> 지도</Link>
            </>
          )}
        </nav>

        {/* 주소 표시 */}
        <div className="header-address">
          {isLogined ? (
            <Link to="/address">
              <MapPin size={18} className="map-icon" />
              {locationAddress}
            </Link>
          ) : (
            <span>
              <MapPin size={18} className="map-icon" />
              로그인 후 이용 가능
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
