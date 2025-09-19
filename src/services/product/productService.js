import { createDummyProduct, deleteDummyProduct, getDummyCompanies, getDummyProducts, getDummyServiceCategories, updateDummyProduct } from "../../pages/product/dummyData.jsx";
import { getDummyProduct } from '../../pages/product/dummyData.jsx';
import { apiRequest } from '../api';

// 더미 데이터 사용 여부 (개발 중에는 더미 데이터, 배포 시에는 실제 API 사용)
const USE_DUMMY_DATA = process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_REAL_API;

// API 호출처럼 구현
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// 상품 목록 조회하기
export const getProducts = async (params = {}) => {

    try {
      // 파라미터가 있으면 search 엔드포인트 사용, 없으면 전체 조회
      const hasParams = Object.keys(params).length > 0 && Object.values(params).some(value => value);

      let url, response;

      if (hasParams) {
        const queryString = new URLSearchParams(params).toString();
        url = `api/products/search?${queryString}`;
        console.log("상품 검색 api 호출", url);
        console.log("검색 파라미터:", params);
        response = await apiRequest.get(url);
      } else {
        url = 'api/products';
        // url = 'api/products/myproduct';
        console.log("전체 상품 조회 api 호출", url);
        response = await apiRequest.get(url);
      }
      console.log("상품 목록 조회?" , response.data);
      return response.data;
    } catch(er) {
      console.error("상품 목록 조회 오류:" , er);
      alert("상품 목록 불로오기 실패!!");
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