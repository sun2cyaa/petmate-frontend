import { Link } from "react-router-dom";
import "./Header.css";
import { signout } from "../../../services/authService";

function Header({ isLogined, setIsLogined, user }) {
  const handleLogout = async () => {
    try {
      await signout();
      setIsLogined(false);
      alert("로그아웃 되었습니다.");
    } catch (_) {}
  };

  console.log("OAuth 유저 정보:", user);

  return (
    <header className="header">
      <Link to="/home" className="logo">
      <h2>Petmate</h2>
      </Link>
      <Link to="/map">지도</Link>
      <Link to="/payment">결제</Link>
      <div className="header_dropdown">
            <span className="header_company_manage">업체 관리</span>
            <div className="header_company_manage_menu">
              <Link to="/companymanage" className="header_company_manage_item">
                업체 목록
              </Link>
              <Link to="/companyregister" className="header_company_manage_item">
                업체 등록
              </Link>
            </div>
        </div>

      {isLogined && (
        <>
          <Link to="/become-petmate">펫메이트 되기</Link> {/* 로그인시에만 보임 */}
          <div className="header_dropdown">
            <span className="header_mypage">마이페이지</span>
            <div className="header_mypage_menu">
              <Link to="/pets" className="header_mypage_item">
                내 펫 관리
              </Link>
              <Link to="/profile" className="header_mypage_item">
                프로필 관리
              </Link>
              <Link to="/address" className="header_mypage_item">
                주소 관리
              </Link>
            </div>
          </div>
        </>
      )}

      <nav className="nav">
        {!isLogined && <Link to="/signin">로그인/회원가입</Link>}

        {isLogined && (
          <>
            <span style={{ marginRight: 12 }}>
              {user?.name || user?.nickname || user?.email || user?.userId || "사용자"}
              {user?.provider ? ` (${user.provider})` : ""}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
