import { Link } from "react-router-dom";
import "./Header.css";
import { signout } from "../../../services/authService";
import { useRef, useState, useEffect } from "react";

function Header({ isLogined, setIsLogined, user }) {
  const [userOpen, setUserOpen] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (user) {
      console.log("📦 서버로부터 받은 user 정보:", user);
      console.log("🖼️ 프로필 이미지 URL:", user.picture);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signout();
      setIsLogined(false);
      alert("로그아웃 되었습니다.");
    } catch (_) {}
  };

  const displayName =
    user?.name || user?.nickname || user?.email || user?.userId || "사용자";
  const providerLabel = user?.provider ? ` (${user.provider})` : "";
  
  const profileSrc = user?.picture || null;

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

  return (
    <header className="header">
      <Link to="/home" className="logo"><h2>Petmate</h2></Link>
      <Link to="/map">지도</Link>
      <Link to="/payment">결제</Link>

      <div className="header_dropdown">
        <span className="header_company_manage">업체 관리</span>
        <div className="header_company_manage_menu">
          <Link to="/companymanage" className="header_company_manage_item">업체 목록</Link>
          <Link to="/companyregister" className="header_company_manage_item">업체 등록</Link>
        </div>
      </div>

      <div className="header_dropdown">
        <span className="header_petmate">펫메이트</span>
        <div className="header_petmate_menu">
          <Link to="/booking" className="header_petmate_item">예약관리</Link>
          <Link to="/product" className="header_petmate_item">상품관리</Link>
        </div>
      </div>

      {isLogined && <Link to="/become-petmate">펫메이트 되기</Link>}

      <nav className="nav">
        {!isLogined && <Link to="/signin">로그인/회원가입</Link>}

        {isLogined && (
          <div
            className={`header_dropdown user-dropdown ${userOpen ? "open" : ""}`}
            onMouseEnter={onUserEnter}
            onMouseLeave={onUserLeave}
          >
            <button
              type="button"
              className="user-badge"
              title={displayName}
              onClick={onUserToggleClick}
            >
              <div className="avatar">
                {profileSrc ? (
                  <img
                    src={profileSrc}
                    alt="프로필"
                    className="avatar-img"
                  />
                ) : null}
                <div
                  className="avatar-fallback"
                  style={{ display: profileSrc ? "none" : "flex" }}
                >
                  {displayName?.trim()?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>
              <span className="user-name">
                {displayName}
                {providerLabel}
              </span>
            </button>

            <div className="user-menu">
              <Link to="/pets" className="user-menu_item">내 펫 관리</Link>
              <Link to="/profile" className="user-menu_item">프로필 관리</Link>
              <Link to="/address" className="user-menu_item">주소 관리</Link>
              <button className="user-menu_item user-menu_logout" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;