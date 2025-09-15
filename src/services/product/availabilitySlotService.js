import { apiRequest } from "../api";

// 예약가능 조회
export const getAvailableSlots = async (productId, date) => {
    try {
        const response = await apiRequest.get('api/availabilityslot/available' , {
            params: {productId, date}
        });
        return response.data;

    } catch(error) {
        console.error("슬롯 조회 실패!:", error);
        throw error;
    }
};

// 기존 대량 슬롯 생성 함수
export const createProductSlots = async (productId, companyId, slotData ) => {
    try {
        const response = await apiRequest.post('/api/availabilityslot/bulk' , {
            companyId,
            productId,
            startDate: slotData.startDate,
            endDate: slotData.endDate,
            timeSlots: slotData.timeSlots,
            capacity: slotData.capacity
        });
        return response.data;
    } catch (error) {
        console.error('슬롯 생성 실패:', error);
        throw error;
    }
};

// 상품의 모든 슬롯 삭제 (실제 API 호출)
export const deleteSlotsByProductId = async (productId) => {
    try {
        console.log(`상품 ${productId}의 모든 슬롯 삭제 요청`);
        const response = await apiRequest.delete(`/api/availabilityslot/product/${productId}`);
        console.log('슬롯 삭제 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error('슬롯 삭제 실패:', error);
        throw error;
    }
};

// 상품 슬롯 정보 조회
export const getProductSlotInfo = async (productId) => {
    try {
        console.log(`상품 ${productId}의 슬롯 정보 조회`);
        const response = await apiRequest.get(`/api/availabilityslot/product/${productId}/info`);
        return response.data;
    } catch (error) {
        console.error('슬롯 정보 조회 실패:', error);
        throw error;
    }
};

// 상품 삭제 전 정보 확인
export const checkProductDeletion = async (productId) => {
    try {
        console.log(`상품 ${productId} 삭제 전 확인`);
        const response = await apiRequest.get(`/api/products/${productId}/deletion-check`);
        return response.data;
    } catch (error) {
        console.error('삭제 확인 실패:', error);
        throw error;
    }
};

// 개별 슬롯 삭제
export const deleteSlot = async (slotId) => {
    try {
        console.log(`슬롯 ${slotId} 개별 삭제 요청`);
        const response = await apiRequest.delete(`/api/availabilityslot/${slotId}`);
        return {
            success: true,
            message: `슬롯 ${slotId}이 삭제되었습니다.`
        };
    } catch (error) {
        console.error('개별 슬롯 삭제 실패:', error);
        throw error;
    }
};