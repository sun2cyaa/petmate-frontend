import React, { useState, useEffect } from "react";
import { loadDanalPaymentsSDK } from "@danalpay/javascript-sdk";
import "./PaymentPage.css"; // CSS 파일 import
import iconIntegrated from "../../assets/images/payment/icon_integrated.png";
import payKakaopay from "../../assets/images/payment/pay_kakaopay.webp";
import payNpay from "../../assets/images/payment/pay_npay.webp";
import payPayco from "../../assets/images/payment/pay_payco.webp";

const PaymentPage = () => {
  const [selectedPayMethod, setSelectedPayMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [danalPayments, setDanalPayments] = useState(null);

  const baseParams = {
    orderName: "test_상품",
    amount: 100,
    merchantId: "9810030930",
    orderId: new Date().getTime().toString(),
    userId: "user@naver.com",
    successUrl: "http://localhost:3000/payment/success", // 실제 서비스 도메인으로 변경 필요
    failUrl: "http://localhost:3000/payment/fail", // 실제 서비스 도메인으로 변경 필요
    userEmail: "user@naver.com",
  };

  // SDK 초기화
  useEffect(() => {
    const initializeDanalSDK = async () => {
      try {
        const payments = await loadDanalPaymentsSDK({
          clientKey: "CL_TEST_I4d8FWYSSKl-42F7y3o9g_7iexSCyHbL8qthpZxPnpY=",
        });
        setDanalPayments(payments);
      } catch (error) {
        console.error("다날 SDK 초기화 실패:", error);
        alert("결제 시스템 초기화에 실패했습니다.");
      }
    };

    initializeDanalSDK();
  }, []);

  const requestPayment = () => {
    if (!danalPayments) {
      alert("결제 시스템이 준비되지 않았습니다.");
      return;
    }

    switch (selectedPayMethod) {
      case "INTEGRATED":
        return danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
          methods: {
            mobile: {
              itemCode: "1270000000",
              itemType: "1",
            },
            virtualAccount: {
              notiUrl: "https://notiUrl.com",
            },
            card: {},
            naverPay: {},
            kakaoPay: {},
            payco: {},
            transfer: {},
            cultureland: {},
            bookAndLife: {},
          },
        });
      case "CARD":
        return danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
        });
      case "MOBILE":
        return danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
          itemCode: "1270000000",
          itemType: "1",
        });
      case "TRANSFER":
        return danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
        });
      case "VACCOUNT":
        return danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
          notiUrl: "https://notiUrl.com",
        });
      case "PAYCO":
      case "KAKAOPAY":
      case "NAVERPAY":
        return danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
          installmentMonths: ["00"],
        });
      case "CULTURELAND":
      case "BOOK_AND_LIFE":
        return danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
        });
      default:
        throw new Error("결제 방법을 선택해주세요.");
    }
  };

  const handlePayment = async () => {
    if (!selectedPayMethod) {
      alert("결제 방법을 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await requestPayment();
    } catch (err) {
      alert("오류가 발생했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayMethodSelect = (payMethod) => {
    setSelectedPayMethod(payMethod);
  };

  const paymentMethods = [
    {
      value: "INTEGRATED",
      label: "다날 통합결제창",
      icon: (
        <img
          src={iconIntegrated}
          style={{ width: "25px", aspectRatio: "auto 3/4" }}
          alt="통합결제"
        />
      ),
      gridColumn: "span 3",
    },
    { value: "CARD", label: "카드결제", icon: "💳" },
    { value: "MOBILE", label: "휴대폰결제", icon: "📱" },
    {
      value: "NAVERPAY",
      label: "네이버페이",
      icon: <img src={payNpay} style={{ width: "75px" }} alt="네이버페이" />,
    },
    {
      value: "KAKAOPAY",
      label: "카카오페이",
      icon: (
        <img src={payKakaopay} style={{ width: "75px" }} alt="카카오페이" />
      ),
    },
    {
      value: "PAYCO",
      label: "페이코",
      icon: <img src={payPayco} style={{ width: "75px" }} alt="페이코" />,
    },
    { value: "VACCOUNT", label: "가상계좌", icon: "🔢" },
    { value: "TRANSFER", label: "계좌이체", icon: "🏦" },
    { value: "BOOK_AND_LIFE", label: "도서문화상품권", icon: "📖" },
    { value: "CULTURELAND", label: "컬쳐랜드상품권", icon: "📖" },
  ];

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>결제 수단 선택</h1>
        <p>원하시는 결제 수단을 선택해 주세요.</p>
      </div>

      <div className="payment-info">
        <div className="payment-info-title">결제 안내</div>
        <div className="payment-info-text">
          안전한 결제를 위해 고객님의 정보는 암호화되어 처리됩니다.
        </div>
      </div>

      <div className="payment-methods-grid">
        {paymentMethods.map((method) => (
          <div
            key={method.value}
            className={`payment-method-button ${
              selectedPayMethod === method.value ? "selected" : ""
            }`}
            style={method.gridColumn ? { gridColumn: method.gridColumn } : {}}
            onClick={() => handlePayMethodSelect(method.value)}
          >
            <input
              type="radio"
              id={method.value}
              name="payment-method"
              value={method.value}
              checked={selectedPayMethod === method.value}
              onChange={() => handlePayMethodSelect(method.value)}
              style={{ display: "none" }}
            />
            <div className="selected-indicator"></div>
            <div className="payment-method-icon">
              {typeof method.icon === "string" ? method.icon : method.icon}
            </div>
            <div className="payment-method-name">{method.label}</div>
          </div>
        ))}
      </div>

      <div className="payment-button-container">
        <button
          className="payment-button"
          id="payButton"
          onClick={handlePayment}
          disabled={isLoading || !selectedPayMethod}
        >
          {isLoading ? "결제 진행중..." : "결제하기"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
