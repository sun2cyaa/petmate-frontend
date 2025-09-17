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
  const [bookingData, setBookingData] = useState(null);

  // 백엔드 API 기본 URL
  const API_BASE_URL = "http://localhost:8090/api/payment";

  useEffect(() => {
    // 예약데이터 불러오기
    const savedBookingData = sessionStorage.getItem("bookingData");
    if (savedBookingData) {
      setBookingData(JSON.parse(savedBookingData));
    }
  }, []);

  // 백엔드 콜백 URL로 변경 (중요!)
  // const baseParams = {
  //   orderName: "test_상품",
  //   amount: 100,
  //   merchantId: "9810030930",
  //   orderId: new Date().getTime().toString(),
  //   userId: "user@naver.com",
  //   // 백엔드 콜백 URL로 변경
  //   successUrl: "http://localhost:8090/api/payment/danal/success",
  //   failUrl: "http://localhost:8090/api/payment/danal/fail",
  //   userEmail: "user@naver.com",
  // };
  const baseParams = {
    orderName: bookingData?.selectedProduct?.name || "펫케어 서비스",
    amount: bookingData?.totalAmount || 100,
    merchantId: "9810030930",
    orderId: new Date().getTime().toString(),
    userId: "user@naver.com",
    // 백엔드 콜백 URL로 변경
    successUrl: "http://localhost:8090/api/payment/danal/success",
    failUrl: "http://localhost:8090/api/payment/danal/fail",
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
        console.log("다날 SDK 초기화 완료");
      } catch (error) {
        console.error("다날 SDK 초기화 실패:", error);
        alert("결제 시스템 초기화에 실패했습니다.");
      }
    };

    initializeDanalSDK();
  }, []);

  // 백엔드에 결제 요청 전송
  const sendPaymentRequestToBackend = async (paymentData) => {
    try {
      console.log("백엔드에 결제 정보 저장 요청:", paymentData);

      const response = await fetch(`${API_BASE_URL}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: bookingData?.reservationId || 1, // 실제 예약 ID로 변경 필요
          provider: "DANAL", // 다날 문자열로 변경
          amount: paymentData.amount,
          currency: "KRW",
          paymentMethod: paymentData.paymentsMethod,
          customerName: bookingData?.customerName || "고객명", // 실제 고객명으로 변경 필요
          customerEmail: paymentData.userEmail,
          customerPhone: bookingData?.customerPhone || "010-0000-0000", // 실제 고객 전화번호로 변경 필요
          // 예약 관련 추가 정보
          storeId: bookingData?.selectedStore?.id,
          productId: bookingData?.selectedProduct?.id,
          selectedDate: bookingData?.selectedDate,
          selectedTimeSlot: bookingData?.selectedTimeSlot,
          selectedPets: bookingData?.selectedPets,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("백엔드 응답:", result);
      return result;
    } catch (error) {
      console.error("백엔드 통신 오류:", error);
      throw error;
    }
  };

  const requestPayment = () => {
    if (!danalPayments) {
      alert("결제 시스템이 준비되지 않았습니다.");
      return Promise.reject(new Error("결제 시스템이 준비되지 않았습니다."));
    }

    let paymentPromise;

    switch (selectedPayMethod) {
      case "INTEGRATED":
        paymentPromise = danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
          methods: {
            mobile: { itemCode: "1270000000", itemType: "1" },
            virtualAccount: { notiUrl: "https://notiUrl.com" },
            card: {},
            naverPay: {},
            kakaoPay: {},
            payco: {},
            cultureland: {},
            bookAndLife: {},
          },
        });
        break;

      case "CARD":
        paymentPromise = danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
        });
        break;
      case "MOBILE":
        paymentPromise = danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
          itemCode: "1270000000",
          itemType: "1",
        });
        break;
      case "TRANSFER":
        paymentPromise = danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
        });
        break;
      case "VACCOUNT":
        paymentPromise = danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
          notiUrl: "https://notiUrl.com",
        });
        break;
      case "PAYCO":
      case "KAKAOPAY":
      case "NAVERPAY":
        paymentPromise = danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
          installmentMonths: ["00"],
        });
        break;
      case "CULTURELAND":
      case "BOOK_AND_LIFE":
        paymentPromise = danalPayments.requestPayment({
          ...baseParams,
          paymentsMethod: selectedPayMethod,
        });
        break;
      default:
        return Promise.reject(new Error("결제 방법을 선택해주세요."));
    }

    return paymentPromise
      .then((result) => {
        console.log("다날 SDK 결제 요청 결과:", result);

        // 다날 SDK가 결제창을 열었으므로, 이후 처리는 백엔드 콜백에서 처리됨
        console.log(
          "결제창이 정상적으로 열렸습니다. 결제 결과는 콜백으로 처리됩니다."
        );

        return result;
      })
      .catch((error) => {
        console.error("결제 요청 실패:", error);

        // 결제창 자체를 열지 못했거나, 사용자가 취소한 경우
        if (error.code === "USER_CANCEL") {
          console.log("사용자에 의한 결제 취소");
          // 사용자가 취소한 경우 실패 페이지로 이동하지 않고 현재 페이지 유지
          alert("결제가 취소되었습니다.");
          return null;
        } else if (error.code === "WINDOW_CLOSED") {
          console.log("결제창이 닫힘");
          alert("결제창이 닫혔습니다.");
          return null;
        } else {
          console.log("결제 요청 실패");
          alert("결제 요청에 실패했습니다.");
          throw error;
        }
      });
  };

  const handlePayment = async () => {
    if (!selectedPayMethod) {
      alert("결제 방법을 선택해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. 먼저 백엔드에 결제 요청 정보 전송
      const paymentData = {
        ...baseParams,
        paymentsMethod: selectedPayMethod,
      };

      console.log("백엔드에 결제 요청 전송:", paymentData);
      const backendResponse = await sendPaymentRequestToBackend(paymentData);

      if (!backendResponse || !backendResponse.success) {
        throw new Error("백엔드 결제 요청 실패");
      }

      console.log("백엔드 결제 요청 성공, 다날 결제창 호출");

      // 2. 다날 결제창 호출
      const paymentResult = await requestPayment();

      // 사용자가 취소한 경우 처리
      if (paymentResult === null) {
        return; // 로딩 해제만 하고 페이지 유지
      }

      // 결제창이 정상적으로 열렸다면, 결과는 백엔드 콜백에서 처리됨
      console.log(
        "결제 프로세스가 시작되었습니다. 결과는 콜백으로 처리됩니다."
      );
    } catch (err) {
      console.error("결제 처리 오류:", err);

      // 백엔드 오류와 결제 오류 구분
      if (err.message.includes("백엔드")) {
        alert("결제 정보 저장에 실패했습니다.");
      } else {
        alert("결제 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayMethodSelect = (payMethod) => {
    setSelectedPayMethod(payMethod);
  };

  // Mock 테스트를 위한 함수 추가
  const handleMockPayment = async (isSuccess = true) => {
    if (!selectedPayMethod) {
      alert("결제 방법을 선택해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. 백엔드에 결제 요청 정보 전송
      const paymentData = {
        ...baseParams,
        paymentsMethod: selectedPayMethod,
      };

      console.log("Mock 결제 - 백엔드에 결제 요청 전송:", paymentData);
      const backendResponse = await sendPaymentRequestToBackend(paymentData);

      if (!backendResponse || !backendResponse.success) {
        throw new Error("백엔드 결제 요청 실패");
      }

      console.log("Mock 결제 - 백엔드 결제 요청 성공");

      // 2. Mock 결제 결과 처리
      setTimeout(() => {
        if (isSuccess) {
          // 성공 시 백엔드 콜백 URL 시뮬레이션
          const successUrl = `http://localhost:3000/payment/success?orderId=${
            baseParams.orderId
          }&transactionId=MOCK_TX_${Date.now()}&amount=${baseParams.amount}`;
          window.location.href = successUrl;
        } else {
          // 실패 시 백엔드 콜백 URL 시뮬레이션
          const failUrl = `http://localhost:3000/payment/fail?orderId=${baseParams.orderId}&errorCode=MOCK_ERROR&errorMessage=Mock%20payment%20failed`;
          window.location.href = failUrl;
        }
      }, 2000); // 2초 후 결과 처리
    } catch (err) {
      console.error("Mock 결제 처리 오류:", err);
      alert("Mock 결제 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
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
