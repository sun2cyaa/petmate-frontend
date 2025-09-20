// src/pages/common/Map/components/MapContainer.jsx
import React, { useEffect, useRef, useCallback, useState } from "react";
import CompanyDetailModal from "./CompanyDetailModal";
import "./MapContainer.css";

import cut_white from "../../../../assets/images/map/cut_white.png";
import dog_white from "../../../../assets/images/map/dog_white.png";
import etc_white from "../../../../assets/images/map/etc_white.png";
import hands_white from "../../../../assets/images/map/hands_white.png";
import hospital_white from "../../../../assets/images/map/hospital_white.png";

function MapContainer({
  isKakaoLoaded,
  userLocation,
  companies,
  selectedCompany,
  services,
  onCompanySelect,
  onLocationChange,
  onMarkersChange,
  onBookingClick,
}) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const labelsRef = useRef([]);
  const currentSelectedMarkerRef = useRef(null);
  const isInitializedRef = useRef(false);
  const userMarkerRef = useRef(null); // 사용자 위치 마커 참조
  const isUserDraggingRef = useRef(false); // 사용자가 마커를 드래그 중인지 확인
  
  // 현재 위치 버튼 로딩 상태
  const [isLocating, setIsLocating] = useState(false);

  // 사용자 위치 마커용 커스텀 이미지 생성
  const createUserLocationMarker = useCallback(() => {
    return new Promise((resolve) => {
      const SCALE = 2;
      const W = 40, H = 40;
      const centerX = 20, centerY = 20, r = 18;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = W * SCALE;
      canvas.height = H * SCALE;

      ctx.scale(SCALE, SCALE);
      ctx.imageSmoothingQuality = "high";

      // 외부 원 (흰색 테두리)
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.fill();

      // 내부 원 (파란색)
      ctx.fillStyle = "#4285F4";
      ctx.beginPath();
      ctx.arc(centerX, centerY, r - 3, 0, 2 * Math.PI);
      ctx.fill();

      // 중심점 (흰색)
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
      ctx.fill();

      // 그림자 효과
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      resolve({
        url: canvas.toDataURL(),
        size: { w: W, h: H },
        offset: { x: Math.floor(W / 2), y: Math.floor(H / 2) },
      });
    });
  }, []);

  // 원형 마커 이미지 생성
  const createCircleMarker = useCallback((iconSrc, color = "#eb9666") =>
    new Promise((resolve) => {
      const SCALE = 2;
      const W = 36, H = 36;
      const centerX = 18, centerY = 18, r = 15;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = W * SCALE;
      canvas.height = H * SCALE;

      ctx.scale(SCALE, SCALE);
      ctx.imageSmoothingQuality = "high";

      // 원형 배경
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.fill();

      // 테두리
      ctx.strokeStyle = "#fff";
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
          offset: { x: Math.floor(W / 2), y: Math.floor(H / 2) },
        });
      };
      icon.onerror = () => {
        resolve({
          url: canvas.toDataURL(),
          size: { w: W, h: H },
          offset: { x: Math.floor(W / 2), y: Math.floor(H / 2) },
        });
      };
      icon.src = iconSrc;
    }), []);

  // 물방울 마커 이미지 생성
  const createDropMarker = useCallback((iconSrc, color = "#eb9666") =>
    new Promise((resolve) => {
      const SCALE = 2;
      const W = 48, H = 68;
      const centerX = 24, centerY = 24, r = 20;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = W * SCALE;
      canvas.height = H * SCALE;

      ctx.scale(SCALE, SCALE);
      ctx.imageSmoothingQuality = "high";

      // 물방울 모양
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, Math.PI, 0, false);
      ctx.bezierCurveTo(44, 40, 24, 64, 24, 64);
      ctx.bezierCurveTo(24, 64, 4, 40, 4, 24);
      ctx.closePath();
      ctx.fill();

      // 테두리
      ctx.strokeStyle = "#ff6b35";
      ctx.lineWidth = 3;
      ctx.stroke();

      // 그림자 효과
      ctx.shadowColor = "rgba(255, 107, 53, 0.6)";
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
          offset: { x: Math.floor(W / 2), y: H },
        });
      };
      icon.onerror = () => {
        resolve({
          url: canvas.toDataURL(),
          size: { w: W, h: H },
          offset: { x: Math.floor(W / 2), y: H },
        });
      };
      icon.src = iconSrc;
    }), []);

  // 서비스별 마커 이미지
  const getMarkerImageForService = useCallback(async (serviceCode, isSelected = false) => {
    const markerConfig = {
      "1": { icon: hands_white, color: "#eb9666" },
      "2": { icon: dog_white, color: "#eb9666" },
      "3": { icon: cut_white, color: "#eb9666" },
      "4": { icon: hospital_white, color: "#eb9666" },
      "9": { icon: etc_white, color: "#eb9666" },
    };
    const config = markerConfig[serviceCode] || markerConfig["9"];
    return isSelected
      ? await createDropMarker(config.icon, config.color)
      : await createCircleMarker(config.icon, config.color);
  }, [createCircleMarker, createDropMarker]);

  // 업체명 라벨
  const createCompanyLabel = useCallback((company, position) => {
    const labelContent = `
      <div style="
        background: rgba(235, 150, 102, 0.95);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        text-align: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.2);
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
      ">
        ${company.name}
      </div>
    `;
    return new window.kakao.maps.CustomOverlay({
      content: labelContent,
      position,
      yAnchor: -0.5,
      xAnchor: 0.5,
    });
  }, []);

  // 사용자 위치 마커 생성 및 드래그 이벤트 설정
  const createUserMarker = useCallback(async (map, position) => {
    console.log('createUserMarker 호출됨:', position);
    try {
      const userMarkerData = await createUserLocationMarker();
      console.log('사용자 마커 이미지 데이터 생성 완료:', userMarkerData);
      
      const userMarkerImage = new window.kakao.maps.MarkerImage(
        userMarkerData.url,
        new window.kakao.maps.Size(userMarkerData.size.w, userMarkerData.size.h),
        {
          offset: new window.kakao.maps.Point(userMarkerData.offset.x, userMarkerData.offset.y),
        }
      );

      const userMarker = new window.kakao.maps.Marker({
        position: position,
        image: userMarkerImage,
        map: map,
        draggable: true, // 드래그 가능하도록 설정
        zIndex: 999 // 다른 마커들보다 위에 표시
      });

      console.log('사용자 마커 생성 완료:', userMarker);

      // 드래그 시작 이벤트
      window.kakao.maps.event.addListener(userMarker, 'dragstart', function() {
        isUserDraggingRef.current = true;
        userMarker.setOpacity(0.7);
        console.log('사용자 마커 드래그 시작');
      });

      // 드래그 중 이벤트
      window.kakao.maps.event.addListener(userMarker, 'drag', function() {
        userMarker.setOpacity(0.7);
      });

      // 드래그 종료 이벤트
      window.kakao.maps.event.addListener(userMarker, 'dragend', function() {
        isUserDraggingRef.current = false;
        userMarker.setOpacity(1.0);
        
        const markerPosition = userMarker.getPosition();
        const newLat = markerPosition.getLat();
        const newLng = markerPosition.getLng();
        
        // 새로운 위치로 업체 조회
        onLocationChange(newLat, newLng);
        
        console.log(`사용자가 마커를 드래그로 이동: 위도 ${newLat}, 경도 ${newLng}`);
      });

      return userMarker;
    } catch (error) {
      console.error("사용자 마커 생성 실패:", error);
      // 기본 마커 생성 (fallback)
      console.log('기본 마커로 대체 생성 시도');
      
      const fallbackMarker = new window.kakao.maps.Marker({
        position: position,
        map: map,
        draggable: true,
        zIndex: 999
      });
      
      // 기본 마커에도 동일한 이벤트 추가
      window.kakao.maps.event.addListener(fallbackMarker, 'dragstart', function() {
        isUserDraggingRef.current = true;
        fallbackMarker.setOpacity(0.7);
      });

      window.kakao.maps.event.addListener(fallbackMarker, 'dragend', function() {
        isUserDraggingRef.current = false;
        fallbackMarker.setOpacity(1.0);
        
        const markerPosition = fallbackMarker.getPosition();
        const newLat = markerPosition.getLat();
        const newLng = markerPosition.getLng();
        
        onLocationChange(newLat, newLng);
        console.log(`기본 마커 드래그로 이동: 위도 ${newLat}, 경도 ${newLng}`);
      });
      
      return fallbackMarker;
    }
  }, [createUserLocationMarker, onLocationChange]);

  // 지도 중심이 변경될 때 사용자 마커를 중심으로 이동
  const updateUserMarkerToCenter = useCallback(() => {
    if (!mapRef.current || !userMarkerRef.current || isUserDraggingRef.current) {
      return; // 사용자가 드래그 중이면 자동 이동하지 않음
    }
    
    const center = mapRef.current.getCenter();
    const centerLat = center.getLat();
    const centerLng = center.getLng();
    
    // 마커를 지도 중심으로 이동
    const newPosition = new window.kakao.maps.LatLng(centerLat, centerLng);
    userMarkerRef.current.setPosition(newPosition);
    
    console.log(`지도 중심 변경으로 마커 이동: 위도 ${centerLat}, 경도 ${centerLng}`);
  }, []);

  // 지도 드래그/줌 이벤트 핸들러
  const handleMapChange = useCallback(() => {
    if (!mapRef.current) return;
    
    const center = mapRef.current.getCenter();
    const centerLat = center.getLat();
    const centerLng = center.getLng();
    
    // 사용자 마커를 지도 중심으로 이동 (사용자가 드래그 중이 아닐 때만)
    updateUserMarkerToCenter();
    
    // 업체 조회
    onLocationChange(centerLat, centerLng);
  }, [onLocationChange, updateUserMarkerToCenter]);

  // 현재 위치로 이동하는 함수
  const moveToCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = new window.kakao.maps.LatLng(latitude, longitude);
        
        // 지도 중심 이동
        if (mapRef.current) {
          mapRef.current.setCenter(newPosition);
        }
        
        // 사용자 마커 이동
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(newPosition);
        }
        
        // 업체 재조회
        onLocationChange(latitude, longitude);
        
        console.log(`현재 위치로 이동: 위도 ${latitude}, 경도 ${longitude}`);
        
        setIsLocating(false);
      },
      (error) => {
        console.error('위치 정보 가져오기 실패:', error);
        
        let errorMessage = '위치 정보를 가져올 수 없습니다.';
        // eslint-disable-next-line default-case
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 접근이 거부되었습니다. 브라우저 설정을 확인해주세요.';
            break;

          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;

          case error.TIMEOUT:
            errorMessage = '위치 정보 요청이 시간 초과되었습니다.';
            break;
        }
        
        alert(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [onLocationChange]);

  // 지도 클릭 핸들러
  const handleMapClick = useCallback(() => {
    if (currentSelectedMarkerRef.current) {
      currentSelectedMarkerRef.current.setImage(
        currentSelectedMarkerRef.current._normalImage
      );
      currentSelectedMarkerRef.current.setZIndex(1);
    }
    currentSelectedMarkerRef.current = null;
    onCompanySelect(null);
  }, [onCompanySelect]);

  // 지도 초기화
  useEffect(() => {
    if (!isKakaoLoaded || !userLocation || isInitializedRef.current) return;
    
    const container = document.getElementById("map");
    if (!container) return;

    const options = {
      center: new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude),
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, options);
    mapRef.current = map;
    isInitializedRef.current = true;

    // 드래그 가능한 사용자 위치 마커 생성
    const userPosition = new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude);
    createUserMarker(map, userPosition).then(marker => {
      if (marker) {
        userMarkerRef.current = marker;
        console.log('사용자 마커 생성 완료:', marker);
      } else {
        console.error('사용자 마커 생성 실패');
      }
    }).catch(error => {
      console.error('사용자 마커 생성 중 오류:', error);
    });

    // 지도 이벤트 리스너
    window.kakao.maps.event.addListener(map, "dragend", handleMapChange);
    window.kakao.maps.event.addListener(map, "zoom_changed", handleMapChange);
    window.kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      if (map) {
        window.kakao.maps.event.removeListener(map, "dragend", handleMapChange);
        window.kakao.maps.event.removeListener(map, "zoom_changed", handleMapChange);
        window.kakao.maps.event.removeListener(map, "click", handleMapClick);
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
    };
  }, [isKakaoLoaded, userLocation, handleMapChange, handleMapClick, createUserMarker]);

  // 지도 중심 변경 (userLocation 변경시)
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    
    const moveLatLon = new window.kakao.maps.LatLng(
      userLocation.latitude, 
      userLocation.longitude
    );
    mapRef.current.setCenter(moveLatLon);
    
    // 사용자 마커 위치도 업데이트
    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(moveLatLon);
    }
  }, [userLocation]);

  // 업체 마커 표시
  useEffect(() => {
    if (!mapRef.current || !companies || companies.length === 0) {
      // 마커 정리
      markersRef.current.forEach(m => m.setMap(null));
      labelsRef.current.forEach(l => l.setMap(null));
      markersRef.current = [];
      labelsRef.current = [];
      if (onMarkersChange) onMarkersChange([]);
      return;
    }

    let isCancelled = false;

    const createMarkers = async () => {
      try {
        // 기존 마커들 제거
        markersRef.current.forEach(m => m.setMap(null));
        labelsRef.current.forEach(l => l.setMap(null));
        markersRef.current = [];
        labelsRef.current = [];

        const newMarkers = [];
        const newLabels = [];

        for (const company of companies) {
          if (isCancelled) break;
          if (!company.latitude || !company.longitude) continue;

          try {
            const position = new window.kakao.maps.LatLng(
              parseFloat(company.latitude),
              parseFloat(company.longitude)
            );

            // 기본/선택 이미지 모두 준비
            const normalData = await getMarkerImageForService(company.repService, false);
            const selectedData = await getMarkerImageForService(company.repService, true);

            if (isCancelled) break;

            const normalImage = new window.kakao.maps.MarkerImage(
              normalData.url,
              new window.kakao.maps.Size(normalData.size.w, normalData.size.h),
              {
                offset: new window.kakao.maps.Point(normalData.offset.x, normalData.offset.y),
              }
            );
            const selectedImage = new window.kakao.maps.MarkerImage(
              selectedData.url,
              new window.kakao.maps.Size(selectedData.size.w, selectedData.size.h),
              {
                offset: new window.kakao.maps.Point(selectedData.offset.x, selectedData.offset.y),
              }
            );

            // 업체 마커
            const companyMarker = new window.kakao.maps.Marker({
              position,
              image: normalImage,
              zIndex: 1,
              map: mapRef.current,
            });

            // 메타 저장
            companyMarker.companyId = company.id;
            companyMarker.serviceCode = company.repService;
            companyMarker._normalImage = normalImage;
            companyMarker._selectedImage = selectedImage;

            newMarkers.push(companyMarker);

            // 라벨
            const companyLabel = createCompanyLabel(company, position);
            companyLabel.setMap(mapRef.current);
            newLabels.push(companyLabel);

            // 클릭 이벤트
            window.kakao.maps.event.addListener(companyMarker, "click", function () {
              
              // 동일 마커 재클릭 → 해제
              if (currentSelectedMarkerRef.current === companyMarker) {
                companyMarker.setImage(companyMarker._normalImage);
                companyMarker.setZIndex(1);
                currentSelectedMarkerRef.current = null;
                onCompanySelect(null);
                return;
              }

              // 기존 선택 마커 복원
              if (currentSelectedMarkerRef.current) {
                currentSelectedMarkerRef.current.setImage(
                  currentSelectedMarkerRef.current._normalImage
                );
                currentSelectedMarkerRef.current.setZIndex(1);
              }

              // 현재 마커 선택
              companyMarker.setImage(companyMarker._selectedImage);
              companyMarker.setZIndex(1000);
              currentSelectedMarkerRef.current = companyMarker;
              onCompanySelect(company);

              // 지도 중심을 살짝 이동
              const moveLatLon = new window.kakao.maps.LatLng(
                parseFloat(company.latitude),
                parseFloat(company.longitude)
              );
              mapRef.current.panTo(moveLatLon);
            });
          } catch (error) {
            console.error("개별 마커 생성 중 오류:", error);
          }
        }

        if (!isCancelled) {
          markersRef.current = newMarkers;
          labelsRef.current = newLabels;

          // 부모 컴포넌트로 마커 전달
          if (onMarkersChange) {
            onMarkersChange(newMarkers);
          }
        }
      } catch (error) {
        console.error("마커 생성 중 전체 오류:", error);
      }
    };

    createMarkers();

    return () => {
      isCancelled = true;
    };
  }, [companies, getMarkerImageForService, createCompanyLabel, onCompanySelect, onMarkersChange]);

  // 모달 닫기 핸들러
  const handleModalClose = useCallback(() => {
    if (currentSelectedMarkerRef.current) {
      currentSelectedMarkerRef.current.setImage(
        currentSelectedMarkerRef.current._normalImage
      );
      currentSelectedMarkerRef.current.setZIndex(1);
    }
    currentSelectedMarkerRef.current = null;
    onCompanySelect(null);
  }, [onCompanySelect]);

  return (
    <div className="map_area">
      {!isKakaoLoaded && <div>지도를 불러오는 중...</div>}
      
      <div className="map-container">
        <div id="map">
          {/* 사용 안내 메시지 */}
          <div className="map-guide">
            지도를 움직이거나 파란색 마커를 드래그해서 위치를 조정하세요
          </div>

          {/* 현재 위치 버튼 */}
          <button
            className={`current-location-btn ${isLocating ? 'loading' : ''}`}
            onClick={moveToCurrentLocation}
            disabled={isLocating}
            title={isLocating ? '위치 확인 중...' : '현재 위치로 이동'}
          ></button>
        </div>
      </div>

      <CompanyDetailModal
        selectedCompany={selectedCompany}
        onClose={handleModalClose}
        onBookingClick={onBookingClick}
      />
    </div>
  );
}

export default MapContainer;