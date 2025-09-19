import { apiRequest } from './../api';

// 결제 요청 
export const createPaymentRequest = async (paymentData) => {
    try {
        const response = await apiRequest.post("/api/payment/process", paymentData);
        return response.data;
    } catch(error) {
        console.error('결제 요청 생성 실패: ', error);
        throw error;
    }
}

// 예약 정보 조회(결제에 필요한 정보)
export const getBookingForPayment = async (bookingId) => {
    try {
        // 결제용 전용 엔드포인트 사용
        const response = await apiRequest.get(`/api/booking/payment/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error('예약 정보 조회 실패: ', error);
        throw error;
    }
} 

// 결제 상태 조회
export const getPaymentStatus = async (paymentId) => {
    try {
        const response = await apiRequest.get(`/api/payment/${paymentId}`);
        return response.data;
    } catch(error) {
        console.error('결제 상태 조회 실패: ', error);
        throw error;
    }
}
