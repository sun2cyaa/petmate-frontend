// src/components/common/Header/Header.jsx
import { Link } from "react-router-dom";
import "./Header.css";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext"; // 컨텍스트 직접 사
import {
  MapPin, Dog, User, Home, LogOut,
  Map, CreditCard, Star, CalendarCheck, Building2, Users, Edit, Heart, Package
} from "lucide-react";

function Header() {
  const { isLogined, user, logout } = useAuth();
  const [userOpen, setUserOpen] = useState(false);
  const closeTimer = useRef(null);

  const normalizeRole = (val) => {
    let r = String(val ?? "1").trim();
    if ((r.startsWith('"') && r.endsWith('"')) || (r.startsWith("'") && r.endsWith("'"))) r = r.slice(1, -1).trim();
    return ["1","2","3","4","9"].includes(r) ? r : "1";
  };

  const role = normalizeRole(user?.role);
  const isPetOwner = role === "2" || role === "4";
  // const isPetmate  = role === "3" || role === "4";
   const isPetmate  = "3";

  const handleLogout = async () => {
    await logout(); // 컨텍스트가 토큰·상태 정리까지 수행
  };

  const displayName =
    user?.name || user?.nickname || user?.email || user?.userId || "사용자";

  const profileSrc =
    user?.profileImage || user?.picture || user?.avatarUrl || null;

  const onUserEnter = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setUserOpen(true);
  };
  const onUserLeave = () => {
    closeTimer.current = setTimeout(() => { setUserOpen(false); closeTimer.current = null; }, 120);
  };
  const onUserToggleClick = () => setUserOpen((v) => !v);

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
                {isPetOwner && <span className="petowner-badge">반려인</span>}
                {isPetmate && <span className="petmate-badge">펫메이트</span>}
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

                {/* {isPetOwner && ( */}
                  <>
                    <div className="user-menu_divider"></div>
                    <Link to="/petowner/profile" className="user-menu_item">
                      <Edit size={16} className="menu-icon" /> 반려인 정보
                    </Link>
                  </>
                {/* )} */}

                {/* {isPetmate && ( */}
                  <>
                    <div className="user-menu_divider"></div>
                    <Link to="/petmate-profile" className="user-menu_item">
                      <Edit size={16} className="menu-icon" /> 펫메이트 정보 수정
                    </Link>
                  </>
                {/* )} */}

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
          <Link to="/map"><Map size={16} className="nav-icon" /> 지도</Link>

          {isLogined && (
            <>
              <Link to="/payment"><CreditCard size={16} className="nav-icon" /> 결제</Link>
              <Link to="/home"><Star size={16} className="nav-icon" /> 즐겨찾기</Link>
              <Link to="/booking"><CalendarCheck size={16} className="nav-icon" /> 예약내역</Link>

              {/* 업체 관리 */}
            <div className="header_dropdown">
              <span className="nav-link"><Building2 size={16} className="nav-icon" /> 업체 관리</span>
              <div className="header_company_manage_menu">
                <Link to="/companymanage" className="header_company_manage_item">업체 목록</Link>
                <Link to="/companyregister" className="header_company_manage_item">업체 등록</Link>
              </div>
            </div>

              {/* 상품 관리 */}
            <div className="header_dropdown">
              <span className="nav-link"><Package size={16} className="nav-icon" /> 상품 관리</span>
              <div className="header_product_manage_menu">
                <Link to="/product" className="header_product_manage_item">상품 목록</Link>
                <Link to="/product/register" className="header_product_manage_item">상품 등록</Link>
              </div>
            </div>

              {/* {isPetmate && ( */}
                <div className="header_dropdown">
                  <span className="nav-link petmate-nav"><Users size={16} className="nav-icon" /> 펫메이트</span>
                  <div className="header_petmate_menu">
                    <Link to="/petmate/booking" className="header_petmate_item">예약관리</Link>
                    <Link to="/petmate/service" className="header_petmate_item">서비스관리</Link>
                    <Link to="/petmate/profile" className="header_petmate_item">펫메이트 정보</Link>
                    
                  </div>
                </div>
              {/* )} */}

              {/* {isPetOwner ? ( */}
                <Link to="/petowner/profile" className="nav-link petowner-edit">
                  <Heart size={16} className="nav-icon" /> 반려인 정보
                </Link>
              {/* ) : ( */}
                <Link to="/become-petowner" className="nav-link become-petowner">
                  <Heart size={16} className="nav-icon" /> 반려인 되기
                </Link>
              {/* )} */}

              {/* {isPetmate ? ( */}
                <Link to="/petmate-profile" className="nav-link petmate-edit">
                  <Edit size={16} className="nav-icon" /> 펫메이트 정보 수정
                </Link>
              {/* ) : ( */}
                <Link to="/become-petmate" className="nav-link become-petmate">
                  <Users size={16} className="nav-icon" /> 펫메이트 되기
                </Link>
              {/* )} */}
            </>
          )}
        </nav>

        <div className="header-address">
          {isLogined ? (
            <Link to="/address">
              <MapPin size={18} className="map-icon" />
              {user?.address || "주소를 설정해주세요"}
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
