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
import { getNearbyCompanies } from "../../../services/companyService";
import { positionalKeys } from "framer-motion";

function MapPage() {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [companies, setCompanies] = useState([]); // 업체 목록 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [userLocation, setUserLocation] = useState(null); // 사용자 위치 상태 추가
  const [selectedService, setSelectedService] = useState(null); // 선택된 서비스 타입 추가
  const [map, setMap] = useState(null); // 지도 객체 상태 추가

  const services = [
    { id: "1", name: "돌봄", icon: <FaHandsHelping /> },
    { id: "2", name: "산책", icon: <FaDog /> },
    { id: "3", name: "미용", icon: <FaCut /> },
    { id: "4", name: "병원", icon: <FaClinicMedical /> },
    { id: "9", name: "기타", icon: <FaEllipsisH /> },
  ];

  // 서비스별 마커 이미지 매핑
  const getMarkerImageForService = (serviceCode) => {
    const markerImages = {
      '1': '/images/markers/care-marker.png',    // 돌봄
      '2': '/images/markers/walk-marker.png',    // 산책  
      '3': '/images/markers/beauty-marker.png',  // 미용
      '4': '/images/markers/hospital-marker.png', // 병원
      '9': '/images/markers/etc-marker.png'      // 기타
    };

    return markerImages[serviceCode] || '/images/markers/default-marker.png';
  }

  

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

  // 근처 업체 로드 함수 추가
  const loadNearbyCompanies = async(latitude, longitude) => {
    try{
      setLoading(true);
      const data = await getNearbyCompanies(latitude, longitude, 5.0, selectedService);
      setCompanies(data);
      console.log('로드된 업체 목록:', data);
    } catch(e) {
      console.log('업체 로드 실패:', e);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 위치가 변경되거나 선택된 서비스가 변경될 때 업체 재로드
  useEffect(() => {
    if(userLocation) {
      loadNearbyCompanies(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation, selectedService]);

  // 지도 초기화
  useEffect(() => {
    if (!isKakaoLoaded) return;
    const container = document.getElementById("map");

    const initMap = (latitude, longitude) => {
      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      
      // 지도 객체를 상태로 저장
      setMap(map);

      // 사용자 위치 마커
      const userMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(latitude, longitude),
        // 사용자 위치 마커는 다른 이미지 사용 가능
      });
      userMarker.setMap(map);

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">현재 위치</div>`,
      });
      infowindow.open(map, userMarker);
    };

    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setUserLocation({ latitude, longitude }); // 사용자 위치 상태에 저장
        
        initMap(latitude, longitude, "현재 위치");

        loadNearbyCompanies(latitude, longitude);
      },
      () => {
        setUserLocation({ latitude: 37.5665, longitude: 126.9780 }); // 기본 위치도 상태에 저장
        initMap(37.5665, 126.9780, "서울시청");

        loadNearbyCompanies(37.5665, 126.9780);
      }
    );
  } else {
    setUserLocation({ latitude: 37.5665, longitude: 126.9780 });
    initMap(37.5665, 126.9780, "서울시청");
  }
  }, [isKakaoLoaded]);

  // 업체 마커 표시
   useEffect(()=> {
    if (!map || !companies.length) return;

    // 기존 업체 마커 추가
    companies.forEach((company) => {
      if(company.latitude && company.longitude) {
        // 서비스별 마커 이미지 생성
        const markerImageSrc = getMarkerImageForService(company.repService);
        const markerImage = new window.kakao.maps.MarkerImage(
          markerImageSrc,
          new window.kakao.maps.Size(32, 32), // 마커 크기
          {
            offset: new window.kakao.maps.Point(16, 32) // 마커 중심점
          }
        );

        // 업체 마커 생성 (커스텀 이미지 적용)
        const companyMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            parseFloat(company.latitude),
            parseFloat(company.longitude)
          ),
          image: markerImage // 커스텀 이미지 적용
        });
        companyMarker.setMap(map);

        // 업체 정보 윈도우 (기존과 동일)
        const companyInfoWindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding:10px; min-width:200px;">
              <strong>${company.name}</strong><br/>
              <small>${company.roadAddr}</small><br/>
              <small>전화: ${company.tel}</small>
            </div>
          `,
        });

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(companyMarker, 'click', function() {
          companyInfoWindow.open(map, companyMarker);
        });
      }
    });
  }, [map, companies]);

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
          <h3>펫메이트 목록 ({companies.length}개)</h3>
          {loading ? (
            <div>로딩중...</div>
          ) : (
            <div className="list">
              {companies.length === 0 ? (
                <div className="list-item">
                  근처에 업체가 없습니다
                </div>
              ) : (
                companies.map((company) => (
                  <div key={company.id} className="list-item">
                    <div className="company_name">{company.name}</div>
                    <div className="company_address">{company.roadAddr}</div>
                    <span>-</span>
                  </div>
                ))
              )}
            </div>
          )}
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
