import React, { useEffect, useReducer, useState } from "react";
import ProductSelectPage from "../booking/ProductSelectPage";
import DateSelectPage from "../booking/DateSelectPage";
import "../booking/BookingPage.css";
import BookingConfirmPage from "./BookingConfirmPage";
import BookingCompletePage from "./BookingCompletePage";
import BookingContext from "./BookingContext";
import { useSearchParams } from "react-router-dom";

// 예약상태관리
const initialState = {
  step: 1,
  selectedService: "돌봄",
  selectedProduct: null,
  selectedPets: [],
  selectedDate: null,
  selectedTimeSlot: null,
  peopleCount: 1,
  specialRequests: "",
  reservationStatus: "pending",
  selectedStore: {
    id: 1,
    name: "해피펫 케어센터",
    rating: 4.8,
    reviewCount: 1234,
    address: "서울시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    image: "/api/placeholder/300/200",
  },
};

const reservationReducer = (state, action) => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SELECT_SERVICE":
      return {
        ...state,
        selectedService: action.payload,
        selectedProduct: null,
      };
    case "SELECT_PRODUCT":
      return { ...state, selectedProduct: action.payload };
    case "TOGGLE_PET":
      const petId = action.payload;
      const newSelectedPets = state.selectedPets.includes(petId)
        ? state.selectedPets.filter((id) => id !== petId)
        : [...state.selectedPets, petId];
      return { ...state, selectedPets: newSelectedPets };
    case "SELECT_DATE":
      return { ...state, selectedDate: action.payload };
    case "SELECT_TIME_SLOT":
      return { ...state, selectedTimeSlot: action.payload };
    case "SET_PEOPLE_COUNT":
      return { ...state, peopleCount: action.payload };
    case "SET_SPECIAL_REQUESTS":
      return { ...state, specialRequests: action.payload };
    default:
      return state;
  }
};

const Header = ({ step, onClose }) => (
  <div className="booking-header-wrap">
    <div className="booking-header-container">
      <div className="booking-header-content">
        <div className="booking-header-left">
          <button className="booking-header-close" onClick={onClose}>
            ✖️
          </button>
          <h1 className="booking-header-title">예약하기</h1>
        </div>
        <div className="booking-header-steps">
          <span
            className={`booking-header-step ${step >= 1 ? "is-active" : ""}`}
          >
            메뉴선택
          </span>
          <span className="booking-header-arrow">→</span>
          <span
            className={`booking-header-step ${step >= 2 ? "is-active" : ""}`}
          >
            예약정보
          </span>
          <span className="booking-header-arrow">→</span>
          <span
            className={`booking-header-step ${step >= 3 ? "is-active" : ""}`}
          >
            결제
          </span>
          <span className="booking-header-arrow">→</span>
          <span
            className={`booking-header-step ${step >= 4 ? "is-active" : ""}`}
          >
            완료
          </span>
        </div>
      </div>
    </div>
  </div>
);

const BookingContent = ({ isOpen, onClose }) => {
  const [state, dispatch] = useReducer(reservationReducer, initialState);
  const [searchParams] = useSearchParams();

  // 결제완료 감지
  useEffect(() => {
    const completed = searchParams.get("completed");
    if (completed === "true") {
      // 예약 단계이동 및 url
      dispatch({ type: "SET_STEP", payload: 4 });
      window.history.replaceState({}, "", "/booking");
    }
  }, [searchParams]);

  if (!isOpen) return null;

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <ProductSelectPage />;
      case 2:
        return <DateSelectPage />;
      case 3:
        return <BookingConfirmPage />;
      case 4:
        return <BookingCompletePage />;
      default:
        return <ProductSelectPage />;
    }
  };

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {/* 모달 오버레이 */}
      <div className="modal-overlay">
        <div className="modal-container">
          <Header step={state.step} onClose={onClose} />
          <div className="modal-body">
            <div className="modal-content">{renderStep()}</div>
          </div>
        </div>
      </div>
    </BookingContext.Provider>
  );
};

const BookingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="booking-wrap">
      {/* 헤더 */}
      <div className="reservation-header">
        <h2 className="reservation-title">펫케어 서비스 예약</h2>
        <p className="reservation-subtitle">
          전문적인 펫케어 서비스를 간편하게 예약하세요
        </p>
        <button className="reservation-button" onClick={() => setIsOpen(true)}>
          지금 예약하기
        </button>
      </div>
      {/* 예약 모달 */}
      <BookingContent isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default BookingPage;
