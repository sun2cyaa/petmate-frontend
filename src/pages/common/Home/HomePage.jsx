import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SitterCard from "./../../../components/SitterCard";
import SectionTitle from "./../../../components/SectionTitle";
import Footer from "../../../components/common/Footer/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import {
  FaHeart,
  FaHotel,
  FaHandsHelping,
  FaDog,
  FaCut,
  FaClinicMedical,
  FaBell,
  FaBirthdayCake,
  FaSyringe,
  FaUserShield,
  FaShieldAlt,
  FaComments,
  FaCreditCard,
  FaBolt,
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "../../../styles/HomePage.css";

import expoImg from "../../../assets/images/banners/pet-expo.jpg";
import expo2Img from "../../../assets/images/banners/pet-expo2.jpg";
import expo3Img from "../../../assets/images/banners/pet-expo3.jpg";
import catexpoImg from "../../../assets/images/banners/cat-expo.jpg";
import expo4Img from "../../../assets/images/banners/expo4Img.png";
import expo5Img from "../../../assets/images/banners/expo5Img.jpg";

const HomePage = () => {
  const [activeService, setActiveService] = useState("");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // 행사 배너 데이터
  const banners = [
    { title: "2025 케이펫 페어 수원 시즌3", img: expoImg, link: "https://k-pet.co.kr" },
    { title: "2025 궁디팡팡 캣페스타", img: catexpoImg, link: "https://catfesta.com/" },
    { title: "이천 펫축제", img: expo2Img, link: "https://www.icheon.go.kr/portal/universal/kalendar/detail.do?mid=0401030000&idx=256026" },
    { title: "광주펫쇼", img: expo3Img, link: "https://www.gpet.co.kr" },
    { title: "멍스플래쉬", img: expo4Img, link: "https://www.mungkok.com" },
    { title: "토요타 바른 DOG", img: expo5Img, link: "https://www.toyota.co.kr/bareundogfestival/agility-class/" },
  ];

  // 서비스
  const services = [
    { id: "Hotel", name: "호텔", icon: <FaHotel size={28} />, desc: "소중한 가족 안심 호텔링" },
    { id: "care", name: "돌봄", icon: <FaHandsHelping size={28} />, desc: "집에서 안전하게" },
    { id: "walk", name: "산책", icon: <FaDog size={28} />, desc: "건강한 운동" },
    { id: "beauty", name: "미용", icon: <FaCut size={28} />, desc: "깔끔한 스타일링" },
    { id: "hospital", name: "병원", icon: <FaClinicMedical size={28} />, desc: "건강 체크업" },
  ];

  // 추천 펫메이트
  const sitters = [
  {
    id: 1,
    name: "건이X산책",
    desc: "강아지 산책 전문 서비스",
    rating: 4.9,
    reviews: 127,
    price: "15,000원",
    distance: "0.5km",
    tags: ["산책전문", "대형견OK", "5년경력"],
    img: "https://placedog.net/800/600?id=1",
    isVerified: true,
    responseTime: "평균 1시간 내 응답",
  },
  {
    id: 2,
    name: "선희의 펫하우스",
    desc: "24시간 맞춤 돌봄 서비스",
    rating: 4.8,
    reviews: 203,
    price: "25,000원",
    distance: "2.1km",
    tags: ["고양이전문", "소형견환영", "응급대응"],
    img: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80", // 고양이 돌봄
    isVerified: true,
    responseTime: "평균 30분 내 응답",
  },
  {
    id: 3,
    name: "민중네 애견호텔",
    desc: "소형견 전용 프리미엄 호텔링",
    rating: 4.6,
    reviews: 88,
    price: "30,000원",
    distance: "3.5km",
    tags: ["호텔링", "실시간소통", "소형견전문"],
    img: "https://placedog.net/800/600?id=2",
    isVerified: false,
    responseTime: "평균 2시간 내 응답",
  },
  {
    id: 4,
    name: "광현펫케어",
    desc: "반려묘 전담 케어",
    rating: 5.0,
    reviews: 64,
    price: "22,000원",
    distance: "1.0km",
    tags: ["고양이전문", "약물투여가능", "10년경력"],
    img: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80", // 고양이 케어
    isVerified: true,
    responseTime: "평균 20분 내 응답",
  },
  {
    id: 5,
    name: "성택 펫케어",
    desc: "대형견 산책과 훈련",
    rating: 4.7,
    reviews: 150,
    price: "18,000원",
    distance: "4.3km",
    tags: ["대형견OK", "훈련가능", "운동전문"],
    img: "https://placedog.net/800/601?id=3", 
    isVerified: true,
    responseTime: "평균 40분 내 응답",
  },
  {
    id: 6,
    name: "형선의 미용샵",
    desc: "전문 미용 자격 펫 스타일링",
    rating: 4.5,
    reviews: 74,
    price: "35,000원",
    distance: "0.8km",
    tags: ["미용전문", "부분미용", "목욕포함"],
    img: "https://placedog.net/801/600?id=4",
    isVerified: true,
    responseTime: "평균 1시간 내 응답",
  },
];




  // 후기
  const reviews = [
  {
    id: 1,
    name: "김민주",
    comment: "처음 맡겼는데 아이가 너무 즐겁게 다녀왔어요!",
    service: "돌봄",
    date: "2025.09.11",
    petType: "말티즈",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "박철수",
    comment: "강아지가 산책을 정말 좋아했어요.",
    service: "산책",
    date: "2025.09.10",
    petType: "골든 리트리버",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
  },
  {
    id: 3,
    name: "이서연",
    comment: "펫시터님이 사진을 자주 보내주셔서 안심됐습니다.",
    service: "돌봄",
    date: "2025.09.09",
    petType: "푸들",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
  },
  {
    id: 4,
    name: "정우성",
    comment: "호텔 서비스가 깔끔하고 만족스러웠어요.",
    service: "호텔",
    date: "2025.09.08",
    petType: "시바견",
    img: "https://randomuser.me/api/portraits/men/41.jpg",
    rating: 4,
  },
  {
    id: 5,
    name: "한지민",
    comment: "고양이가 낯을 가리는데 케어 잘 해주셔서 감사해요.",
    service: "돌봄",
    date: "2025.09.07",
    petType: "스피츠",
    img: "https://randomuser.me/api/portraits/women/23.jpg",
    rating: 5,
  },
  {
    id: 6,
    name: "최민호",
    comment: "미용 후에 아이가 너무 깔끔해졌습니다!",
    service: "미용",
    date: "2025.09.06",
    petType: "포메라니안",
    img: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 5,
  },
  {
    id: 7,
    name: "오하늘",
    comment: "응급 상황에도 빠르게 대처해주셨어요.",
    service: "병원",
    date: "2025.09.05",
    petType: "닥스훈트",
    img: "https://randomuser.me/api/portraits/women/18.jpg",
    rating: 5,
  },
  {
    id: 8,
    name: "강동훈",
    comment: "산책을 규칙적으로 해주셔서 아이가 건강해졌습니다.",
    service: "산책",
    date: "2025.09.04",
    petType: "보더콜리",
    img: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 4,
  },
  {
    id: 9,
    name: "유지은",
    comment: "처음 맡겨봤는데 걱정이 사라졌습니다.",
    service: "호텔",
    date: "2025.09.03",
    petType: "스코티시폴드",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
  },
  {
    id: 10,
    name: "장현수",
    comment: "예방 접종 안내 덕분에 놓치지 않았습니다.",
    service: "병원",
    date: "2025.09.02",
    petType: "믹스견",
    img: "https://randomuser.me/api/portraits/men/29.jpg",
    rating: 4,
  },
];


  // 통계
  const stats = [
    { number: "50,000 +", label: "누적 서비스"},
    { number: "98%", label: "만족도"},
    { number: "1,200 +", label: "펫메이트"},
    { number: "24시간 고객센터", label: "고객지원"},
  ];

  {/* ---- 통계 ---- */}
<section className="home-stats-section">
  <div className="stats-grid">
    {stats.map((stat, idx) => (
      <div key={idx} className="stat-card">
        <h3>{stat.number}</h3>
        <p>{stat.label}</p>
      </div>
    ))}
  </div>
</section>

  const handleServiceClick = (serviceId) => {
    setActiveService(activeService === serviceId ? "" : serviceId);
  };

  const handleSearch = () => {
    navigate(`/map?service=${activeService}&keyword=${searchText}`);
  };

  return (
    <div className="home-container">
      {/* 서비스 검색 */}
      <section className="home-search-section">
        <div className="search-container">
          {/* 왼쪽 */}
          <div className="search-left">
            <div className="search-header">
              <h2>어떤 도움이 필요하세요?</h2>
              <p>우리 아이에게 맞는 서비스를 찾아보세요</p>
            </div>
            <div className="service-type-grid">
              {services.map((service) => (
                <button
                  key={service.id}
                  className={`service-type-btn ${activeService === service.id ? "active" : ""}`}
                  onClick={() => handleServiceClick(service.id)}
                >
                  <div className="service-icon">{service.icon}</div>
                  <span className="service-name">{service.name}</span>
                  <span className="service-desc">{service.desc}</span>
                </button>
              ))}
            </div>
            <div className="search-bar">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="개인/법인명, 상품명을 검색해보세요"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="search-input"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className="search-btn" onClick={handleSearch}>
                  검색
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽 알림 박스 */}
          <div className="search-right">
            <div className="pet-alert-card">
              <img src="/images/dog2.jpg" alt="dog" className="pet-img" />

              <div className="alert-box box1"><FaBell /> 오늘 예약이 있습니다!</div>
              <div className="alert-box box2"><FaBirthdayCake /> 곰이의 생일이 다가와요</div>
              <div className="alert-box box3"><FaClinicMedical /> 근처 동물병원 20곳</div>
              <div className="alert-box box4"><FaCut /> 내일 오전 8시 미용 예약</div>
              <div className="alert-box box5"><FaSyringe /> 예방접종 등록 필요</div>
              <div className="alert-box box6"><FaUserShield /> 휴가 대비 펫시터 예약</div>
            </div>
          </div>
        </div>
      </section>

      {/* 행사 배너 */}
      <section className="home-banner-section">
        <SectionTitle className="expo-title" title="반려동물 박람회 및 축제" center />
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 2100, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={3}
          className="banner-swiper"
        >
          {banners.map((banner, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="banner-slide"
                style={{ backgroundImage: `url(${banner.img})` }}
              >
                <div className="banner-overlay" />
                <div className="banner-content">
                  <h1 className="banner-title">{banner.title}</h1>
                  <button
                    className="banner-cta"
                    onClick={() => window.open(banner.link, "_blank")}
                  >
                    자세히 보기
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 추천 펫메이트 */}
      <section className="home-sitters-section">
        <div className="sitters-container">
          <SectionTitle title="근처 추천 펫메이트" subtitle="검증된 전문가들과 함께하세요" />
          <div className="sitters-grid">
            {sitters.map((sitter) => (
              <SitterCard key={sitter.id} sitter={sitter} onClick={() => navigate(`/map?sitterId=${sitter.id}`)} />
            ))}
          </div>
          <div className="view-more-section">
            <button className="view-more-btn" onClick={() => navigate("/map")}>
              더 많은 펫메이트 보기
            </button>
          </div>
        </div>
      </section>

      {/* 장점 */}
      <section className="home-benefits-section">
        <SectionTitle title="Petmate를 선택하는 이유" center />
        <div className="benefits-grid">
          <div className="benefit-card">
            <FaShieldAlt className="benefit-icon" />
            <h3>안심보장</h3>
            <p>모든 펫메이트는 신원 확인과 전문성 검증을 거쳤습니다</p>
          </div>
          <div className="benefit-card">
            <FaComments className="benefit-icon" />
            <h3>실시간 소통</h3>
            <p>서비스 중 실시간 사진과 상황을 공유받을 수 있어요</p>
          </div>
          <div className="benefit-card">
            <FaCreditCard className="benefit-icon" />
            <h3>간편결제</h3>
            <p>안전한 온라인 결제로 편리하게 이용하세요</p>
          </div>
          <div className="benefit-card">
            <FaBolt className="benefit-icon" />
            <h3>빠른 매칭</h3>
            <p>AI 추천 시스템으로 최적의 펫메이트를 찾아드려요</p>
          </div>
        </div>
      </section>

      {/* 통계 */}
      <section className="home-stats-section">
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 후기 */}
<section className="home-reviews-section">
  <SectionTitle title="이용자 후기" subtitle="실제 이용자들의 생생한 경험담" center />
  <Swiper
    modules={[Autoplay, Pagination]}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    loop
    pagination={{ clickable: true }}
    spaceBetween={15}  
    slidesPerView={1}
    slidesPerGroup={1}
    breakpoints={{
      // 768: { slidesPerView: 2, spaceBetween: 15 },
      1080: { slidesPerView: 4, spaceBetween: 15 },
    }}
    className="reviews-swiper"
  >
    {reviews.map((review) => (
      <SwiperSlide key={review.id}>
        <div className="review-card">
          <div className="review-header">
            <img src={review.img} alt={review.name} className="reviewer-img" />
            <div>
              <h4>{review.name}</h4>
              <span className="review-meta">{review.petType} · {review.date}</span>
            </div>
          </div>
          <div className="review-rating">
            {[...Array(5)].map((_, i) => (
              <FaHeart key={i} color={i < review.rating ? "#eb4b4b" : "#ddd"} style={{ marginRight: "4px" }} />
            ))}
          </div>
          <p>"{review.comment}"</p>
          <span className="review-badge">{review.service}</span>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  <div className="custom-pagination"></div>
</section>

      <Footer />
    </div>
  );
};

export default HomePage;
