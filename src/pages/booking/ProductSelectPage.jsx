import React, { useContext, useState } from "react";
import "../booking/BookingPage.css";
import BookingContext from "./BookingContext";

const CompanyInfoCard = ({ company }) => {
  return (
    <div className="company-wrap">
      <div className="">
        <img src="" alt="" />
        <div className="">
          <h2>{company.name}</h2>
          <div className="">
            <div className="">
              ⭐️
              <span>{company.rating}</span>
            </div>
            <span>리뷰 : {company.reviewCount.toLocaleString()}</span>
          </div>
          <p>{company.address}</p>
          <div className="">
            <button>☎️ 전화</button>
            <button>🔍️ 문의</button>
            <button>♥️</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductSelectPage = () => {
  const { state, dispatch } = useContext(BookingContext);

  const serviceTypes = [
    { id: "돌봄", name: "돌봄", icon: "🏠" },
    { id: "산책", name: "산책", icon: "🚶" },
    { id: "미용", name: "미용", icon: "✂️" },
    { id: "병원", name: "병원", icon: "🏥" },
    { id: "기타", name: "기타", icon: "📝" },
  ];

  const products = {
    돌봄: [
      {
        id: 1,
        name: "프리미엄 종일 돌봄",
        price: 80000,
        originalPrice: 100000,
        description: "24시간 전문 케어, 실시간 사진 전송",
        duration: "8시간",
        popular: true,
        options: ["산책 포함", "간식 제공", "실시간 알림"],
      },
      {
        id: 2,
        name: "기본 돌봄 서비스",
        price: 50000,
        description: "안전한 환경에서 기본 돌봄 서비스 제공",
        duration: "4시간",
        options: ["기본 돌봄", "안전 관리"],
      },
    ],
    산책: [
      {
        id: 3,
        name: "프리미엄 산책 코스",
        price: 35000,
        description: "전문 펫시터와 함께하는 맞춤형 산책",
        duration: "1시간",
        popular: true,
        options: ["전문 펫시터", "사진 서비스", "건강 체크"],
      },
      {
        id: 4,
        name: "기본 산책",
        price: 20000,
        description: "30분간 안전한 근처 공원 산책",
        duration: "30분",
        options: ["기본 산책", "안전 관리"],
      },
    ],
    미용: [
      {
        id: 5,
        name: "스페셜 스타일링",
        price: 120000,
        originalPrice: 150000,
        description: "프리미엄 미용 + 스타일링 + 네일아트",
        duration: "3시간",
        popular: true,
        options: ["풀 그루밍", "스타일링", "네일아트", "향수"],
      },
      {
        id: 6,
        name: "기본 미용",
        price: 60000,
        description: "목욕, 드라이, 기본 커트",
        duration: "1.5시간",
        options: ["목욕", "드라이", "기본 커트"],
      },
    ],
  };

  return (
    <div className="productSelect-wrap">
      <CompanyInfoCard company={state.selectedStore} />

      {/* 서비스 카테고리*/}
      <div className="service-category">
        <div className="">
          {serviceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() =>
                dispatch({ type: "SELECT_SERVICE", payload: type.id })
              }
              className={`service-type-btn ${
                state.selectedService === type.id ? "active" : ""
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="products-wrap">
        {products[state.selectedService]?.map((product) => (
          <div
            key={product.id}
            onClick={() =>
              dispatch({ type: "SELECT_PRODUCT", payload: product })
            }
            className={`product-card ${
              state.selectedProduct?.id === product.id
                ? "product-card--selected"
                : ""
            }`}
          >
            <div className="product-card__content">
              <div className="product-card__info">
                <div className="product-card__title-row">
                  <h3 className="product-card__name">{product.name}</h3>
                  {product.popular && (
                    <span className="product-card__badge">인기</span>
                  )}
                </div>
                <p className="product-card__description">
                  {product.description}
                </p>
                <div className="product-card__options">
                  {product.options.map((option) => (
                    <span key={option} className="product-card__option">
                      {option}
                    </span>
                  ))}
                </div>
                <div className="product-card__price-row">
                  {product.originalPrice && (
                    <span className="product-card__original">
                      {product.originalPrice.toLocaleString()}원
                    </span>
                  )}
                  <span className="product-card__price">
                    {product.price.toLocaleString()}원
                  </span>
                  <span className="product-card__duration">
                    / {product.duration}
                  </span>
                </div>
              </div>
              {state.selectedProduct?.id === product.id && (
                <div className="product-card__check">
                  <div className="product-card__check-circle">✅️</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 고정 버튼 (모달용) */}
      <div className="bottom-bar">
        <button
          onClick={() =>
            state.selectedProduct && dispatch({ type: "SET_STEP", payload: 2 })
          }
          disabled={!state.selectedProduct}
          className="bottom-bar__button"
        >
          {state.selectedProduct
            ? `${state.selectedProduct.price.toLocaleString()}원 - 예약 정보 입력하기`
            : "메뉴를 선택해주세요"}
        </button>
      </div>
    </div>
  );
};

export default ProductSelectPage;
