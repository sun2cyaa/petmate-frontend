import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authService";
import "../../styles/SignupPage.css";

const SignupPage = () => {
    
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [mail, setMail] = useState("");

  const navigate = useNavigate();

  // handler
  const handleSignup = async () => {

    try {
      const res = await signup(id, pw, mail);

      if (res.status === 200) {
        alert("회원가입 성공! 로그인 페이지로 이동합니다.");

        navigate("/signin");

      } else {
        alert("회원가입 실패!");
      }
    } catch (e) {
      alert("회원가입 실패!");
    }
  };

  return (
    <article>
        <div className="signup-wrap">
            <h1 className="signup-title">회원가입</h1>
            <input
                type="text"
                placeholder="아이디"
                value={id}
                onChange={(e) => {
                    setId(e.target.value);
                }} /> <br />
        
            <input
                type="password"
                placeholder="비밀번호"
                value={pw}
                onChange={(e) => {
                    setPw(e.target.value);
                }} /> <br />
        
            <input
                type="email"
                placeholder="이메일"
                value={mail}
                onChange={(e) => {
                    setMail(e.target.value);
                }} /> <br />
            <button 
            onClick={handleSignup}>회원가입</button>
        </div>
    </article>
  );
};

export default SignupPage;
