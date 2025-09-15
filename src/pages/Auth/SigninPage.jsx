import "../../styles/SigninPage.css";
import naverIcon from "../../assets/icons/login/naver.png";
import kakaoIcon from "../../assets/icons/login/kakao.png";
import googleIcon from "../../assets/icons/login/google.png";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://localhost:8090";

export default function SigninPage() {
  const startOAuth = (provider) => {
    const next = sessionStorage.getItem("postLoginRedirect") || "/home";
    localStorage.removeItem("accessToken");
    window.location.href =
      `${API_BASE}/oauth2/authorization/${provider}?next=` +
      encodeURIComponent(next);
  };

  return (
    <article className="signin-page">
      <div className="signin-wrap">
        <h1 className="signin-title">로그인</h1>

        <button
          className="signin-btn naver"
          onClick={() => startOAuth("naver")}
        >
          <img src={naverIcon} alt="네이버" className="signin-icon" />
          네이버로 로그인/회원가입
        </button>

        <button
          className="signin-btn kakao"
          onClick={() => startOAuth("kakao")}
        >
          <img src={kakaoIcon} alt="카카오" className="signin-icon" />
          카카오로 로그인/회원가입
        </button>

        <button
          className="signin-btn google"
          onClick={() => startOAuth("google")}
        >
          <img src={googleIcon} alt="구글" className="signin-icon" />
          구글로 로그인/회원가입
        </button>
      </div>
    </article>
  );
}
