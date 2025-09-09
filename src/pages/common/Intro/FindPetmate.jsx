import "./FindPetmate.css";
import mapImage from "../../../assets/images/intro/map-section/map-section.png";

function FindPetmate() {
  return (
    <section className="findpetmate-section">
      {/* 헤더 */}
      <div className="findpetmate-header">
        <h2>Find Petmates Near You</h2>
        <p>내 주변 Petmate 찾기</p>
      </div>

      {/* 본문 이미지 */}
      <div className="findpetmate-body">
        <img src={mapImage} alt="Petmate Map Section" />
      </div>
    </section>
  );
}

export default FindPetmate;
