import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.css"; 

import heroVideo from "../../../assets/videos/pet-hero.mp4";
import "./IntroPage.css";
import IntroHeader from "./IntroHeader";
import FeedbackFlowSection from "./FeedbackFlowSection";
import PetCareSection from "./PetCareSection";
import ServiceCategory from "./ServiceCategory";
import FindPetmate from "./FindPetmate";
import IntroFooter from "./IntroFooter";
import BackToTop from "./BackToTop";

function IntroPage() {
  const navigate = useNavigate();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fp = new fullpage("#fullpage", {
      licenseKey: "gplv3-license",
      autoScrolling: true,
      navigation: true,
      anchors: ["intro", "section1", "section2", "section3", "section4"],
      scrollingSpeed: 700,
      afterLoad: (origin, destination) => {
        const header = document.querySelector(".intro-header");
        if (!header) return;

        if (destination.anchor === "intro") {
          setShowBackToTop(false);              // Intro → 버튼 숨김
          header.classList.remove("scrolled");  // 헤더 숨김
        } else {
          setShowBackToTop(true);               // 다른 섹션에선 버튼 표시
          header.classList.add("scrolled");     // 헤더 표시
        }
      }
    });

    return () => fp.destroy("all");
  }, []);

  return (
    <div id="intro-page"> {/* ✅ 네임스페이스 컨테이너 */}
      <IntroHeader />

      <div id="fullpage">
        {/* Intro (Hero) */}
        <div className="section" data-anchor="intro">
          <motion.section
            className="intro-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 0.8 }}
          >
            <video
              className="intro-video"
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="intro-overlay" />

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

              <div className="btn-group">  
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/home")}
                  className="intro-btn"
                >
                  펫메이트 찾기
                </motion.button>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Section 1 */}
        <div className="section" data-anchor="section1">
          <FeedbackFlowSection />
        </div>

        {/* Section 2 */}
        <div className="section" data-anchor="section2">
          <PetCareSection />
        </div>

        {/* Section 3 */}
        <div className="section" data-anchor="section3">
          <ServiceCategory />
        </div>
          
        {/* Section 4 */}
        <div className="section" data-anchor="section4">
          <FindPetmate />
          <IntroFooter />
        </div>
      </div>

      {/* props로 보임 여부 */}
      <BackToTop visible={showBackToTop} />
    </div>
  );
}

export default IntroPage;
