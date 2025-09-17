import React from "react";
import { BookingProvider, useBooking } from "./BookingContext";
import ProductSelectPage from "../booking/ProductSelectPage";
import DateSelectPage from "../booking/DateSelectPage";
import "../booking/BookingPage.css";

const Header = ({ step }) => (
  <div class="booking-header-wrap">
    <div class="booking-header-container">
      <div class="booking-header-content">
        <div class="booking-header-left">
          <button class="booking-header-back-btn">←</button>
          <h1 class="booking-header-title">예약하기</h1>
        </div>
        <div class="booking-header-steps">
          <span class="booking-header-step is-active">메뉴선택</span>
          <span class="booking-header-arrow">→</span>
          <span class="booking-header-step">예약정보</span>
          <span class="booking-header-arrow">→</span>
          <span class="booking-header-step">결제</span>
          <span class="booking-header-arrow">→</span>
          <span class="booking-header-step">완료</span>
        </div>
      </div>
    </div>
  </div>
);

const BookingContent = () => {
  const { state } = useBooking();

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <ProductSelectPage />;
      case 2:
        return <DateSelectPage />;
      //   case 3:
      //     return <BookingConfirmPage />;
      //   case 4:
      //     return <BookingCompletePage />;
      default:
        return <ProductSelectPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header step={state.step} />
      {renderStep()}
    </div>
  );
};

const BookingPage = () => {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  );
};

export default BookingPage;
