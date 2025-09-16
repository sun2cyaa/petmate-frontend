import { useState, useEffect } from "react";
import { X, MapPin, Loader2, Navigation } from "lucide-react";
import "./MapModal.css";

export default function MapModal({ show, onClose, onLocationSelect }) {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // coord2Address 응답 파싱(도로명 우선, 우편번호 road_address.zone_no)
  const parseAddressFromCoord2Address = (result) => {
    const first = result?.[0];
    const road = first?.road_address;
    const jibun = first?.address;
    return {
      address: road?.address_name ?? jibun?.address_name ?? "",
      postcode: road?.zone_no ?? "",
    };
  };

  // 카카오 맵 스크립트 로드 (중복 로드 방지)
  useEffect(() => {
    if (!show) return;

    const ensureKakaoLoaded = () => {
      if (window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true);
        return;
      }

      const EXISTING_ID = "kakao-maps-sdk";
      if (!document.getElementById(EXISTING_ID)) {
        const script = document.createElement("script");
        script.id = EXISTING_ID;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
        // async/defer 사용 안 함 (document.write 충돌 회피)
        script.onload = () => {
          window.kakao.maps.load(() => setIsKakaoLoaded(true));
        };
        script.onerror = () => {
          console.error("카카오 맵 스크립트 로딩 실패");
        };
        document.head.appendChild(script);
      } else {
        // 이미 존재하면 load만 보장
        const tryLoad = () => {
          if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => setIsKakaoLoaded(true));
          } else {
            setTimeout(tryLoad, 100);
          }
        };
        tryLoad();
      }
    };

    ensureKakaoLoaded();
  }, [show]);

  // 지도 초기화
  useEffect(() => {
    if (!isKakaoLoaded || !show) return;

    const container = document.getElementById("modal-map");
    if (!container) return;

    const defaultLat = 37.5665;
    const defaultLng = 126.9780;
    const defaultPosition = new window.kakao.maps.LatLng(defaultLat, defaultLng);

    const options = { center: defaultPosition, level: 3 };
    const newMap = new window.kakao.maps.Map(container, options);
    setMap(newMap);

    const newMarker = new window.kakao.maps.Marker({
      position: defaultPosition,
      draggable: true,
    });
    newMarker.setMap(newMap);
    setMarker(newMarker);

    // 초기 위치 정보
    setSelectedLocation({
      address: "서울특별시 중구 태평로1가 31 (서울시청)",
      latitude: defaultLat,
      longitude: defaultLng,
      postcode: "",
    });

    const geocoder = new window.kakao.maps.services.Geocoder();

    // 마커 드래그 종료 → 좌표→주소
    window.kakao.maps.event.addListener(newMarker, "dragend", function () {
      const position = newMarker.getPosition();
      geocoder.coord2Address(position.getLng(), position.getLat(), (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const { address, postcode } = parseAddressFromCoord2Address(result);
          setSelectedLocation({
            address,
            postcode,
            latitude: position.getLat(),
            longitude: position.getLng(),
          });
        }
      });
    });

    // 지도 클릭 → 마커 이동 + 좌표→주소
    window.kakao.maps.event.addListener(newMap, "click", function (mouseEvent) {
      const position = mouseEvent.latLng;
      newMarker.setPosition(position);
      geocoder.coord2Address(position.getLng(), position.getLat(), (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const { address, postcode } = parseAddressFromCoord2Address(result);
          setSelectedLocation({
            address,
            postcode,
            latitude: position.getLat(),
            longitude: position.getLng(),
          });
        }
      });
    });

    // 현재 위치로 한번 이동 시도
    getCurrentLocationAndMove(newMap, newMarker, geocoder);
  }, [isKakaoLoaded, show]);

  const getCurrentLocationAndMove = (mapInstance, markerInstance, geocoder) => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        const current = new window.kakao.maps.LatLng(latitude, longitude);

        mapInstance.setCenter(current);
        markerInstance.setPosition(current);

        geocoder.coord2Address(longitude, latitude, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const { address, postcode } = parseAddressFromCoord2Address(result);
            setSelectedLocation({ address, postcode, latitude: latitude, longitude: longitude });
          }
        });
      },
      (err) => {
        console.log("현재 위치 가져오기 실패:", err);
      }
    );
  };

  const handleCurrentLocation = () => {
    if (!map || !marker) return;
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      alert("브라우저가 위치 정보를 지원하지 않습니다.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        const current = new window.kakao.maps.LatLng(latitude, longitude);

        map.setCenter(current);
        marker.setPosition(current);

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(longitude, latitude, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const { address, postcode } = parseAddressFromCoord2Address(result);
            setSelectedLocation({ address, postcode, latitude: latitude, longitude: longitude });
          }
          setIsLoadingLocation(false);
        });
      },
      (err) => {
        console.error("현재 위치를 가져올 수 없습니다:", err);
        alert("현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.");
        setIsLoadingLocation(false);
      }
    );
  };

  // 선택 확정: 우편번호가 비었으면 한번 더 보정 후 부모로 전달
  const handleSelect = () => {
    if (!selectedLocation) return;

    const { latitude, longitude, postcode } = selectedLocation || {};
    if (postcode || latitude == null || longitude == null) {
      onLocationSelect?.(selectedLocation);
      onClose?.();
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(Number(longitude), Number(latitude), (result, status) => {
      let finalLoc = { ...selectedLocation };
      if (status === window.kakao.maps.services.Status.OK) {
        const { address: a2, postcode: p2 } = parseAddressFromCoord2Address(result);
        finalLoc.address = a2 || finalLoc.address || "";
        finalLoc.postcode = p2 || finalLoc.postcode || "";
      }
      onLocationSelect?.(finalLoc);
      onClose?.();
    });
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="map-modal-content">
        <div className="modal-header">
          <h3 className="modal-title">지도에서 주소 찾기</h3>
          <button className="close-button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="map-content">
          {!isKakaoLoaded && (
            <div className="map-loading">
              <Loader2 size={32} className="spin" />
              <p>지도를 로딩 중...</p>
            </div>
          )}
          <div
            id="modal-map"
            style={{
              width: "100%",
              height: "400px",
              display: isKakaoLoaded ? "block" : "none",
            }}
          />
        </div>

        <div className="map-info">
          <div className="location-info">
            <MapPin size={16} />
            <span>{selectedLocation?.address || "위치를 선택해주세요"}</span>
          </div>
          <button
            className="current-location-btn"
            onClick={handleCurrentLocation}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? <Loader2 size={16} className="spin" /> : <Navigation size={16} />}
            현재 위치로 이동
          </button>
        </div>

        <div className="map-actions">
          <button
            onClick={handleSelect}
            className="select-location-button"
            disabled={!selectedLocation}
          >
            이 위치로 설정
          </button>
        </div>
      </div>
    </div>
  );
}
