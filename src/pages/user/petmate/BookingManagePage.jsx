import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import CalendarPanel from "../../../components/ui/Calendar/CalendarPanel";
import ReservationList from "../../../components/ui/Card/ReservationList";
import { bookingService } from "../../../services/booking/bookingServiceEx";
import "../../../styles/user.css";
import "../../../styles/reservation.css";
import { useAuth } from "./../../../contexts/AuthContext";

// 아이콘 추가
import { FaCalendarAlt, FaListUl } from "react-icons/fa";

// Day.js 한국어 로케일 설정
dayjs.locale("ko");

const BookingManagePage = () => {
  const { user, isLogined } = useAuth();
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

  // 사용자 로그인 상태 확인
  useEffect(() => {
    if (!isLogined || !user) {
      setError("로그인이 필요합니다.");
      return;
    }

    if (!user.companyId) {
      setError("업체 정보가 없습니다. 등록하세요");
      return;
    }

    setError(null);
    fetchReservations();
    fetchTodayStats();
  }, [selectedDate, isLogined, user]);

  const fetchReservations = async () => {
    if (!user?.companyId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await bookingService.getReservations(selectedDate, user);
      setReservations(data);
      console.log(`${data.length}개의 예약을 불러왔습니다.`);
    } catch (error) {
      console.error("예약 데이터 로딩 실패:", error);
      setError(error.message || "예약데이터를 불러오는데 실패하였습니다.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayStats = async () => {
    if (!user?.companyId) return;

    try {
      const stats = await bookingService.getTodayStats(user);
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
