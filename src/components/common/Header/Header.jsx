import { Link } from "react-router-dom";
import { signout } from "../../../services/authService";

function Header({ isLogined, setIsLogined }) {
  const handleLogout = async () => {
    try {
      await signout();
      setIsLogined(false);
      alert("로그아웃 되었습니다.");
    } catch (err) {}
  };

  return (
    <header className="header">
      <h2 className="logo">Petmate</h2>
      <nav className="nav">
        <Link to="/">Home</Link>
        {!isLogined && <Link to="/signin">Signin</Link>}
        {!isLogined && <Link to="/signup">Signup</Link>}
        {isLogined && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
