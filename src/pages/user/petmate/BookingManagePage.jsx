import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import CalendarPanel from "../../../components/ui/Calendar/CalendarPanel";
import ReservationList from "../../../components/ui/Card/ReservationList";
import { bookingService } from "../../../services/booking/bookingServiceEx";
import "../../../styles/user.css";
import "../../../styles/reservation.css";
import { useAuth } from "./../../../contexts/AuthContext";
import { getMyCompanies } from "../../../services/companyService";

// 아이콘 추가
import { FaCalendarAlt, FaListUl } from "react-icons/fa";

// Day.js 한국어 로케일 설정
dayjs.locale("ko");

const BookingManagePage = () => {
  const { user, isLogined } = useAuth();

  // 디버깅: 컴포넌트 렌더링 시마다 상태 확인
  console.log("ookingManagePage 렌더링 - isLogined:", isLogined, "user:", user);

  // 현재 날짜로 초기화 (Day.js 사용)
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
  const [reservations, setReservations] = useState([]);
  const [todayStats, setTodayStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // companyId 상태 추가
  const [companyId, setCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);

  // 사용자 로그인 상태 확인 및 companyId 설정
  useEffect(() => {
    const initializeCompanyId = async () => {
      console.log("BookingManagePage - initializeCompanyId 실행");
      console.log("BookingManagePage - 사용자 정보:", { isLogined, user });
      console.log("BookingManagePage - user.companyId:", user?.companyId);

      if (!isLogined || !user) {
        console.log("로그인 정보 없음 - isLogined:", isLogined, "user:", user);
        setError("로그인이 필요합니다.");
        return;
      }

      try {
        console.log("getMyCompanies 호출 시작...");
        console.log("user.companyId 무시하고 강제로 API 호출");
        const myCompanies = await getMyCompanies();
        console.log("getMyCompanies 응답:", myCompanies);

        if (myCompanies && myCompanies.length > 0) {
          console.log(`전체 회사 목록:`, myCompanies.map(c => `ID=${c.id}, name=${c.name}`));

          // 회사 목록 저장
          setCompanies(myCompanies);

          // 첫 번째 회사를 기본 선택
          const selectedCompany = myCompanies[0];
          const actualCompanyId = selectedCompany.id;

          console.log(`기본 선택된 회사: ID=${actualCompanyId}, name=${selectedCompany.name}`);
          setCompanyId(actualCompanyId);
          console.log(`companyId 설정 완료: ${actualCompanyId}`);
        } else {
          console.warn("등록된 회사가 없습니다.");
          setError("등록된 회사가 없습니다. 회사를 먼저 등록해주세요.");
          return;
        }
      } catch (error) {
        console.error("회사 정보 조회 실패:", error);
        setError("회사 정보 조회에 실패했습니다. 페이지를 새로고침해주세요.");
        return;
      }

      setError(null);
    };

    initializeCompanyId();
  }, [isLogined, user]);

  // companyId가 설정되면 예약 데이터 조회
  useEffect(() => {
    console.log(`useEffect[companyId, selectedDate] 실행 - companyId: ${companyId}`);
    if (companyId) {
      console.log(`companyId=${companyId}로 예약 데이터 조회 시작`);
      fetchReservations();
      fetchTodayStats();
    } else {
      console.log(`companyId가 없어서 데이터 조회를 건너뜁니다.`);
    }
  }, [companyId, selectedDate]);

  const fetchReservations = async () => {
    console.log("fetchReservations 시작 - companyId:", companyId);

    // 토큰 상태 확인
    const token = localStorage.getItem('accessToken');
    console.log("현재 토큰 상태:", token ? `토큰 존재 (길이: ${token.length})` : '토큰 없음');

    if (!companyId) {
      console.warn("companyId가 없어서 예약 조회를 건너뜁니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("bookingService.getReservations 호출 중...");
      const data = await bookingService.getReservations(selectedDate, { ...user, companyId });
      setReservations(data);
      console.log(`${data.length}개의 예약을 불러왔습니다.`);

      // 데이터가 없는 경우 로그만 남김 (하드코딩된 시도 제거)
      if (data.length === 0) {
        console.log(`companyId=${companyId}에서 ${dayjs(selectedDate).format('YYYY-MM-DD')} 날짜에 예약이 없습니다.`);
      }
    } catch (error) {
      console.error("예약 데이터 로딩 실패:", error);

      // 401 에러인 경우 토큰 문제임을 명확히 표시
      if (error.response?.status === 401) {
        setError("인증이 만료되었습니다. 페이지를 새로고침하거나 다시 로그인해주세요.");
      } else {
        setError(error.message || "예약데이터를 불러오는데 실패하였습니다.");
      }
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  // 하드코딩된 tryOtherCompanyIds 함수 제거

  const fetchTodayStats = async () => {
    if (!companyId) return;

    try {
      const stats = await bookingService.getTodayStats({ ...user, companyId });
      setTodayStats(stats);
    } catch (error) {
      console.error("오늘의 예약 현황 로딩 실패:", error);
    }
  };

  const handleDateChange = (date) => {
    console.log("선택된 날짜:", dayjs(date).format("YYYY-MM-DD")); // 디버깅용
    setSelectedDate(date);
  };

  const handleReservationUpdate = async (reservationId, action) => {
    try {
      setError(null);
      await bookingService.updateReservationStatus(reservationId, action);

      // 예약 상태 업데이트
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: action }
            : reservation
        )
      );

      // 오늘 통계도 업데이트
      if (dayjs(selectedDate).isSame(dayjs(), "day")) {
        fetchTodayStats();
      }
    } catch (error) {
      console.error("예약 상태 업데이트 실패:", error);
    }
  };

  if (error) {
    return (
      <div className="booking-manage-page">
        <div className="error-message">
          <h2>⚠️ 오류 발생</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            페이지 새로고침
          </button>
        </div>
      </div>
    );
  }
  // Day.js를 사용한 날짜 포맷팅
  const getFormattedDate = () => {
    const selected = dayjs(selectedDate);
    const today = dayjs();

    if (selected.isSame(today, "day")) {
      return "오늘";
    } else if (selected.isSame(today.add(1, "day"), "day")) {
      return "내일";
    } else if (selected.isSame(today.subtract(1, "day"), "day")) {
      return "어제";
    } else {
      return selected.format("YYYY년 MM월 DD일 (dddd)");
    }
  };

  return (
    <div className="booking-manage-page">
      <div className="page-header">
        <h1 className="page-title">
          <FaCalendarAlt style={{ marginRight: "8px", color: "#E05353" }} />
          예약관리
        </h1>
        <p className="page-subtitle">고객의 예약 요청을 확인하고 관리하세요</p>
      </div>

      <div className="booking-content">
        <div className="sidebar">
          {/* 회사 선택 섹션 */}
          {companies.length >= 1 && (
            <div className="company-selector" style={{
              marginBottom: '20px',
              padding: '20px',
              background: '#fff',
              borderLeft: '6px solid #E05353',
              borderRadius: '12px',
              boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
              transition: 'all 0.2s'
            }}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
                <FaCalendarAlt style={{marginRight: '8px', color: '#E05353'}} />
                <label style={{fontWeight: '700', fontSize: '16px', color: '#E05353', margin: 0}}>
                  담당 업체 선택
                </label>
              </div>

              <select
                value={companyId || ''}
                onChange={(e) => {
                  const newCompanyId = parseInt(e.target.value);
                  const selectedCompany = companies.find(c => c.id === newCompanyId);
                  setCompanyId(newCompanyId);
                  console.log(`회사 변경: ${selectedCompany?.name} (ID: ${newCompanyId})`);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #f3f4f6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.borderColor = '#E05353';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#f3f4f6';
                }}
              >
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    🏢 {company.name}
                  </option>
                ))}
              </select>

              {/* 회사 개수 표시 */}
              <div style={{
                marginTop: '12px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#777777',
                fontWeight: '500'
              }}>
                총 {companies.length}개 업체 관리 중
              </div>
            </div>
          )}

          <CalendarPanel
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            todayStats={todayStats}
          />
        </div>

        <div className="main-content">
          <div className="date-header">
            <h2>
              {getFormattedDate()} 예약 목록
              {loading && <span className="loading-indicator">로딩 중...</span>}
            </h2>
            <div className="reservation-count">
              <FaListUl style={{ marginRight: "6px", color: "#e05353" }} />총{" "}
              {reservations.length}건의 예약
            </div>
          </div>

          <ReservationList
            reservations={reservations}
            onReservationUpdate={handleReservationUpdate}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingManagePage;
