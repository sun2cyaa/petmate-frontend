import React, { useEffect, useState } from "react";
import {
  FaHotel,
  FaHandsHelping,
  FaDog,
  FaCut,
  FaClinicMedical,
  FaSearch,
  FaEllipsisH,
  FaTimes,
} from "react-icons/fa";
import "./MapPage.css";
import { getNearbyCompanies } from "../../../services/companyService";
import CompanyDetailModal from "./CompanyDetailModal";
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
  const [selectedCompany, setSelectedCompany] = useState(null); // 선택된 업체 정보
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 추적

  // 현재 선택된 마커를 전역 변수로 관리 (클로저 문제 해결)
  const currentSelectedMarkerRef = React.useRef(null);

  const services = [
    { id: null, name: "전체", icon: <FaSearch /> },
    { id: "1", name: "돌봄", icon: <FaHandsHelping /> },
    { id: "2", name: "산책", icon: <FaDog /> },
    { id: "3", name: "미용", icon: <FaCut /> },
    { id: "4", name: "병원", icon: <FaClinicMedical /> },
    { id: "9", name: "기타", icon: <FaEllipsisH /> },
  ];

  // 원형 마커 생성 함수
  const createCircleMarker = (iconSrc, color = '#eb9666') =>
    new Promise((resolve) => {
      const SCALE = 2;
      const W = 36, H = 36;
      const centerX = 18, centerY = 18, r = 15;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = W * SCALE;
      canvas.height = H * SCALE;

      ctx.scale(SCALE, SCALE);
      ctx.imageSmoothingQuality = 'high';

      // 원형 배경
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.fill();

      // 테두리
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 아이콘
      const icon = new Image();
      icon.onload = () => {
        const iconSize = 18;
        ctx.drawImage(
          icon,
          centerX - iconSize / 2,
          centerY - iconSize / 2,
          iconSize,
          iconSize
        );
        resolve({
          url: canvas.toDataURL(),
          size: { w: W, h: H },
          offset: { x: Math.floor(W / 2), y: Math.floor(H / 2) }
        });
      };
      icon.onerror = () => {
        resolve({
          url: canvas.toDataURL(),
          size: { w: W, h: H },
          offset: { x: Math.floor(W / 2), y: Math.floor(H / 2) }
        });
      };
      icon.src = iconSrc;
    });

  // 물방울 마커 생성 함수 (선택 시에만 사용)
  const createDropMarker = (iconSrc, color = '#eb9666') =>
    new Promise((resolve) => {
      const SCALE = 2;
      const W = 48, H = 68;
      const centerX = 24, centerY = 24, r = 20;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = W * SCALE;
      canvas.height = H * SCALE;

      ctx.scale(SCALE, SCALE);
      ctx.imageSmoothingQuality = 'high';

      // 물방울 모양
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, Math.PI, 0, false);
      ctx.bezierCurveTo(44, 40, 24, 64, 24, 64);
      ctx.bezierCurveTo(24, 64, 4, 40, 4, 24);
      ctx.closePath();
      ctx.fill();

      // 테두리
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 그림자 효과
      ctx.shadowColor = 'rgba(255, 107, 53, 0.6)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      // 아이콘
      const icon = new Image();
      icon.onload = () => {
        const iconSize = 24;
        ctx.drawImage(
          icon,
          centerX - iconSize / 2,
          centerY - iconSize / 2,
          iconSize,
          iconSize
        );
        resolve({
          url: canvas.toDataURL(),
          size: { w: W, h: H },
          offset: { x: Math.floor(W / 2), y: H } // 바늘끝 기준
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
  const getMarkerImageForService = async (serviceCode, isSelected = false) => {
    const markerConfig = {
      '1': { icon: hands_white, color: '#eb9666' },
      '2': { icon: dog_white, color: '#eb9666' },
      '3': { icon: cut_white, color: '#eb9666' },
      '4': { icon: hospital_white, color: '#eb9666' },
      '9': { icon: etc_white, color: '#eb9666' },
    };

    const config = markerConfig[serviceCode] || markerConfig['9'];

    if (isSelected) {
      return await createDropMarker(config.icon, config.color);
    } else {
      return await createCircleMarker(config.icon, config.color);
    }
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

      // 지도 클릭 시 선택 해제
      window.kakao.maps.event.addListener(map, 'click', function(event) {
        console.log('=== 지도 클릭됨 ===');
        console.log('현재 선택된 마커 ID:', selectedMarker?.companyId);

        if (window.currentOpenInfoWindow) {
          window.currentOpenInfoWindow.close();
          window.currentOpenMarkerId = null;
          window.currentOpenInfoWindow = null;
          setCurrentInfoWindow(null);
          setCurrentMarkerId(null);
        }

        // 선택된 마커가 있다면 원형으로 복원
        if (currentSelectedMarkerRef.current) {
          console.log('지도 클릭 - 마커 복원 시작');
          
          // 물방울 마커 제거
          currentSelectedMarkerRef.current.selectedMarker.setMap(null);
          
          // 원형 마커 다시 표시
          currentSelectedMarkerRef.current.originalMarker.setMap(map);
          
          console.log('지도 클릭으로 마커 복원 완료');
        }

        currentSelectedMarkerRef.current = null;
        setSelectedMarker(null);
        setSelectedCompany(null);
        setCurrentMarkerId(null);
        console.log('지도 클릭으로 선택 해제 완료');
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
            const markerData = await getMarkerImageForService(company.repService, false);

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
              image: markerImage, // 커스텀 이미지 적용
              zIndex: 1 // 기본 z-index
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

            // 마커에 회사 ID와 서비스 코드 저장
            companyMarker.companyId = company.id;
            companyMarker.serviceCode = company.repService;
            companyMarker.infoWindow = companyInfoWindow;

            // 마커 클릭 이벤트 (선택 및 모달 열기)
            window.kakao.maps.event.addListener(companyMarker, 'click', async function(event) {
              console.log('=== 마커 클릭됨 ===');
              console.log('클릭된 마커 ID:', company.id, company.name);
              console.log('현재 선택된 마커 ID:', currentSelectedMarkerRef.current?.companyId);

              // 기존 열린 InfoWindow가 있다면 닫기
              if (window.currentOpenInfoWindow) {
                window.currentOpenInfoWindow.close();
              }

              // 현재 클릭된 마커가 이미 선택된 마커라면 선택 해제
              if (currentSelectedMarkerRef.current && currentSelectedMarkerRef.current.companyId === company.id) {
                console.log('같은 마커 클릭 - 선택 해제 시작');
                
                // 선택된 마커(물방울) 제거
                currentSelectedMarkerRef.current.selectedMarker.setMap(null);
                
                // 원형 마커 다시 표시
                currentSelectedMarkerRef.current.originalMarker.setMap(map);
                
                currentSelectedMarkerRef.current = null;
                setSelectedMarker(null);
                setSelectedCompany(null);
                setCurrentMarkerId(null);
                console.log('마커 선택 해제 완료:', company.name);
                return;
              }

              // 다른 마커가 선택되어 있다면 이전 마커를 일반 상태로 변경
              if (currentSelectedMarkerRef.current && currentSelectedMarkerRef.current.companyId !== company.id) {
                console.log('다른 마커 선택됨 - 이전 마커 복원 시작');
                
                // 이전 선택된 마커(물방울) 제거
                currentSelectedMarkerRef.current.selectedMarker.setMap(null);
                
                // 이전 원형 마커 다시 표시
                currentSelectedMarkerRef.current.originalMarker.setMap(map);
                
                console.log('이전 마커 복원 완료');
              }

              // 현재 마커를 선택 상태로 변경
              console.log('새 마커 선택 시작');
              try {
                // 원형 마커 숨기기
                companyMarker.setMap(null);
                
                // 물방울 마커 생성
                const selectedMarkerData = await getMarkerImageForService(company.repService, true);
                const selectedMarkerImage = new window.kakao.maps.MarkerImage(
                  selectedMarkerData.url,
                  new window.kakao.maps.Size(selectedMarkerData.size.w, selectedMarkerData.size.h),
                  {
                    offset: new window.kakao.maps.Point(selectedMarkerData.offset.x, selectedMarkerData.offset.y)
                  }
                );
                
                const selectedMarker = new window.kakao.maps.Marker({
                  position: new window.kakao.maps.LatLng(
                    parseFloat(company.latitude),
                    parseFloat(company.longitude)
                  ),
                  image: selectedMarkerImage,
                  zIndex: 1000
                });
                selectedMarker.setMap(map);

                // 마커 정보 저장 (원형과 물방울 둘 다)
                const markerPair = {
                  companyId: company.id,
                  serviceCode: company.repService,
                  originalMarker: companyMarker, // 원형 마커
                  selectedMarker: selectedMarker  // 물방울 마커
                };

                // 선택된 마커와 업체 정보 업데이트
                currentSelectedMarkerRef.current = markerPair;
                setSelectedMarker(selectedMarker);
                setSelectedCompany(company);
                setCurrentMarkerId(company.id);

                console.log('새 마커 선택 완료:', company.name);
              } catch (error) {
                console.error('새 마커 선택 중 오류:', error);
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
                  <div
                    key={company.id}
                    className={`list-item ${selectedCompany?.id === company.id ? 'selected' : ''}`}
                    onClick={() => {
                      const targetMarker = companyMarkers.find(marker => marker.companyId === company.id);
                      if (targetMarker) {
                        window.kakao.maps.event.trigger(targetMarker, 'click');
                      }
                    }}
                  >
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
          <div id="map" style={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none"
          }}></div>

          <CompanyDetailModal
            selectedCompany={selectedCompany}
            services={services}
            onClose={() => {
              // 선택된 마커가 있다면 원형으로 복원
              if (currentSelectedMarkerRef.current) {
                console.log('모달 닫기 - 마커 복원 시작');
                
                // 물방울 마커 제거
                currentSelectedMarkerRef.current.selectedMarker.setMap(null);
                
                // 원형 마커 다시 표시
                currentSelectedMarkerRef.current.originalMarker.setMap(map);
                
                console.log('모달 닫기로 마커 복원됨');
              }

              currentSelectedMarkerRef.current = null;
              setSelectedCompany(null);
              setSelectedMarker(null);
              setCurrentMarkerId(null);
            }}
          />
          
        </div>
      </div>

      
    </div>
  );
}

export default MapPage;