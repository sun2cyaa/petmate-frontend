import React, { useEffect, useState } from "react";
import './MapPage.css';




function MapPage() {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

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
        window.kakao.maps.load(() => {
          setIsKakaoLoaded(true);
        });
      };
      
      script.onerror = () => {
        console.error("카카오 맵 스크립트 로딩에 실패했습니다.");
      };
      
      document.head.appendChild(script);
    };

    loadKakaoMap();
  }, []);

  useEffect(() => {
    if (!isKakaoLoaded) return;

    const initializeMap = () => {
      const container = document.getElementById("map");
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            const options = {
              center: new window.kakao.maps.LatLng(lat, lng),
              level: 3,
            };
            
            const map = new window.kakao.maps.Map(container, options);

            // 버튼 클릭에 따라 지도 이동 기능을 막거나 풀고 싶은 경우에는 map.setDraggable 함수를 사용합니다
            function setDraggable(draggable) {
                // 마우스 드래그로 지도 이동 가능여부를 설정합니다
                map.setDraggable(draggable);
            }
            
            const markerPosition = new window.kakao.maps.LatLng(lat, lng);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition
            });
            marker.setMap(map);
            
            const infowindow = new window.kakao.maps.InfoWindow({
              content: '<div style="padding:5px;">현재 위치</div>'
            });
            infowindow.open(map, marker);
          },
          (error) => {
            console.error("위치 정보를 가져올 수 없습니다:", error);
            const options = {
              center: new window.kakao.maps.LatLng(37.5665, 126.9780),
              level: 3,
            };
            
            const map = new window.kakao.maps.Map(container, options);
            
            const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.9780);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition
            });
            marker.setMap(map);
            
            const infowindow = new window.kakao.maps.InfoWindow({
              content: '<div style="padding:5px;">서울시청</div>'
            });
            infowindow.open(map, marker);
          }
        );
      } else {
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3,
        };
        
        const map = new window.kakao.maps.Map(container, options);
        
        const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.9780);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);
        
        const infowindow = new window.kakao.maps.InfoWindow({
          content: '<div style="padding:5px;">서울시청</div>'
        });
        infowindow.open(map, marker);
      }
    };

    initializeMap();
  }, [isKakaoLoaded]);

  return (
    <div className="map_wrap">
      {/* 상단 옵션 영역 - 헤더 바로 아래 */}
      <div>
        옵션 넣는 부분 (필터, 설정 등)
      </div>
      
      {/* 메인 컨텐츠: 사이드바 + 지도 */}
      <div className="map_content">
        {/* 왼쪽 사이드바 */}
        <aside className="sidebar">
          <h3>펫메이트 검색</h3>
          <input type="text" placeholder="주소/장소 입력" />
          <button>검색</button>

          <div className="list">
            <p>업체 리스트 1</p>
            <p>업체 리스트 2</p>
            <p>업체 리스트 3</p>
          </div>
        </aside>

        {/* 오른쪽 지도 영역 */}
        <div className="map_area">
          {!isKakaoLoaded && <div>지도를 로딩 중...</div>}
          <div id="map" style={{ width: "100%", height: "100%" }}></div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
