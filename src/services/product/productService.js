import { createDummyProduct, deleteDummyProduct, getDummyCompanies, getDummyProducts, getDummyServiceCategories, updateDummyProduct } from "../../pages/product/dummyData.jsx";
import { getDummyProduct } from '../../pages/product/dummyData.jsx';
import { apiRequest } from '../api';

// 더미 데이터 사용 여부 (개발 중에는 더미 데이터, 배포 시에는 실제 API 사용)
const USE_DUMMY_DATA = process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_REAL_API;

// API 호출처럼 구현
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// 상품 목록 조회하기
export const getProducts = async (params = {}) => {
    // if(USE_DUMMY_DATA) {
    //     await delay(500); // 로딩 시물레이션
    //     return getDummyProducts(params);
    // }

    // try {
    //     const queryString = new URLSearchParams(params).toString();
    //     const response = await apiRequest.get(`/api/products?${queryString}`);
    //     return response.data;
    // } catch (error) {
    //     console.error("상품 목록 조회 오류:", error);
    //     throw error;
    // }

    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `api/products/${queryString}` : 'api/products';
      console.log("상품 목록 조회 api 호출", url);

      const response = await apiRequest.get(url);
      console.log("상품 목록 조회?" , response.data);
      return response.data;
    } catch(er) {
      console.error("상품 목록 조회 오류:" , er);
      alert("상품 목록 불로오기 실패!!");
      throw er;
    }
};

// // 상품 상세 조회하기
// export const getProduct = async (productId) => {
//     if(USE_DUMMY_DATA) {
//         await delay(300); // 로딩 시물레이션
//         const product = getDummyProduct(productId);
//         if(!product) {
//             throw new Error("상품을 찾을 수 없습니다.");
//         }
//         return product;
//     }

//     try {
//         const response = await apiRequest.get(`/api/products/${productId}`);
//         return response.data;
//     } catch (error) {
//         console.error("상품 상세 조회 오류:", error);
//         throw error;
//     }   
// };

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

// // 상품 등록하기
// export const createProduct = async (productData) => {
//     if(USE_DUMMY_DATA) {
//         await delay(300); // 로딩 시물레이션
//         return createDummyProduct(productData);
//     }

//     try {
//         const response = await apiRequest.post('/api/products', productData);
//         return response.data;
//     } catch (error) {
//         console.error("상품 등록 오류:", error);
//         throw error;
//     }
// };

 // 상품 등록 (백엔드 구조에 맞게 데이터 변환)
  export const createProduct = async (productData) => {
      try {
          console.log('상품 등록 요청 데이터 (원본):', productData);

          // 프론트엔드 데이터를 백엔드 형식으로 변환
          const backendData = {
              companyId: parseInt(productData.companyId),
              serviceType: productData.serviceTypeId, // serviceTypeId -> serviceType
              name: productData.name,
              price: parseInt(productData.price),
              allDay: productData.isAllDay ? 1 : 0, // boolean -> integer
              durationMin: parseInt(productData.duration) || null, // duration -> durationMin
              introText: productData.description || null, // description -> introText
              minPet: 1, // 기본값
              maxPet: 1, // 기본값
              isActive: productData.isActive ? 1 : 0 // boolean -> integer
          };

          console.log('상품 등록 요청 데이터 (변환 후):', backendData);

          const response = await apiRequest.post('/api/products', backendData);
          console.log('상품 등록 응답:', response.data);
          alert("상품이 성공적으로 등록되었습니다!");
          return response.data;
      } catch (er) {
          console.error("상품 등록 오류:", er);
          alert("상품 등록에 실패했습니다: " + (er.response?.data?.message || er.message));
          throw er;
      }
  };

// // 상품 수정
// export const updateProduct = async (productId, productData) => {
//   if (USE_DUMMY_DATA) {
//     await delay(600);
//     return updateDummyProduct(productId, productData);
//   }
  
//   try {
//     const response = await apiRequest.put(`/api/products/${productId}`, productData);
//     return response.data;
//   } catch (error) {
//     console.error('상품 수정 실패:', error);
//     throw error;
//   }
// };

 // 상품 수정 (백엔드 구조에 맞게 데이터 변환)
  export const updateProduct = async (productId, productData) => {
      try {
          console.log('상품 수정 요청 데이터 (원본):', productData);

          // 프론트엔드 데이터를 백엔드 형식으로 변환
          const backendData = {
              companyId: parseInt(productData.companyId),
              serviceType: productData.serviceTypeId, // serviceTypeId -> serviceType
              name: productData.name,
              price: parseInt(productData.price),
              allDay: productData.isAllDay ? 1 : 0, // boolean -> integer
              durationMin: parseInt(productData.duration) || null, // duration -> durationMin
              introText: productData.description || null, // description -> introText
              minPet: 1, // 기본값
              maxPet: 1, // 기본값
              isActive: productData.isActive ? 1 : 0 // boolean -> integer
          };

          console.log('상품 수정 요청 데이터 (변환 후):', backendData);

          const response = await apiRequest.put(`/api/products/${productId}`, backendData);
          console.log('상품 수정 응답:', response.data);
          alert("상품이 성공적으로 수정되었습니다!");
          return response.data;
      } catch (er) {
          console.error('상품 수정 실패:', er);
          alert("상품 수정에 실패했습니다: " + (er.response?.data?.message || er.message));
          throw er;
      }
  };

// // 상품 삭제
// export const deleteProduct = async (productId) => {
//   if (USE_DUMMY_DATA) {
//     await delay(400);
//     return deleteDummyProduct(productId);
//   }
  
//   try {
//     await apiRequest.delete(`/api/products/${productId}`);
//     return true;
//   } catch (error) {
//     console.error('상품 삭제 실패:', error);
//     throw error;
//   }
// };

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

// // 업체 목록 조회 (드롭다운용) - 소셜로그인 사용자의 회사 정보 포함
// export const getCompanies = async () => {
//   if (USE_DUMMY_DATA) {
//     await delay(200);
//     return getDummyCompanies();
//   }
  
//   try {
//     const response = await apiRequest.get('/api/companies');
//     return response.data;
//   } catch (error) {
//     console.error('업체 목록 조회 실패:', error);
//     throw error;
//   }
// };

 // 업체 목록 조회
  export const getCompanies = async () => {
      try {
          console.log('업체 목록 조회 API 호출');

          const response = await apiRequest.get('/api/companies');
          console.log('업체 목록 조회 응답:', response.data);
          return response.data;
      } catch (er) {
          console.error('업체 목록 조회 실패:', er);
          alert("업체 목록을 불러오는데 실패했습니다.");
          throw er;
      }
  };

// // 서비스 카테고리 목록 조회 (드롭다운용)
// export const getServiceCategories = async () => {
//   if (USE_DUMMY_DATA) {
//     await delay(200);
//     return getDummyServiceCategories();
//   }
  
//   try {
//     const response = await apiRequest.get('/api/service-categories');
//     return response.data;
//   } catch (error) {
//     console.error('서비스 카테고리 조회 실패:', error);
//     throw error;
//   }
// };


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