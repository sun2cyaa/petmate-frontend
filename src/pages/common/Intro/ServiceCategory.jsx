import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import "./ServiceCategory.css";
import { useNavigate } from "react-router-dom";

import hotelImg from "../../../assets/images/intro/petcare/hotel.jpg";
import careImg from "../../../assets/images/intro/petcare/care.jpg";
import walkImg from "../../../assets/images/intro/petcare/walk.jpg";
import stylingImg from "../../../assets/images/intro/petcare/styling.jpg";
import clinicImg from "../../../assets/images/intro/petcare/clinic.jpg";

function ServiceCategory() {
    const navigate = useNavigate();
    const go = (to) => navigate(to);

    const items = [
        { title: "Hotel", subtitle: "호텔", image: hotelImg, to: "/home" },
        { title: "Care", subtitle: "돌봄", image: careImg, to: "/home" },
        { title: "Walk", subtitle: "산책", image: walkImg, to: "/home" },
        { title: "Pet Styling", subtitle: "미용", image: stylingImg, to: "/home" },
        { title: "Animal Clinic", subtitle: "병원", image: clinicImg, to: "/home" },
    ];

    return (
        <section className="cg-section">
            <div className="cg-frame">

                {/* 상단 제목이랑 버튼 */}
                <div className="cg-head">
                    <h2 className="cg-title">Pet Care, Made Simple</h2>
                    <button className="cg-cta" onClick={() => go("/home")}>
                        펫메이트 찾기
                    </button>
                </div>

                {/* 서비스 리스트 */}
                <AnimatePresence>
                    <ul className="cg-grid">
                        {items.map((it, i) => (
                            <li key={it.title + i}>
                                <Tilt
                                    tiltMaxAngleX={12}
                                    tiltMaxAngleY={12}
                                    scale={1.05}
                                    transitionSpeed={600}
                                    glareEnable={true}
                                    glareMaxOpacity={0.25}
                                    glareColor="white"
                                    glareBorderRadius="36% / 32%"
                                >
                                    <motion.button
                                        type="button"
                                        className="cg-card"
                                        onClick={() => go(it.to)}
                                        initial={{ y: 24, opacity: 0, scale: 0.985 }}
                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                        transition={{
                                            duration: 0.45,
                                            delay: 0.05 * i,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="cg-imgWrap">
                                            <img src={it.image} alt={it.title} loading="lazy" />
                                            <span className="cg-caption">
                                                <strong className="cg-en">{it.title}</strong>
                                                <span className="cg-kr">{it.subtitle}</span>
                                            </span>
                                            <span className="cg-glow" />
                                            <span className="cg-edge" />
                                        </span>
                                    </motion.button>
                                </Tilt>
                            </li>
                        ))}
                    </ul>
                </AnimatePresence>
            </div>
        </section>
    );
}

export default ServiceCategory;
