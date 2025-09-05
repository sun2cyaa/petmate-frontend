import SectionTitle from "../components/SectionTitle";
import SitterCard from "../components/SitterCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../styles/HomePage.css";

const banners = [
  "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1558944351-c7e1d79f29f4?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1601758123927-196ecc4c54f0?auto=format&fit=crop&w=1600&q=80",
];

const services = ["돌봄", "산책", "미용", "병원", "기타"];

const sitters = [
  {
    id: 1,
    name: "건이X산책",
    desc: "강아지 산책 전문 서비스",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "선희네 24시",
    desc: "24시간 고양이 케어",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1558944351-c7e1d79f29f4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "광현 멍멍놀이터",
    desc: "소형견 놀이방 운영",
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1601758123927-196ecc4c54f0?auto=format&fit=crop&w=800&q=80",
  },
];

const reviews = [
  {
    id: 1,
    name: "김민주",
    comment: "처음 맡겼는데 아이가 너무 즐겁게 다녀왔어요! 다음에도 꼭 이용할게요.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "박철수",
    comment: "강아지가 산책을 정말 좋아했어요. 믿을 수 있는 서비스라 만족합니다.",
    rating: 4,
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "이지현",
    comment: "24시간 케어 덕분에 출장 다녀오는 동안 안심할 수 있었습니다.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

export default function HomePage() {
  return (
    <div className="home-container">
   
      <section className="home-banner-section">
        <Swiper autoplay={{ delay: 3000 }} loop={true}>
          {banners.map((b, i) => (
            <SwiperSlide key={i}>
              <img src={b} alt={`배너${i}`} className="home-banner-img" />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="home-search-section">
        <div className="home-search-box">
          <div className="home-service-buttons">
            {services.map((s) => (
              <button key={s} className="home-service-btn">
                {s}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="개인/법인명, 상품명 검색"
            className="home-search-input"
          />
          <button className="home-search-btn">검색</button>
        </div>
      </section>

      <section className="home-sitter-section">
        <SectionTitle title="추천 펫메이트" />
        <div className="home-sitter-grid">
          {sitters.map((s) => (
            <SitterCard key={s.id} {...s} />
          ))}
        </div>
      </section>

      <section className="home-review-section">
        <SectionTitle title="이용자 후기" />
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500 }}
          loop={true}
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((r) => (
            <SwiperSlide key={r.id}>
              <div className="home-review-card">
                <img src={r.img} alt={r.name} className="home-review-img" />
                <h4 className="home-review-name">{r.name}</h4>
                <p className="home-review-comment">“{r.comment}”</p>
                <div className="home-review-stars">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <span key={i} className="home-star-active">
                      ★
                    </span>
                  ))}
                  {Array.from({ length: 5 - r.rating }).map((_, i) => (
                    <span key={i} className="home-star-inactive">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
