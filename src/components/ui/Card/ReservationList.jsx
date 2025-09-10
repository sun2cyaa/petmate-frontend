import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationList({ reservations, onReservationUpdate, loading }) {
  if (loading) {
    return <div className="loading-reservation">예약 정보를 불러오는 중...</div>;
  }

  if (!reservations || reservations.length === 0) {
    return (
      <div className="empty-reservation">
        <p>선택한 날짜에 예약이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="reservation-list">
      {reservations.map((res) => (
        <ReservationCard
          key={res.id}
          reservation={res}
          onUpdate={onReservationUpdate}
        />
      ))}
    </div>
  );
}

export default ReservationList;
