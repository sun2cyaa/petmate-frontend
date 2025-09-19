// src/pages/common/Map/MapPage.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FaHandsHelping,
  FaDog,
  FaCut,
  FaClinicMedical,
  FaSearch,
  FaEllipsisH,
} from "react-icons/fa";
import "./MapPage.css";
import { getNearbyCompanies } from "../../../services/companyService";
import CompanyListSidebar from "./components/CompanyListSidebar";
import { getAddressesByDefault } from "../../../services/addressService";
import { useAuth } from "../../../contexts/AuthContext";
import SearchBar from "./components/SearchBar";
import MapContainer from "./components/MapContainer";
import MapBookingModal from "./components/MapBookingModal";

function MapPage() {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [companyMarkers, setCompanyMarkers] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const initOnceRef = useRef(false);
  const { user } = useAuth();
  // 예약하기 추가
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingCompany, setBookingCompany] = useState(null);

  // 예약 모달 열기 (CompanyDetailModal에서 호출됨)
  const handleOpenBookingModal = (company) => {
    setBookingCompany(company);
    setBookingModalOpen(true);
  };

  // 예약 모달 닫기
  const handleCloseBookingModal = () => {
    setBookingModalOpen(false);
    setBookingCompany(null);
  };

  // 지도 페이지에서만 스크롤 제거
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const services = [
    { id: null, name: "전체", icon: <FaSearch /> },
    { id: "1", name: "돌봄", icon: <FaHandsHelping /> },
    { id: "2", name: "산책", icon: <FaDog /> },
    { id: "3", name: "미용", icon: <FaCut /> },
    { id: "4", name: "병원", icon: <FaClinicMedical /> },
    { id: "9", name: "기타", icon: <FaEllipsisH /> },
  ];

  // 카카오 맵 스크립트 로드 (services 라이브러리 포함)
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
      script.async = true;
      script.onload = () =>
        window.kakao.maps.load(() => setIsKakaoLoaded(true));
      script.onerror = () => console.error("카카오 맵 스크립트 로딩 실패");
      document.head.appendChild(script);
    };
    loadKakaoMap();
  }, []);

  // 근처 업체 로드 - useCallback으로 함수 메모이제이션
  const loadNearbyCompanies = useCallback(
    async (latitude, longitude) => {
      try {
        setLoading(true);
        const data = await getNearbyCompanies(
          latitude,
          longitude,
          5.0,
          selectedService
        );
        setCompanies(data);
      } catch (e) {
        console.log("업체 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    },
    [selectedService]
  );

  // 서비스 필터 - useCallback으로 메모이제이션
  const handleServiceFilter = useCallback((serviceId) => {
    setSelectedService(serviceId);
    setCurrentPage(1);
  }, []);

  // 검색 기능 (지도 조작 제거)
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    try {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(searchQuery, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            // 주소 검색 성공 - 위치 업데이트 (MapContainer가 지도 이동 처리)
            setUserLocation({
              latitude: parseFloat(result[0].y),
              longitude: parseFloat(result[0].x),
            });
          } else {
            // 주소 검색 실패 - 업체명으로 검색
            searchByCompanyName(searchQuery);
          }
        });
      } else {
        console.warn("카카오맵 services가 로드되지 않았습니다.");
        searchByCompanyName(searchQuery);
      }
    } catch (e) {
      console.error("검색 오류:", e);
      searchByCompanyName(searchQuery);
    }
  }, [searchQuery, companies]);

  // 업체명으로 검색 - useCallback으로 메모이제이션
  const searchByCompanyName = useCallback(
    (query) => {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(query.toLowerCase()) ||
          company.roadAddr.toLowerCase().includes(query.toLowerCase())
      );

      if (filtered.length > 0) {
        // 첫 번째 검색 결과 선택
        const firstResult = filtered[0];
        setSelectedCompany(firstResult);
      }

      setFilteredCompanies(filtered);
      setCurrentPage(1);
    },
    [companies]
  );

  // 검색 입력 처리 - useCallback으로 메모이제이션
  const handleSearchInput = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setFilteredCompanies([]);
    }
  }, []);

  // 엔터키 처리 - useCallback으로 메모이제이션
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  // 회사 선택 핸들러 - useCallback으로 메모이제이션
  const handleCompanySelect = useCallback((company) => {
    setSelectedCompany(company);
  }, []);

  // 마커 변경 핸들러 - useCallback으로 메모이제이션
  const handleMarkersChange = useCallback((markers) => {
    setCompanyMarkers(markers);
  }, []);

  // 페이징 계산
  const displayCompanies =
    filteredCompanies.length > 0 ? filteredCompanies : companies;
  const totalPages = Math.ceil(displayCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = displayCompanies.slice(startIndex, endIndex);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  // 위치/서비스 변경 시 재로드
  useEffect(() => {
    if (userLocation) {
      loadNearbyCompanies(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation, loadNearbyCompanies]);

  // 사용자 위치 설정
  useEffect(() => {
    if (!isKakaoLoaded || initOnceRef.current) return;
    initOnceRef.current = true;

    const initailizeLocation = async () => {
      try {
        // 1순위: 로그인 사용자의 기본 주소
        if (user?.userId) {
          try {
            const defaultAddress = await getAddressesByDefault(user.userId);
            if (defaultAddress?.latitude && defaultAddress?.longitude) {
              setUserLocation({
                latitude: defaultAddress.latitude,
                longitude: defaultAddress.longitude,
              });
              return;
            }
          } catch (e) {
            console.log("기본주소 로드 실패, GPS 시도:", e);
          }
        }

        // 2순위: GPS 위치
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setUserLocation({ latitude, longitude });
            },
            () => {
              // 3순위: 서울시청 기본값
              const lat = 37.5665,
                lng = 126.978;
              setUserLocation({ latitude: lat, longitude: lng });
            }
          );
        } else {
          // GPS 미지원 시 기본값
          const lat = 37.5665,
            lng = 126.978;
          setUserLocation({ latitude: lat, longitude: lng });
        }
      } catch (e) {
        console.error("위치 초기화 오류:", e);
        // 최종 풀백
        const lat = 37.5665,
          lng = 126.978;
        setUserLocation({ latitude: lat, longitude: lng });
      }
    };

    initailizeLocation();
  }, [isKakaoLoaded, user]);

  return (
    <div className="map_wrap">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchInput}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
        services={services}
        selectedService={selectedService}
        onServiceFilter={handleServiceFilter}
      />

      <div className="map_content">
        <CompanyListSidebar
          searchQuery={searchQuery}
          filteredCompanies={filteredCompanies}
          selectedService={selectedService}
          services={services}
          displayCompanies={displayCompanies}
          loading={loading}
          currentCompanies={currentCompanies}
          selectedCompany={selectedCompany}
          companyMarkers={companyMarkers}
          startIndex={startIndex}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <MapContainer
          isKakaoLoaded={isKakaoLoaded}
          userLocation={userLocation}
          companies={companies}
          selectedCompany={selectedCompany}
          services={services}
          onCompanySelect={handleCompanySelect}
          onLocationChange={loadNearbyCompanies}
          onMarkersChange={handleMarkersChange}
          onBookingClick={handleOpenBookingModal}
        />

        {/* 예약 모달 (회사 디테일 모달 옆에 위치) */}
        {bookingModalOpen && (
          <div className="booking-modal-overlay-center">
            <MapBookingModal
              selectedCompany={bookingCompany}
              onClose={handleCloseBookingModal}
              isOpen={bookingModalOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPage;
