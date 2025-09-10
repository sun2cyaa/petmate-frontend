// 더미 업체 데이터

export const dummyCompanies = [
  { id: 1, name: "김밥시티 개인사업" },
  { id: 2, name: "행복한 돌봄 센터" },
  { id: 3, name: "편리한 생활 서비스" },
  { id: 4, name: "따뜻한 케어" },
];

// 더미 서비스 카테고리 데이터
export const dummyServiceCategories = [
  { id: 1, name: "돌봄" },
  { id: 2, name: "산책" },
  { id: 3, name: "미용" },
  { id: 4, name: "의료서비스" },
];

// 더미 상품 데이터
export const dummyProducts = [
  {
    id: 1,
    companyId: 1,
    serviceTypeId: 1,
    name: "기본 돌봄 서비스",
    description: "산책, 말동무, 돌아주기 등 기본적인 돌봄 서비스입니다.",
    price: 15000,
    duration: 60, // 1시간
    availableTimes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    isActive: true,
    createdAt: "2024-01-15T09:00:00",
    updatedAt: "2024-01-15T09:00:00",
    // 화면 표시용 추가 정보
    companyName: "김밥시티 개인사업",
    serviceType: "돌봄",
  },
  {
    id: 2,
    companyId: 2,
    serviceTypeId: 1,
    name: "장시간 안심 돌봄",
    description: "종합적인 케어 서비스로 장시간 안심하고 맡길 수 있습니다.",
    price: 35000,
    duration: 180, // 3시간
    availableTimes: ["09:00", "13:00", "17:00"],
    isActive: true,
    createdAt: "2024-01-20T10:30:00",
    updatedAt: "2024-01-20T10:30:00",
    companyName: "행복한 돌봄 센터",
    serviceType: "돌봄",
  },
  {
    id: 3,
    companyId: 3,
    serviceTypeId: 2,
    name: "가사도우미 서비스",
    description: "청소, 세탁, 요리 등 일상 생활을 도와드리는 서비스입니다.",
    price: 25000,
    duration: 120, // 2시간
    availableTimes: ["10:00", "14:00", "16:00"],
    isActive: true,
    createdAt: "2024-01-18T14:00:00",
    updatedAt: "2024-01-18T14:00:00",
    companyName: "편리한 생활 서비스",
    serviceType: "생활지원",
  },
  {
    id: 4,
    companyId: 4,
    serviceTypeId: 3,
    name: "건강 체크 서비스",
    description: "혈압, 혈당 측정 및 기본적인 건강 상태를 체크해드립니다.",
    price: 45000,
    duration: 90, // 1시간 30분
    availableTimes: ["09:00", "11:00", "14:00", "16:00"],
    isActive: false, // 비활성 상태 예시
    createdAt: "2024-01-22T11:15:00",
    updatedAt: "2024-01-25T16:20:00",
    companyName: "따뜻한 케어",
    serviceType: "의료서비스",
  },
];

// 더미 데이터를 실제 API 응답처럼 반환하는 헬퍼 함수들
export const getDummyProducts = (filters = {}) => {
  let filteredProducts = [...dummyProducts];

  // 업체 필터링
  if (filters.companyId) {
    filteredProducts = filteredProducts.filter(
      (product) => product.companyId === parseInt(filters.companyId)
    );
  }

  // 서비스 유형 필터링
  if (filters.serviceType) {
    filteredProducts = filteredProducts.filter(
      (product) => product.serviceTypeId === parseInt(filters.serviceType)
    );
  }

  return filteredProducts;
};

export const getDummyProduct = (productId) => {
  return dummyProducts.find((product) => product.id === parseInt(productId));
};

export const getDummyCompanies = () => {
  return dummyCompanies;
};

export const getDummyServiceCategories = () => {
  return dummyServiceCategories;
};

// 상품 생성 시뮬레이션 (실제로는 추가하지 않음, 콘솔 로그만)
export const createDummyProduct = (productData) => {
  console.log("새 상품 등록:", productData);
  const newProduct = {
    ...productData,
    id: Math.max(...dummyProducts.map((p) => p.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 실제 구현에서는 여기서 dummyProducts 배열에 추가할 수 있음
  return newProduct;
};

// 상품 수정 시뮬레이션
export const updateDummyProduct = (productId, productData) => {
  console.log(`상품 ${productId} 수정:`, productData);
  const updatedProduct = {
    ...productData,
    id: parseInt(productId),
    updatedAt: new Date().toISOString(),
  };

  return updatedProduct;
};

// 상품 삭제 시뮬레이션
export const deleteDummyProduct = (productId) => {
  console.log(`상품 ${productId} 삭제`);
  const index = dummyProducts.findIndex((p) => p.id === productId);
  if (index !== -1) {
    dummyProducts.splice(index, 1);
  }
  return true;
};
