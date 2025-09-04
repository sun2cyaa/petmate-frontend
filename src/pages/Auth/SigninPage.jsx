import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../../services/authService";
import "../../styles/SigninPage.css";

const SigninPage = ({ setIsLogined }) => {

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const navigate = useNavigate();

  // handler
  const handleSignin = async () => {

    try {
      const res = await signin(id, pw);

      localStorage.setItem("accessToken", res.data.accessToken);

      alert("로그인 성공!");
      setIsLogined(true);
      
      navigate("/");

    } catch (e) {

            alert("로그인 실패!");
            setIsLogined(false);
            setId("");
            setPw("");
        }

    };

  return (
    <article>
        <div className="signin-wrap">
            <h1 className="signin-title">로그인</h1>
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
            <button 
            onClick={handleSignin}>로그인</button>

        </div>
    </article>
  );
};

export default SigninPage;
