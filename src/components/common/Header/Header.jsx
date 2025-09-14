import { Link } from "react-router-dom";
import "./Header.css";
import { signout } from "../../../services/authService";
import { useRef, useState, useEffect } from "react";
import {
  MapPin, Dog, User, Home, LogOut,
  Map, CreditCard, Star, CalendarCheck, ClipboardList, Building2, Package, Users
} from "lucide-react"; 

// 공통 헤더 컴포넌트
// props 설명
// - isLogined: 로그인 여부 (true/false)
// - setIsLogined: 로그인 상태 변경 함수
// - user: 로그인된 사용자 정보 객체 (name, nickname, email, picture, address 등)
function Header({ isLogined, setIsLogined, user }) {
  // 프로필 드롭다운 열림 여부 상태
  const [userOpen, setUserOpen] = useState(false);
  // 드롭다운 닫힘 지연 처리용 ref
  const closeTimer = useRef(null);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signout();         // 서버 로그아웃 API 호출
      setIsLogined(false);     // 로그인 상태 false로 변경
      alert("로그아웃 되었습니다.");
    } catch (_) {}
  };

  // 사용자 이름 표시 (name > nickname > email > userId 순서로 fallback)
  const displayName =
    user?.name || user?.nickname || user?.email || user?.userId || "사용자";

  // 사용자 프로필 이미지 (없으면 fallback 글자)
  const profileSrc =
    user?.profileImage || user?.picture || user?.avatarUrl || null;

  // 프로필 드롭다운 열기 (마우스 오버 시)
  const onUserEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setUserOpen(true);
  };

  // 프로필 드롭다운 닫기 (마우스가 벗어날 때, 약간의 딜레이)
  const onUserLeave = () => {
    closeTimer.current = setTimeout(() => {
      setUserOpen(false);
      closeTimer.current = null;
    }, 120);
  };

  // 프로필 버튼 클릭 시 드롭다운 열림/닫힘 토글
  const onUserToggleClick = () => setUserOpen((v) => !v);

  // 사용자 주소 표시 (없으면 "위치를 설정해주세요")
  const locationAddress = user?.address || "위치를 설정해주세요";

  //   수정한 부분: 스크롤 시 헤더에 shadow 효과
  // - window.scrollY가 10px 이상이면 header에 'scrolled' 클래스 추가
  // - scrolled 클래스는 CSS에서 box-shadow를 더 진하게 줌
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
      {/* ---------------- Top Bar ---------------- */}
      {/* 좌측: 공지사항/이벤트 / 우측: 로그인 or 프로필 */}
      <div className="top-bar">
        <div className="top-left">
          <Link to="/notice" className="top-btn highlight">공지사항</Link>
          <Link to="/event" className="top-btn highlight">이벤트</Link>
        </div>

        <div className="top-right">
          {!isLogined ? (
            // 비로그인 상태 → 로그인 버튼만
            <div className="auth-box">
              <Link to="/signin" className="auth-btn auth-outline">로그인</Link>
            </div>
          ) : (
            // 로그인 상태 → 프로필 드롭다운
            <div
              className={`header_dropdown user-dropdown ${userOpen ? "open" : ""}`}
              onMouseEnter={onUserEnter}
              onMouseLeave={onUserLeave}
            >
              {/* 프로필 버튼 (아바타 + 이름) */}
              <button type="button" className="user-badge" onClick={onUserToggleClick}>
                <div className="avatar">
                  {profileSrc ? (
                    <img src={profileSrc} alt="프로필" className="avatar-img" referrerPolicy="no-referrer" />
                  ) : (
                    // 프로필 이미지 없을 때 → 첫 글자 fallback
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

      {/* ---------------- Main Navigation ---------------- */}
      <div className="main-nav">
        {/* 로고 (클릭 시 홈으로 이동) */}
        <div className="logo-wrap">
          <Link to="/home" className="logo"><h2>Petmate</h2></Link>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="nav">
          {isLogined ? (
            <>
              {/* 공통 메뉴 */}
              <Link to="/map"><Map size={16} className="nav-icon" /> 지도</Link>
              <Link to="/payment"><CreditCard size={16} className="nav-icon" /> 결제</Link>
              <Link to="/home"><Star size={16} className="nav-icon" /> 즐겨찾기</Link>
              <Link to="/booking"><CalendarCheck size={16} className="nav-icon" /> 예약내역</Link>

              {/* 업체 관리 (드롭다운) */}
              <div className="header_dropdown">
                <span className="nav-link"><Building2 size={16} className="nav-icon" /> 업체 관리</span>
                <div className="header_company_manage_menu">
                  <Link to="/companymanage" className="header_company_manage_item">업체 목록</Link>
                  <Link to="/companyregister" className="header_company_manage_item">업체 등록</Link>
                </div>
              </div>

              {/* 펫메이트 관리 (드롭다운) */}
              <div className="header_dropdown">
                <span className="nav-link"><Users size={16} className="nav-icon" /> 펫메이트</span>
                <div className="header_petmate_menu">
                  <Link to="/booking" className="header_petmate_item">예약관리</Link>
                  <Link to="/product" className="header_petmate_item">상품관리</Link>
                </div>
              </div>

              {/* 펫메이트 되기 버튼 */}
              <Link to="/become-petmate" className="nav-link">펫메이트 되기</Link>
            </>
          ) : (
            // 비로그인 상태 → 지도만 보임
            <>
              <Link to="/map"><Map size={16} className="nav-icon" /> 지도</Link>
            </>
          )}
        </nav>

        {/* 주소 표시 영역 */}
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
