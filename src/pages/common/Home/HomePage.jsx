import React, { useState } from "react";
import SitterCard from "./../../../components/SitterCard";
import SectionTitle from "./../../../components/SectionTitle";
import Footer from "../../../components/common/Footer/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../../../styles/HomePage.css";

import expoImg from "../../../assets/images/banners/pet-expo.jpg";
import expo2Img from "../../../assets/images/banners/pet-expo2.jpg";
import expo3Img from "../../../assets/images/banners/pet-expo3.jpg";
import catexpoImg from "../../../assets/images/banners/cat-expo.jpg";

const HomePage = () => {
  const [activeService, setActiveService] = useState("");
  const [searchText, setSearchText] = useState("");

  // 행사 캐러셀
  const banners = [
    {
      title: "2025 케이펫 페어 수원 시즌3",
      desc: "",
      img: expoImg,
      link: "https://k-pet.co.kr"
    },
    {
      title: "2025 궁디팡팡 캣페스타",
      desc: "",
      img: catexpoImg,
      link: "https://catfesta.com/"
    },
    {
      title: "이천 펫축제",
      desc: "",
      img: expo2Img,
      link: "https://www.icheon.go.kr/portal/universal/kalendar/detail.do?mid=0401030000&idx=256026"
    },
    {
      title: "광주펫쇼",
      desc: "",
      img: expo3Img,
      link: "https://www.gpet.co.kr"
    },
  ];

  // 서비스
  const services = [
    { id: "care", name: "돌봄", icon: "", desc: "집에서 안전하게" },
    { id: "walk", name: "산책", icon: "", desc: "건강한 운동" },
    { id: "beauty", name: "미용", icon: "", desc: "깔끔한 스타일링" },
    { id: "hospital", name: "병원", icon: "", desc: "건강 체크업" },
    { id: "etc", name: "기타", icon: "", desc: "특별한 케어" },
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
      img: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80",
      isVerified: true,
      responseTime: "평균 1시간 내 응답",
    },
    {
      id: 2,
      name: "선희네 24시",
      desc: "24시간 고양이 케어",
      rating: 4.8,
      reviews: 89,
      price: "20,000원",
      distance: "1.2km",
      tags: ["24시간", "고양이전문", "응급처치"],
      img: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&w=800",
      isVerified: true,
      responseTime: "평균 30분 내 응답",
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
    },
    {
      id: 2,
      name: "박철수",
      comment: "강아지가 산책을 정말 좋아했어요.",
      service: "산책",
      date: "2025.09.10",
      petType: "골든리트리버",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ];

  // 통계
  const stats = [
    { number: "50,000+", label: "누적 서비스" },
    { number: "98%", label: "만족도" },
    { number: "1,200+", label: "펫메이트" },
    { number: "24/7", label: "고객지원" },
  ];

  const handleServiceClick = (serviceId) => {
    setActiveService(activeService === serviceId ? "" : serviceId);
  };

  const handleSearch = () => {
    console.log("Searching:", searchText, "Service:", activeService);
  };

  return (
    <div className="home-container">
      {/* Hero 캐러셀 */}
      <section className="home-banner-section">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
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
                  <p className="banner-desc">{banner.desc}</p>
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

      {/* 서비스 검색 */}
      <section className="home-search-section">
        <div className="search-container">
          <div className="search-header">
            <h2>어떤 도움이 필요하세요?</h2>
            <p>우리 아이에게 맞는 서비스를 찾아보세요</p>
          </div>
          <div className="service-type-grid">
            {services.map((service) => (
              <button
                key={service.id}
                className={`service-type-btn ${
                  activeService === service.id ? "active" : ""
                }`}
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
              />
              <button className="search-btn" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 추천 펫메이트 */}
      <section className="home-sitters-section">
        <div className="sitters-container">
          <SectionTitle
            title="근처 추천 펫메이트"
            subtitle="검증된 전문가들과 함께하세요"
          />
          <div className="sitters-grid">
            {sitters.map((sitter) => (
              <SitterCard key={sitter.id} sitter={sitter} />
            ))}
          </div>
          <div className="view-more-section">
            <button className="view-more-btn">더 많은 펫메이트 보기</button>
          </div>
        </div>
      </section>

      {/* 장점 */}
      <section className="home-benefits-section">
        <SectionTitle title="Petmate을 선택하는 이유" center />
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon"></div>
            <h3>안심보장</h3>
            <p>모든 펫메이트는 신원 확인과 전문성 검증을 거쳤습니다</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon"></div>
            <h3>실시간 소통</h3>
            <p>서비스 중 실시간 사진과 상황을 공유받을 수 있어요</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon"></div>
            <h3>간편결제</h3>
            <p>안전한 온라인 결제로 편리하게 이용하세요</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon"></div>
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
        <SectionTitle
          title="이용자 후기"
          subtitle="실제 이용자들의 생생한 경험담"
          center
        />
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 32 },
          }}
          className="reviews-swiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="review-card">
                <div className="review-header">
                  <img
                    src={review.img}
                    alt={review.name}
                    className="reviewer-img"
                  />
                  <div>
                    <h4>{review.name}</h4>
                    <span className="review-meta">
                      {review.petType} · {review.date}
                    </span>
                  </div>
                </div>
                <div className="review-rating">
                  {"⭐".repeat(review.rating)}{" "}
                  {"☆".repeat(5 - review.rating)}
                </div>
                <p>"{review.comment}"</p>
                <span className="review-badge">{review.service}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* CTA */}
      <section className="home-cta-section">
        <div className="cta-container">
          <h2>지금 바로 시작해보세요!</h2>
          <p>우리 아이에게 꼭 맞는 펫메이트를 만나보세요</p>
          <div className="cta-buttons">
            <button className="cta-primary">서비스 예약하기</button>
            <button className="cta-secondary">펫메이트 지원하기</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
