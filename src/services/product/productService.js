import { createDummyProduct, deleteDummyProduct, getDummyCompanies, getDummyProducts, getDummyServiceCategories, updateDummyProduct } from "../../pages/product/dummyData";
import { getDummyProduct } from '../../pages/product/dummyData';

// 더미 데이터 사용 여부
const USE_DUMMY_DATA = process.env.NODE_ENV === 'development' || process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8090';

// API 호출처럼 구현
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// 상품 목록 조회하기
export const getProducts = async (params = {}) => {
    if(USE_DUMMY_DATA) {
        await delay(500); // 로딩 시물레이션
        return getDummyProducts(params);
    }

    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/products?${queryString}`);

        if(!response.ok) {
            throw new Error(`상품 목록을 불러오는데 실패했습니다. ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("상품 목록 조회 오류:", error);
        throw error;
    }
};

// 상품 상세 조회하기
export const getProduct = async (productId) => {
    if(USE_DUMMY_DATA) {
        await delay(300); // 로딩 시물레이션
        const product = getDummyProduct(productId);
        if(!product) {
            throw new Error("상품을 찾을 수 없습니다.");
        }
        return product;

    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);

        if(!response.ok) {
            throw new Error(`상품을 불러오는데 실패했습니다. ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("상품 상세 조회 오류:", error);
        throw error;
    }   
};

// 상품 등록하기
export const createProduct = async (productData) => {
    if(USE_DUMMY_DATA) {
        await delay(300); // 로딩 시물레이션
        return createDummyProduct(productData);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if(!response.ok) {
            throw new Error(`상품 등록에 실패했습니다. ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("상품 등록 오류:", error);
        throw error;
    }
};

// 상품 수정
export const updateProduct = async (productId, productData) => {
  if (USE_DUMMY_DATA) {
    await delay(600);
    return updateDummyProduct(productId, productData);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('상품 수정 실패:', error);
    throw error;
  }
};

// 상품 삭제
export const deleteProduct = async (productId) => {
  if (USE_DUMMY_DATA) {
    await delay(400);
    return deleteDummyProduct(productId);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('상품 삭제 실패:', error);
    throw error;
  }
};

// 업체 목록 조회 (드롭다운용)
export const getCompanies = async () => {
  if (USE_DUMMY_DATA) {
    await delay(200);
    return getDummyCompanies();
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/companies`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('업체 목록 조회 실패:', error);
    throw error;
  }
};

// 서비스 카테고리 목록 조회 (드롭다운용)
export const getServiceCategories = async () => {
  if (USE_DUMMY_DATA) {
    await delay(200);
    return getDummyServiceCategories();
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/service-categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('서비스 카테고리 조회 실패:', error);
    throw error;
  }
};