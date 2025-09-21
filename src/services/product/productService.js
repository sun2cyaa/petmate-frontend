import { createDummyProduct, deleteDummyProduct, getDummyCompanies, getDummyProducts, getDummyServiceCategories, updateDummyProduct } from "../../pages/product/dummyData.jsx";
import { getDummyProduct } from '../../pages/product/dummyData.jsx';
import { apiRequest } from '../api';

// 환경 설정
const API_BASE = process.env.REACT_APP_SPRING_API_BASE || "http://localhost:8090";
const USE_REAL_API = process.env.REACT_APP_SPRING_API_BASE && process.env.REACT_APP_SPRING_API_BASE !== "http://localhost:8090";
const USE_DUMMY_DATA = !USE_REAL_API && process.env.NODE_ENV === 'development';

console.log('상품관리 환경 설정:', {
  API_BASE,
  USE_REAL_API,
  USE_DUMMY_DATA,
  NODE_ENV: process.env.NODE_ENV
});

// API 호출처럼 구현
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// 상품 목록 조회하기
export const getProducts = async (params = {}) => {
    try {
      // 토큰 확인 로그 추가(토큰 이상함...)
      const token = localStorage.getItem("accessToken");
      console.log("저장된 토큰:", token ? "있지? (길이: " + token.length + ")" : "없음");

      // 파라미터가 있으면 search 엔드포인트 사용, 없으면 전체 조회
      const hasParams = Object.keys(params).length > 0 && Object.values(params).some(value => value);

      let url, response;

      if (hasParams) {
        const queryString = new URLSearchParams(params).toString();
        url = `api/products/search?${queryString}`;
        console.log("상품 검색 API 호출:", url);
        console.log("검색 파라미터:", params);
        response = await apiRequest.get(url);
      } else {
        url = 'api/products';
        console.log("전체 상품 조회 API 호출:", url);
        console.log("요청 직전 토큰 재확인:", localStorage.getItem("accessToken") ? "있음" : "없음");
        response = await apiRequest.get(url);
      }

      console.log("상품 목록 조회 성공:", response.data);
      console.log("조회된 상품 수:", Array.isArray(response.data) ? response.data.length : "배열이 아님");
      console.log("response 전체:", response);
      console.log("response.status:", response.status);

      // 성공 응답이어도 데이터가 비어있을 수 있음
      if (!response.data) {
        console.warn("응답 데이터가 null/undefined 둘중에 하나임");
        return [];
      }

      return response.data;
    } catch(er) {
      console.error("상품 목록 조회 오류:", er);
      console.error("오류 상태코드:", er.response?.status);
      console.error("오류 응답 데이터:", er.response?.data);
      console.error("오류 메시지:", er.message);

      // 구체적인 오류 메시지 표시
      let errorMessage = "상품 목록 불러오기 실패!!";
      if (er.response?.status === 401) {
        errorMessage = "인증이 필요합니다. 다시 로그인해주세요.";
      } else if (er.response?.status === 403) {
        errorMessage = "권한이 없습니다.";
      } else if (er.response?.status === 500) {
        errorMessage = "서버 오류가 발생했습니다.";
      }

      alert(errorMessage);
      throw er;
    }
};


 // 상품 상세 조회
  export const getProduct = async (productId) => {
      try {
          console.log('상품 상세 조회 api 호출:', `/api/products/${productId}`);

          const response = await apiRequest.get(`/api/products/${productId}`);
          console.log('상품 상세 조회 응답:', response.data);
          return response.data;
      } catch (er) {
          console.error("상품 상세 조회 오류:", er);
          alert("상품 정보를 불러오는데 실패했습니다.");
          throw er;
      }
  };


 // 상품 등록 (백엔드 구조에 맞게 데이터 변환)
  export const createProduct = async (productData) => {
      try {
          console.log('=== 상품 등록 API 호출 시작 ===');
          console.log('상품 등록 요청 데이터 (원본):', productData);
          console.log('minPet 타입과 값:', typeof productData.minPet, productData.minPet);
          console.log('maxPet 타입과 값:', typeof productData.maxPet, productData.maxPet);

          // 프론트엔드 데이터를 백엔드 형식으로 변환
          const backendData = {
              companyId: parseInt(productData.companyId),
              serviceType: productData.serviceTypeId,
              name: productData.name,
              price: parseInt(productData.price),
              allDay: productData.isAllDay ? 1 : 0,
              durationMin: parseInt(productData.duration) || null,
              introText: productData.description || null,
              minPet: parseInt(productData.minPet) || 1,
              maxPet: parseInt(productData.maxPet) || 1,
              isActive: productData.isActive ? 1 : 0
          };

          console.log('상품 등록 요청 데이터 (변환 후):', backendData);
          console.log('변환된 minPet 타입과 값:', typeof backendData.minPet, backendData.minPet);
          console.log('변환된 maxPet 타입과 값:', typeof backendData.maxPet, backendData.maxPet);

          const response = await apiRequest.post('/api/products', backendData);
          console.log('상품 등록 응답:', response.data);
          console.log('=== 상품 등록 API 호출 완료 ===');
          alert("상품이 성공적으로 등록되었습니다!");
          return response.data;
      } catch (er) {
          console.error("상품 등록 오류:", er);
          alert("상품 등록에 실패했습니다: " + (er.response?.data?.message || er.message));
          throw er;
      }
  };


 // 상품 수정 (백엔드 구조에 맞게 데이터 변환)
  export const updateProduct = async (productId, productData) => {
      try {
          console.log('=== 상품 수정 API 호출 시작 ===');
          console.log('상품 ID:', productId);
          console.log('상품 수정 요청 데이터 (원본):', productData);
          console.log('수정 minPet 타입과 값:', typeof productData.minPet, productData.minPet);
          console.log('수정 maxPet 타입과 값:', typeof productData.maxPet, productData.maxPet);

          // 프론트엔드 데이터를 백엔드 형식으로 변환
          const backendData = {
              companyId: parseInt(productData.companyId),
              serviceType: productData.serviceTypeId,
              name: productData.name,
              price: parseInt(productData.price),
              allDay: productData.isAllDay ? 1 : 0,
              durationMin: parseInt(productData.duration) || null,
              introText: productData.description || null,
              minPet: parseInt(productData.minPet) || 1,
              maxPet: parseInt(productData.maxPet) || 1,
              isActive: productData.isActive ? 1 : 0
          };

          console.log('상품 수정 요청 데이터 (변환 후):', backendData);
          console.log('변환된 수정 minPet 타입과 값:', typeof backendData.minPet, backendData.minPet);
          console.log('변환된 수정 maxPet 타입과 값:', typeof backendData.maxPet, backendData.maxPet);

          const response = await apiRequest.put(`/api/products/${productId}`, backendData);
          console.log('상품 수정 응답:', response.data);
          console.log('=== 상품 수정 API 호출 완료 ===');
          alert("상품이 성공적으로 수정되었습니다!");
          return response.data;
      } catch (er) {
          console.error('상품 수정 실패:', er);
          alert("상품 수정에 실패했습니다: " + (er.response?.data?.message || er.message));
          throw er;
      }
  };


// 상품 삭제
  export const deleteProduct = async (productId) => {
      try {
          console.log('상품 삭제 API 호출:', `/api/products/${productId}`);

          await apiRequest.delete(`/api/products/${productId}`);
          console.log('상품 삭제 완료');
          alert("상품이 성공적으로 삭제되었습니다!");
          return true;
      } catch (er) {
          console.error('상품 삭제 실패:', er);
          alert("상품 삭제에 실패했습니다: " + (er.response?.data?.message || er.message));
          throw er;
      }
  };


 // 업체 목록 조회
  export const getCompanies = async () => {
      try {
          console.log('업체 목록 조회 API 호출');

          const response = await apiRequest.get('/api/products/companies');
          console.log('업체 목록 조회 응답:', response.data);
          return response.data;
      } catch (er) {
          console.error('업체 목록 조회 실패:', er);
          alert("업체 목록을 불러오는데 실패했습니다.");
          throw er;
      }
  };



  // 서비스 카테고리 목록 조회
  export const getServiceCategories = async () => {
      try {
          console.log('서비스 카테고리 조회 API 호출');

          const response = await apiRequest.get('/api/service-categories');
          console.log('서비스 카테고리 조회 응답:', response.data);
          return response.data;
      } catch (er) {
          console.error('서비스 카테고리 조회 실패:', er);
          alert("서비스 카테고리를 불러오는데 실패했습니다.");
          throw er;
      }
  };

   // 업체별 상품 조회 (예약에서 사용)
  export const getProductsByCompany = async (companyId) => {
    try {
      console.log('업체별 상품 조회 API 호출:', `/api/products/company/${companyId}`);

      const response = await apiRequest.get(`/api/products/company/${companyId}`);
      console.log('업체별 상품 조회 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('업체별 상품 조회 실패:', error);
      // 예약 시에는 alert 대신 조용히 빈 배열 반환
      return [];
    }
  };

  // 서비스 카테고리 조회 (예약에서 사용)
  export const getServiceCategoriesForBooking = async () => {
    try {
      console.log('예약용 서비스 카테고리 조회 API 호출');

      const response = await apiRequest.get('/api/products/service-categories');
      console.log('서비스 카테고리 조회 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('서비스 카테고리 조회 실패:', error);
      // 기본 카테고리 반환
      return [
        { id: "C", name: "돌봄" },
        { id: "W", name: "산책" },
        { id: "G", name: "미용" },
        { id: "M", name: "병원" },
        { id: "E", name: "기타" }
      ];
    }
  };

  // 업체별 서비스 유형 조회
  export const getServiceTypesByCompany = async (companyId) => {
    try {
      const response = await apiRequest.get(`/api/company/${companyId}/service-types`);
      const serviceTypeCodes = response.data;
      const allServiceCategories = await getServiceCategories();

      const filteredCategories = allServiceCategories.filter(category =>
        serviceTypeCodes.includes(category.id)
      );

      return filteredCategories;
    } catch (error) {
      console.error('업체별 서비스 유형 조회 실패:', error);
      // 실패 시 전체 서비스 카테고리 반환
      return await getServiceCategories();
    }
  };