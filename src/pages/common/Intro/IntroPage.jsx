import { useEffect } from "react";
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

function IntroPage() {
  const navigate = useNavigate();  // 리액트 라우터

  useEffect(() => {
    const fp = new fullpage("#fullpage", {
      autoScrolling: true,
      navigation: true,
      anchors: ["intro", "section1", "section2", "section3", "section4"],
      scrollingSpeed: 700,
      afterLoad: (origin, destination) => {
        const header = document.querySelector(".intro-header");
        if (!header) return;

        if (destination.anchor === "intro") {
        } else {
          header.classList.add("scrolled");
        }
      }
    });

    return () => fp.destroy("all");
  }, []);

  return (
    <>
      {/* 인트로 전용으로 만들어둠 */}
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
                <motion.button                            // 사라지는 효과
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

        {/* Section 1 - Feedback */}
        <div className="section" data-anchor="section1">
          <FeedbackFlowSection />
        </div>

        {/* Section 2~4 */}
        <div className="section" data-anchor="section2">
          <PetCareSection />
          </div>

        <div className="section" data-anchor="section3">
          <ServiceCategory />
        </div>
          
        <div className="section" data-anchor="section4">
          <FindPetmate />
          <IntroFooter />
          </div>
      </div>
    </>
  );
}

export default IntroPage;
