import { apiRequest } from "./api";

// 업체 등록
export const registerCompany = async (formData) => {
  const response = await apiRequest.post("/api/company/register", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 사업자등록번호 조회
export const checkBusinessNumber = async (businessNumber) => {
  const response = await apiRequest.post("/api/business/check", {
    businessNumber: businessNumber
  });
  return response.data;
};

// 업체 목록 조회
export const getCompanies = async (params = {}) => {
  const response = await apiRequest.get("/api/company", { params });
  return response.data;
};

// 업체 상세 조회
export const getCompanyById = async (id) => {
  const response = await apiRequest.get(`/api/company/${id}`);
  return response.data;
};

// 업체 정보 수정
export const updateCompany = async (id, formData) => {
  const response = await apiRequest.put(`/api/company/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 업체 삭제
export const deleteCompany = async (id) => {
  const response = await apiRequest.delete(`/api/company/${id}`);
  return response.data;
};

// 업체 승인 상태 변경
export const updateCompanyStatus = async (id, status) => {
  const response = await apiRequest.put(`/api/company/${id}/status`, { status });
  return response.data;
};

// 국세청 사업자등록번호 검증
export const validateBusinessNumber = async (businessNumber) => {
  const response = await apiRequest.post('/api/company/validate-business', {
    businessNumber: businessNumber
  });
  return response.data;
};

// 내가 등록한 업체 목록 조회
export const getMyCompanies = async () => {
  const response = await apiRequest.get("/api/company/my");
  return response.data;
};