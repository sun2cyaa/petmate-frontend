import { apiRequest } from './../api';

// 시간 포맷팅 함수 추가
    const formatTimeForDisplay = (timeValue) => {
        if (!timeValue) return '';

        // LocalTime 형식 (09:00:00)을 HH:MM 형식으로 변환
        if (typeof timeValue === 'string' && timeValue.includes(':')) {
            return timeValue.substring(0, 5); // "09:00:00" → "09:00"
        }

        return timeValue.toString();
    };
    
// 상품별 예약 가능 시간 슬롯 조회
export const getAvailableTimeSlots = async (productId, date) => {


    try {
        // 날짜 형식 검증 (YYYY-MM-DD)
        if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)');
        }

        if (!productId || productId <= 0) {
        throw new Error('올바르지 않은 상품 ID입니다.');
        }

        const response = await apiRequest.get(`/api/products/${productId}/available-slots`, {
        params: { date }
        });

        // 백엔드 응답을 프론트엔드 형식으로 변환
        const transformedData = (response.data || []).map(slot => {
            console.log("변환 전 슬롯:", slot); // 디버깅용

            const transformed = {
                startTime: formatTimeForDisplay(slot.startTime),
                endTime: formatTimeForDisplay(slot.endTime),
                available: slot.isAvailable !== undefined ? slot.isAvailable : slot.available
            };

            console.log("변환 후 슬롯:", transformed); // 디버깅용
            return transformed;
        });

        console.log("최종 변환 데이터:", transformedData); // 디버깅용
        return transformedData;



    } catch (error) {
        console.error('시간 슬롯 조회 실패:', error);
        // 에러 발생 시 빈 배열 반환하여 UI가 깨지지 않도록 함
        return [];
    }
};

// 시간 슬롯 새로고침
export const refreshTimeSlots = async (productId, date) => {
    try {
        const response = await apiRequest.post(`/api/products/${productId}/refresh-slots`, null, {
        params: { date }
        });

        return response.data || [];
    } catch (error) {
        console.error('시간 슬롯 새로고침 실패:', error);
        return [];
    }
};

// 날짜 형식 유틸리티 함수
export const formatDateForAPI = (date) => {
   if (date instanceof Date) {
          // 시간대 문제 해결: 로컬 시간 기준으로 YYYY-MM-DD 포맷
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
      }
      if (typeof date === 'string') {
          return date.split('T')[0]; // 이미 ISO 문자열인 경우 날짜 부분만 추출
      }
      return date;
};

// 현재 날짜 이후인지 확인
export const isValidFutureDate = (date) => {
    const targetDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return targetDate >= today;
};

// LocalDateTime 형식으로 변환 (백엔드 요구사항)
export const formatToLocalDateTime = (date, time) => {
    if (!date || !time) return null;

    // date: "2024-01-15", time: "09:00"
    return `${date}T${time}:00`; // "2024-01-15T09:00:00"
};

// 시간 슬롯 응답 데이터 파싱
export const parseTimeSlotResponse = (timeSlots) => {
    if (!Array.isArray(timeSlots)) return [];

    return timeSlots.map(slot => ({
        ...slot,
        available: slot.available !== false, // 기본값 true
        formattedTime: formatTimeRange(slot.startTime, slot.endTime)
    }));
};

// 시간 범위 포맷팅 (예: "09:00 - 18:00")
const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    return `${startTime} - ${endTime}`;
};

// 날짜와 시간을 합쳐서 LocalDateTime 형식으로 만들기
export const combineDateTime = (dateStr, timeStr) => {
if (!dateStr || !timeStr) return null;

// dateStr: "2024-01-15", timeStr: "09:00" 또는 "09:00:00"
const time = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
return `${dateStr}T${time}`;
};

// 예약 데이터 검증
export const validateBookingData = (bookingData) => {
    const errors = [];

    if (!bookingData.ownerUserId) {
        errors.push('반려인 ID는 필수입니다.');
    }

    if (!bookingData.companyId) {
        errors.push('업체 ID는 필수입니다.');
    }

    if (!bookingData.productId) {
        errors.push('상품 ID는 필수입니다.');
    }

    if (!bookingData.startDt) {
        errors.push('시작일시는 필수입니다.');
    }

    if (!bookingData.endDt) {
        errors.push('종료일시는 필수입니다.');
    }

    if (bookingData.petCount < 1 || bookingData.petCount > 10) {
        errors.push('펫 마리수는 1~10 사이여야 합니다.');
    }

    if (bookingData.totalPrice < 0) {
        errors.push('총 금액은 0 이상이어야 합니다.');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};