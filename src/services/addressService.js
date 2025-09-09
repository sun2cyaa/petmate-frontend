import api from "./api";

// 주소 목록 조회
export const getAddresses = async () => {
  const response = await api.get("/api/address");
  return response.data;
};

// 주소 추가
export const createAddress = async (addressData) => {
  const response = await api.post("/api/address", {
    type: addressData.type,
    address: addressData.address,
    detail: addressData.detail,
    alias: addressData.alias,
    isDefault: addressData.isDefault,
    coordinates: addressData.coordinates
  });
  return response.data;
};

// 주소 수정
export const updateAddress = async (id, addressData) => {
  const response = await api.put(`/api/address/${id}`, {
    type: addressData.type,
    address: addressData.address,
    detail: addressData.detail,
    alias: addressData.alias,
    isDefault: addressData.isDefault,
    coordinates: addressData.coordinates
  });
  return response.data;
};

// 주소 삭제
export const deleteAddress = async (id) => {
  const response = await api.delete(`/api/address/${id}`);
  return response.data;
};