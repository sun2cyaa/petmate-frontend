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
import cut_white from "../../../assets/images/map/cut_white.png";
import dog_white from "../../../assets/images/map/dog_white.png";
import etc_white from "../../../assets/images/map/etc_white.png";
import hands_white from "../../../assets/images/map/hands_white.png";
import hospital_white from "../../../assets/images/map/hospital_white.png";

function MapPage() {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [companies, setCompanies] = useState([]); // 업체 목록 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [userLocation, setUserLocation] = useState(null); // 사용자 위치 상태 추가
  const [selectedService, setSelectedService] = useState(null); // 선택된 서비스 타입 추가
  const [map, setMap] = useState(null); // 지도 객체 상태 추가
  const [companyMarkers, setCompanyMarkers] = useState([]); // 업체 마커들 상태 추가
  const [currentInfoWindow, setCurrentInfoWindow] = useState(null); // 현재 열린 InfoWindow 추적
  const [currentMarkerId, setCurrentMarkerId] = useState(null); // 현재 InfoWindow를 연 마커의 company ID 추적

  const services = [
    { id: null, name: "전체", icon: <FaSearch /> },
    { id: "1", name: "돌봄", icon: <FaHandsHelping /> },
    { id: "2", name: "산책", icon: <FaDog /> },
    { id: "3", name: "미용", icon: <FaCut /> },
    { id: "4", name: "병원", icon: <FaClinicMedical /> },
    { id: "9", name: "기타", icon: <FaEllipsisH /> },
  ];


  // 마커 핀 모양에 아이콘을 합성하는 함수
 const createCustomMarker = (iconSrc, color = '#fff') =>
  new Promise((resolve) => {
    const SCALE = 2;              // 레티나 스케일
    const W = 36, H = 52;         // 표시될 목표 크기 (더 큰 크기)
    const centerX = 18, centerY = 18, r = 15;  // 논리 좌표(스케일 전)

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 내부 픽셀은 2배로
    canvas.width = W * SCALE;     // 48
    canvas.height = H * SCALE;    // 70

    // 논리 좌표로 그리기 위해 스케일
    ctx.scale(SCALE, SCALE);
    ctx.imageSmoothingQuality = 'high';

    // 핀(물방울)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, Math.PI, 0, false);   // 위 반원
    ctx.bezierCurveTo(33, 30, 18, 50, 18, 50);         // 오른쪽 곡선→뾰족 (크기에 맞게 조정)
    ctx.bezierCurveTo(18, 50, 3, 30, 3, 18);           // 왼쪽 곡선 (크기에 맞게 조정)
    ctx.closePath();
    ctx.fill();

    // 테두리
    ctx.strokeStyle = '#eb9666';
    ctx.lineWidth = 2;  // 큰 크기에 맞게 테두리도 두껍게
    ctx.stroke();

    // 아이콘
    const icon = new Image();
    icon.onload = () => {
      const iconSize = 18; // 논리 크기 (더 큰 아이콘)
      ctx.drawImage(
        icon,
        centerX - iconSize / 2,
        centerY - iconSize / 2,
        iconSize,
        iconSize
      );
      resolve({
        url: canvas.toDataURL(),
        size: { w: W, h: H },                // 카카오에 줄 표시 크기
        offset: { x: Math.floor(W / 2), y: H } // 바늘끝 기준 앵커(중앙 하단)
      });
    };
    icon.onerror = () => {
      resolve({
        url: canvas.toDataURL(),
        size: { w: W, h: H },
        offset: { x: Math.floor(W / 2), y: H }
      });
    };
    icon.src = iconSrc; 
  });

  // 서비스별 마커 이미지 생성
  const getMarkerImageForService = async (serviceCode) => {
    const markerConfig = {
      '1': { icon: hands_white, color: '#eb9666' },            
      '2': { icon: dog_white, color: '#eb9666' },              
      '3': { icon: cut_white, color: '#eb9666' },              
      '4': { icon: hospital_white, color: '#eb9666' }, 
      '9': { icon: etc_white, color: '#eb9666' },               
    };

    const config = markerConfig[serviceCode] || markerConfig['9'];
    return await createCustomMarker(config.icon, config.color);
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

  // 서비스 필터 클릭 핸들러
  const handleServiceFilter = (serviceId) => {
    // null이면 전체 보기, 특정 ID면 해당 서비스만 필터링
    setSelectedService(serviceId);
    console.log('서비스 필터 변경:', serviceId === null ? '전체' : serviceId);
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

      // 지도 드래그 종료 시 해당 위치의 업체들을 로드
      window.kakao.maps.event.addListener(map, 'dragend', function() {
        const center = map.getCenter();
        const newLat = center.getLat();
        const newLng = center.getLng();

        console.log('지도 중심 변경:', newLat, newLng);
        loadNearbyCompanies(newLat, newLng);
      });

      // 지도 줌 변경 시에도 업체 로드
      window.kakao.maps.event.addListener(map, 'zoom_changed', function() {
        const center = map.getCenter();
        const newLat = center.getLat();
        const newLng = center.getLng();

        console.log('지도 줌 변경:', newLat, newLng);
        loadNearbyCompanies(newLat, newLng);
      });

      // 지도 클릭 시 InfoWindow 닫기
      window.kakao.maps.event.addListener(map, 'click', function() {
        if (window.currentOpenInfoWindow) {
          window.currentOpenInfoWindow.close();
          window.currentOpenMarkerId = null;
          window.currentOpenInfoWindow = null;
          setCurrentInfoWindow(null);
          setCurrentMarkerId(null);
          console.log('지도 클릭으로 InfoWindow 닫힘 (실제)');
        }
      });
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
  useEffect(() => {
    if (!map) return;

    // 기존 업체 마커들 제거
    companyMarkers.forEach(marker => {
      marker.setMap(null);
    });
    setCompanyMarkers([]);

    // 기존에 열린 InfoWindow가 있다면 닫기
    if (window.currentOpenInfoWindow) {
      window.currentOpenInfoWindow.close();
      window.currentOpenMarkerId = null;
      window.currentOpenInfoWindow = null;
    }
    setCurrentInfoWindow(null);
    setCurrentMarkerId(null);

    // 새로운 업체 마커들 추가 (async 처리)
    const createMarkers = async () => {
      const newMarkers = [];

      for (const company of companies) {
        if (company.latitude && company.longitude) {
          try {
            // 서비스별 마커 이미지 생성 (async)
            const markerData = await getMarkerImageForService(company.repService);

            const markerImage = new window.kakao.maps.MarkerImage(
              markerData.url,
              new window.kakao.maps.Size(markerData.size.w, markerData.size.h),
              {
                offset: new window.kakao.maps.Point(markerData.offset.x, markerData.offset.y)
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

            // 업체 정보 윈도우
            const companyInfoWindow = new window.kakao.maps.InfoWindow({
              content: `
                <div style="padding:10px; min-width:200px;">
                  <strong>${company.name}</strong><br/>
                  <small>${company.roadAddr}</small><br/>
                  <small>전화: ${company.tel}</small>
                </div>
              `,
            });

            // 마커에 회사 ID 저장 (토글을 위해)
            companyMarker.companyId = company.id;
            companyMarker.infoWindow = companyInfoWindow;

            // 마커 클릭 이벤트 (토글 기능)
            window.kakao.maps.event.addListener(companyMarker, 'click', function() {
              // 현재 상태를 직접 확인하기 위해 DOM에서 InfoWindow 상태 확인
              const isCurrentlyOpen = document.querySelector('.InfoWindow') &&
                                    companyMarker.companyId === window.currentOpenMarkerId;

              if (isCurrentlyOpen) {
                // 현재 열린 InfoWindow 닫기
                companyInfoWindow.close();
                window.currentOpenMarkerId = null;
                window.currentOpenInfoWindow = null;
                setCurrentInfoWindow(null);
                setCurrentMarkerId(null);
                console.log('InfoWindow 닫힘');
              } else {
                // 기존에 열린 InfoWindow가 있다면 닫기
                if (window.currentOpenInfoWindow) {
                  window.currentOpenInfoWindow.close();
                }
                // 새로운 InfoWindow 열기
                companyInfoWindow.open(map, companyMarker);
                window.currentOpenMarkerId = companyMarker.companyId;
                window.currentOpenInfoWindow = companyInfoWindow;
                setCurrentInfoWindow(companyInfoWindow);
                setCurrentMarkerId(company.id);
                console.log('InfoWindow 열림:', company.name);
              }
            });

            newMarkers.push(companyMarker);
          } catch (error) {
            console.error('마커 생성 중 오류:', error);
          }
        }
      }

      // 새로운 마커들을 state에 저장
      setCompanyMarkers(newMarkers);
    };

    createMarkers();
  }, [map, companies]);

  return (
    <div className="map_wrap">
      {/* 상단 검색창 + 서비스 버튼 */}
      <div className="map-top-bar">
        <div className="search-box">
          <input type="text" placeholder="지역, 업체명을 검색하세요" />
          <button className="search-btn">검색</button>
        </div>
        <div className="service-filter-buttons">
          {services.map((s) => (
            <button
              key={s.id}
              className={`pill-btn ${selectedService === s.id ? 'active' : ''}`}
              onClick={() => handleServiceFilter(s.id)}
            >
              {s.icon} <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="map_content">
        {/* 사이드바 */}
        <aside className="sidebar">
          <h3>
            {selectedService
              ? `${services.find(s => s.id === selectedService)?.name} 펫메이트 목록 (${companies.length}개)`
              : `전체 펫메이트 목록 (${companies.length}개)`
            }
          </h3>
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
