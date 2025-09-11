// src/pages/Auth/SigninPage.jsx
import "../../styles/SigninPage.css";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://localhost:8090";

export default function SigninPage() {
  const startOAuth = (provider) => {
    const next = sessionStorage.getItem("postLoginRedirect") || "/home";
    localStorage.removeItem("accessToken"); // 낡은 토큰 제거
    window.location.href =
      `${API_BASE}/oauth2/authorization/${provider}?next=` +
      encodeURIComponent(next);
  };

  return (
    <article>
      <div className="signin-wrap">
        <h1 className="signin-title">로그인</h1>
        <button onClick={() => startOAuth("naver")}  style={{ marginLeft: 8 }}>네이버로 로그인/회원가입</button>
        <button onClick={() => startOAuth("kakao")}  style={{ marginLeft: 8 }}>카카오로 로그인/회원가입</button>
        <button onClick={() => startOAuth("google")} style={{ marginLeft: 8 }}>구글로 로그인/회원가입</button>
      </div>
    </article>
  );
}
