import { Link } from "react-router-dom";
import { signout } from "../services/authService";

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
      <nav className="nav">
        <Link to="/">Home</Link>

        {!isLogined && <Link to="/signin">로그인/회원가입</Link>}

        {isLogined && (
          <>
            <span style={{ marginRight: 12 }}>
              {user?.nickname || user?.email || "사용자"}
              {user?.provider ? ` (${user.provider})` : ""}
            </span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
