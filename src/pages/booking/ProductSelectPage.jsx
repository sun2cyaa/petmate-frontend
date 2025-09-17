import React, { useState } from "react";
import { useBooking } from "../booking/BookingContext";
import "../booking/BookingPage.css";

const ProductSelectPage = () => {
  const { state, dispatch, nextStep } = useBooking();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    dispatch({ type: "SELECT_PRODUCT", payload: product });
  };

  const handleNext = () => {
    if (selectedProduct) {
      nextStep();
    } else {
      alert("메뉴를 선택해주세요.");
    }
  };

  const products = [
    {
      id: 1,
      name: "프리미엄 돌봄",
      description: "전문케어, 실시간 사진전송",
      price: 80000,
      duration: "8시간",
    },
    // 더 많은 상품들...
  ];

  return (
    <div className="storePage-wrap">
      {/* 기존 StoreInfoCard */}

      {/* 메뉴 목록 */}
      <div className="menuList-wrap">
        {products.map((product) => (
          <div
            key={product.id}
            className={`menuItem-wrap ${
              selectedProduct?.id === product.id ? "selected" : ""
            }`}
            onClick={() => handleProductSelect(product)}
          >
            <div className="menuItem-header">
              <h3 className="menuItem-title">{product.name}</h3>
            </div>
            <p className="menuItem-description">{product.description}</p>
            <div className="menuItem-price">
              <span className="menuItem-price-value">
                {product.price.toLocaleString()}원
              </span>
              <span className="menuItem-price-duration">
                / {product.duration}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixedBottom-wrap">
        <button
          className="fixedBottom-btn"
          onClick={handleNext}
          disabled={!selectedProduct}
        >
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default ProductSelectPage;
