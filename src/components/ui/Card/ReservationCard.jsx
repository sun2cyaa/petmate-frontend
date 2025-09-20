import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import logo from "../../../assets/images/petmate_logo.png";

// react-icons
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaCheck,
  FaTimes,
  FaCommentDots,
} from "react-icons/fa";

// Day.js 플러그인 및 로케일 설정
dayjs.extend(relativeTime);
dayjs.locale("ko");

const ReservationCard = ({ reservation, onUpdate }) => {
  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        text: "승인 대기",
        className: "status-pending",
        icon: <FaClock style={{ marginRight: "4px" }} />,
      },
      approved: {
        text: "예약 확정",
        className: "status-approved",
        icon: <FaCheckCircle style={{ marginRight: "4px" }} />,
      },
      completed: {
        text: "서비스 완료",
        className: "status-completed",
        icon: <FaCheckCircle style={{ marginRight: "4px" }} />,
      },
      cancelled: {
        text: "취소됨",
        className: "status-cancelled",
        icon: <FaTimesCircle style={{ marginRight: "4px" }} />,
      },
      // 레거시 지원
      rejected: {
        text: "거절",
        className: "status-cancelled",
        icon: <FaTimesCircle style={{ marginRight: "4px" }} />,
      },
    };
    return badges[status] || { text: status, className: "status-default", icon: null };
  };

  const handleDetail = () => {
    onUpdate(reservation.id, "approved");
  };

  const handleApprove = () => {
    onUpdate(reservation.id, "approved");
  };

  const handleReject = () => {
    onUpdate(reservation.id, "cancelled");
  };


  const statusBadge = getStatusBadge(reservation.status);

  // Day.js를 사용한 시간 포맷팅
  const formatTime = (time) => {
    const today = dayjs().format("YYYY-MM-DD");
    return dayjs(`${today} ${time}`).format("A h:mm");
  };

  const getTimeRange = () => {
    if (reservation.startTimeFormatted && reservation.endTimeFormatted) {
      return `${reservation.startTimeFormatted} - ${reservation.endTimeFormatted}`;
    } else {
      return `${formatTime(reservation.startTime)} - ${formatTime(
        reservation.endTime
      )}`;
    }
  };

  // 예약 생성 시간을 상대적으로 표시
  const getCreatedTime = () => {
    if (reservation.createdAtRelative) {
      return reservation.createdAtRelative;
    } else if (reservation.createdAt) {
      return dayjs(reservation.createdAt).fromNow();
    }
    return "";
  };

  return (
    <div className="reservation-card">
      <div className="card-header">
        <div className="user-info">
          <div className="user-avatar">
            <img
              src={reservation.userAvatar || logo}
              alt={`${reservation.userName} 프로필`}
              onError={(e) => {
                e.target.src = logo;
              }}
            />
          </div>
          <div className="user-details">
            <h4 className="user-name">{reservation.userName}</h4>
            <p className="user-location">{reservation.userLocation}</p>
            {getCreatedTime() && (
              <p className="created-time">{getCreatedTime()} 예약</p>
            )}
          </div>
        </div>
        <div className={`status-badge ${statusBadge.className}`}>
          {statusBadge.icon}
          {statusBadge.text}
        </div>
      </div>

      <div className="card-content">
        <div className="service-info">
          <div className="info-row">
            <span className="label">서비스</span>
            <span className="value">{reservation.serviceName}</span>
          </div>
          <div className="info-row">
            <span className="label">반려동물</span>
            <span className="value">{reservation.petInfo}</span>
          </div>
          <div className="info-row">
            <span className="label">예약 시간</span>
            <span className="value time">
              <FaClock style={{ marginRight: "4px" }} />
              {getTimeRange()}
            </span>
          </div>
          <div className="info-row">
            <span className="label">총 가격</span>
            <span className="value price">
              {reservation.price?.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      <div className="card-actions">
        {reservation.status === "pending" && (
          <>
            <button className="btn-details" onClick={handleDetail}>
              <FaSearch /> 상세
            </button>
            <button className="btn-approve" onClick={handleApprove}>
              <FaCheck /> 승인
            </button>
            <button className="btn-reject" onClick={handleReject}>
              <FaTimes /> 거절
            </button>
          </>
        )}
        <button className="btn-message">
          <FaCommentDots /> 문의
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;
