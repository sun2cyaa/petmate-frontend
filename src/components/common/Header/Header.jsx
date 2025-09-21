// src/components/common/Header/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import * as addressService from "../../../services/addressService.js";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  MapPin,
  Dog,
  User,
  Home,
  LogOut,
  Map,
  CreditCard,
  Star,
  CalendarCheck,
  Building2,
  Users,
  Edit,
  Heart,
  Package,
} from "lucide-react";

function Header() {
  const { isLogined, user, logout, currentMode, switchMode } = useAuth();
  const [userOpen, setUserOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const closeTimer = useRef(null);
  const navigate = useNavigate();

  const normalizeRole = (val) => {
    let r = String(val ?? "1").trim();
    if (
      (r.startsWith('"') && r.endsWith('"')) ||
      (r.startsWith("'") && r.endsWith("'"))
    )
      r = r.slice(1, -1).trim();
    return ["1", "2", "3", "4", "9"].includes(r) ? r : "1";
  };

  const role = normalizeRole(user?.role);
  const isPetOwner = role === "2" || role === "4";
  const isPetmate = role === "3" || role === "4";
  const isBoth = role === "4";

  // Role 4인 경우 현재 모드에 따라 표시할 권한 결정
  const showOwnerFeatures = isBoth ? currentMode === "owner" : isPetOwner;
  const showPetmateFeatures = isBoth ? currentMode === "petmate" : isPetmate;

  const handleLogout = async () => {
    await logout();
  };

  const handleModeSwitch = (mode) => {
    switchMode(mode);
    // 현재 URL이 /user/profile이면 모드에 맞는 URL로 업데이트
    const currentPath = window.location.pathname;
    if (currentPath.includes("/user/profile")) {
      navigate(`/user/profile?mode=${mode}`);
    } else {
      navigate("/home");
    }
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

  // 기본 주소 불러오기 + 변경 감지
  useEffect(() => {
    if (!isLogined) {
      setDefaultAddress(null);
      return;
    }
    const loadAddressesDefault = async () => {
      if (!user) {
        setDefaultAddress(null);
        return;
      }

      try {
        console.log("user: ", user);
        const addresses = await addressService.getAddressesByDefault(
          user.userId
        );
        setDefaultAddress(addresses.roadAddr);
      } catch (error) {
        console.error("기본주소 로드 오류:", error);
      }
    };

    // 처음 로딩 시에 실행됨.
    loadAddressesDefault();

    // 기본 주소 변경 이벤트감지해서 변경해주는
    const handleAddressChange = () => {
      loadAddressesDefault();
    };

    window.addEventListener("defaultAddressChanged", handleAddressChange);

    // 언마운트 할때 이벤트 제거
    return () => {
      window.removeEventListener("defaultAddressChanged", handleAddressChange);
    };
  }, [isLogined, user]);

  return (
    <header>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-left">
          <Link to="/notice" className="top-btn highlight">
            공지사항
          </Link>
          <Link to="/event" className="top-btn highlight">
            이벤트
          </Link>
        </div>

        <div className="top-right">
          {!isLogined ? (
            <div className="auth-box">
              <Link to="/signin" className="auth-btn auth-outline">
                로그인
              </Link>
            </div>
          ) : (
            <div
              className={`header_dropdown user-dropdown ${
                userOpen ? "open" : ""
              }`}
              onMouseEnter={onUserEnter}
              onMouseLeave={onUserLeave}
            >
              <button
                type="button"
                className="user-badge"
                onClick={onUserToggleClick}
              >
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
                {showOwnerFeatures && <span className="petowner-badge">반려인</span>}
                {showPetmateFeatures && <span className="petmate-badge">펫메이트</span>}
              </button>

              <div className="user-menu">
                {/* 반려인 모드 메뉴 */}
                {showOwnerFeatures && (
                  <>
                    <Link to="/pets" className="user-menu_item">
                      <Dog size={16} className="menu-icon" /> 내펫관리
                    </Link>
                    <Link to="/address" className="user-menu_item">
                      <Home size={16} className="menu-icon" /> 주소관리
                    </Link>
                  </>
                )}

                {/* 펫메이트 모드 메뉴 */}
                {showPetmateFeatures && (
                  <>
                    <Link to="/companymanage" className="user-menu_item">
                      <Building2 size={16} className="menu-icon" /> 업체관리
                    </Link>
                    <Link to="/product" className="user-menu_item">
                      <Package size={16} className="menu-icon" /> 상품관리
                    </Link>
                  </>
                )}

                {/* 공통 메뉴 */}
                <div className="user-menu_divider"></div>
                <Link to="/user/profile" className="user-menu_item">
                  <User size={16} className="menu-icon" /> 프로필수정
                </Link>

                <div className="user-menu_divider"></div>
                <button
                  className="user-menu_item user-menu_logout"
                  onClick={handleLogout}
                >
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
          <Link to="/home" className="logo">
            <h2>Petmate</h2>
          </Link>
        </div>

        <nav className="nav">
          <Link to="/map">
            <Map size={16} className="nav-icon" /> 지도
          </Link>

          {isLogined && (
            <>
              {/* 반려인 메뉴 */}
              {showOwnerFeatures && (
                <>
                  <Link to="/favorites">
                    <Star size={16} className="nav-icon" /> 즐겨찾기
                  </Link>
                  <Link to="/my-bookings">
                    <CalendarCheck size={16} className="nav-icon" /> 예약내역
                  </Link>
                </>
              )}

              {/* 펫메이트 메뉴 */}
              {showPetmateFeatures && (
                <Link to="/petmate/booking">
                  <CalendarCheck size={16} className="nav-icon" /> 예약관리
                </Link>
              )}

              {/* 역할 전환/되기 메뉴 */}
              {isBoth ? (
                <>
                  {currentMode === "owner" ? (
                    <button
                      onClick={() => handleModeSwitch("petmate")}
                      className="nav-link mode-switch"
                    >
                      <Users size={16} className="nav-icon" /> 펫메이트로 전환
                    </button>
                  ) : (
                    <button
                      onClick={() => handleModeSwitch("owner")}
                      className="nav-link mode-switch"
                    >
                      <Heart size={16} className="nav-icon" /> 반려인으로 전환
                    </button>
                  )}
                </>
              ) : isPetOwner ? (
                <Link to="/become-petmate" className="nav-link become-petmate">
                  <Users size={16} className="nav-icon" /> 펫메이트 되기
                </Link>
              ) : isPetmate ? (
                <Link to="/become-petowner" className="nav-link become-petowner">
                  <Heart size={16} className="nav-icon" /> 반려인 되기
                </Link>
              ) : (
                <>
                  <Link to="/become-petowner" className="nav-link become-petowner">
                    <Heart size={16} className="nav-icon" /> 반려인 되기
                  </Link>
                  <Link to="/become-petmate" className="nav-link become-petmate">
                    <Users size={16} className="nav-icon" /> 펫메이트 되기
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        <div className="header-address">
          {isLogined ? (
            <Link to="/address">
              <MapPin size={18} className="map-icon" />
              {defaultAddress || "주소를 설정해주세요"}
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
