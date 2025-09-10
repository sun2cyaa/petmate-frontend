import { Link } from "react-router-dom";
import { signout } from "../services/authService";
import "../components/common/Header/Header.css";

function Header({ isLogined, setIsLogined, user }) {
  const handleLogout = async () => {
    try {
      await signout();
      setIsLogined(false);
      alert("로그아웃 되었습니다.");
    } catch (_) {}
  };

  return (
    <header className="header">
      <h2 className="logo">Petmate</h2>
      <Link to="/map">지도</Link>
      <Link to="/payment">결제</Link>
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

      <div className="header_dropdown">
        <span className="header_petmate">펫메이트</span>
        <div className="header_petmate_menu">
          <Link to="/booking" className="header_petmate_item">
            예약관리
          </Link>
          <Link to="/product" className="header_petmate_item">
            상품관리
          </Link>
        </div>
      </div>

      <nav className="nav">
        <Link to="/home">Home</Link>

        {!isLogined && <Link to="/signin">로그인/회원가입</Link>}

        {isLogined && (
          <>
            <span style={{ marginRight: 12 }}>
              {user?.nickname || user?.email || "사용자"}
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
