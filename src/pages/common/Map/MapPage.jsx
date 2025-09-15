import React, { useEffect, useState } from "react";
import {
  FaHotel,
  FaHandsHelping,
  FaDog,
  FaCut,
  FaClinicMedical,
  FaSearch,
  FaEllipsisH,
} from "react-icons/fa";
import "./MapPage.css";

function MapPage() {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  const services = [
    { id: "care", name: "돌봄", icon: <FaHandsHelping /> },
    { id: "walk", name: "산책", icon: <FaDog /> },
    { id: "beauty", name: "미용", icon: <FaCut /> },
    { id: "hospital", name: "병원", icon: <FaClinicMedical /> },
    { id: "hotel", name: "기타", icon: <FaEllipsisH /> },
  ];

  // 카카오 맵 스크립트 로드
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => setIsKakaoLoaded(true));
      };
      script.onerror = () => {
        console.error("카카오 맵 스크립트 로딩 실패");
      };
      document.head.appendChild(script);
    };
    loadKakaoMap();
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isKakaoLoaded) return;
    const container = document.getElementById("map");

    const initMap = (lat, lng, label) => {
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng),
      });
      marker.setMap(map);
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${label}</div>`,
      });
      infowindow.open(map, marker);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => initMap(pos.coords.latitude, pos.coords.longitude, "현재 위치"),
        () => initMap(37.5665, 126.9780, "서울시청")
      );
    } else {
      initMap(37.5665, 126.9780, "서울시청");
    }
  }, [isKakaoLoaded]);

  return (
    <div className="map_wrap">
      {/* 상단 검색창 + 서비스 버튼 */}
      <div className="map-top-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="지역, 업체명을 검색하세요" />
          <button className="search-btn">검색</button>
        </div>
        <div className="service-filter-buttons">
          {services.map((s) => (
            <button key={s.id} className="pill-btn">
              {s.icon} <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="map_content">
        {/* 사이드바 */}
        <aside className="sidebar">
          <h3>펫메이트 목록</h3>
          <div className="list">
            <div className="list-item">업체 리스트 1 <span>➡</span></div>
            <div className="list-item">업체 리스트 2 <span>➡</span></div>
            <div className="list-item">업체 리스트 3 <span>➡</span></div>
          </div>
        </aside>

        {/* 지도 */}
        <div className="map_area">
          {!isKakaoLoaded && <div>지도를 불러오는 중...</div>}
          <div id="map" style={{ width: "100%", height: "100%" }}></div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
