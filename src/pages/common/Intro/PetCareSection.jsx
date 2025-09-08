import "./PetCareSection.css";

// 하단 아이콘
import feature1 from "../../../assets/icons/petcare/home.png";
import feature2 from "../../../assets/icons/petcare/school.png";
import feature3 from "../../../assets/icons/petcare/balance.png";
import feature4 from "../../../assets/icons/petcare/currency.png";

function PetCareSection() {
  const services = [
    { id: 1, title: "반려동물 돌보기", desc: "메이트가 있는 곳에서 돌보기", img: "/images/petcare/service1.jpg" },
    { id: 2, title: "반려동물 돌보기", desc: "메이트가 반려인집에 머물러서 돌보기", img: "/images/petcare/service2.jpg" },
    { id: 3, title: "가정 방문", desc: "보호자 집에 직접 방문해 케어", img: "/images/petcare/service3.jpg" },
    { id: 4, title: "데이 케어", desc: "낮 동안 잠시 반려동물을 맡기기", img: "/images/petcare/service4.jpg" },
    { id: 5, title: "병원 케어", desc: "전문 메이트와 함께 병원 동행", img: "/images/petcare/service5.jpg" },
    { id: 6, title: "반려동물 목욕", desc: "깔끔하고 안전한 목욕 케어", img: "/images/petcare/service6.jpg" },
    { id: 7, title: "반려견 훈련", desc: "전문 훈련사와 함께하는 훈련", img: "/images/petcare/service7.jpg" },
    { id: 8, title: "반려동물 산책", desc: "전문 메이트와 함께 하는 산책 서비스", img: "/images/petcare/service8.jpg" },
  ];

  const features = [
    { id: 1, img: feature1, title: "안전한 숙박", desc: "안전하고 보안이 유지되는 반려동물 숙박을 예약 할 수 있도록 도와드립니다." },
    { id: 2, img: feature2, title: "훈련된 관리자", desc: "우리는 반려동물을 돌보미와 산책 시키는 메이트에게 반려동물 전문 교육을 제공합니다." },
    { id: 3, img: feature3, title: "서비스 계약", desc: "Petmate는 반려인들의 예약한 서비스에 대한 서면 계약서를 제공합니다." },
    { id: 4, img: feature4, title: "안전한 결제", desc: "예약 후 예약금은 Petmate 계좌로 입금되며, 서비스 종료 후 메이트에게 입금됩니다." }
  ];

  return (
    <section className="petcare-section">
      <div className="petcare-header">
        <h2>Pet Care, Made Simple</h2>
        <p>돌봄부터 산책까지, 한번에 해결</p>
      </div>

      {/* service 카드 8개 */}
      <div className="petcare-grid">
        {services.map(service => (
          <div key={service.id} className="petcare-card">
            <img src={service.img} alt={service.title} />
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>

      {/* 우리 플랫폼 특징 4개 */}
      <div className="petcare-features">
        {features.map(f => (
          <div key={f.id} className="feature-item">
            <img src={f.img} alt={f.title} className="feature-icon" />
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PetCareSection;
