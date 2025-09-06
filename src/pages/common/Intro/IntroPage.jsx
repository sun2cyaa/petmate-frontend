import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // 애니메이션
import heroVideo from "../../../assets/videos/pet-hero.mp4";
import "./IntroPage.css";

function IntroPage() {
  const navigate = useNavigate();

  return (
    <motion.section
      className="intro-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}          
      transition={{ duration: 0.8 }} 
    >
      {/* Hero 영상 */}
      <video
        className="intro-video"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 인트로 영상 어둡게 오버레이 작업 */}
      <div className="intro-overlay" />

      {/* 문구 */}
      <div className="intro-content">
        <h1 className="intro-title">
          사랑하는 반려동물을 위한 <br />
          <span className="light">
            믿을 수 있는<span className="highlight"> 메이트</span>
          </span>
        </h1>

        <p className="intro-subtitle">
          호텔 · 돌봄 · 산책 · 미용 · 병원까지 한곳에서 <br />
          &nbsp;&nbsp;전국 최고의 펫시터와 함께하세요.
        </p>

        {/* CTA 버튼 */}
        <motion.button
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}  
          onClick={() => navigate("/home")}
          className="intro-btn"
        >
          펫메이트 찾기
        </motion.button>

        {/* <button
            onClick={handleScroll}
            className="intro-btn"> 서비스 둘러보기
        </button> */}
      </div>
    </motion.section>
  );
}

export default IntroPage;
