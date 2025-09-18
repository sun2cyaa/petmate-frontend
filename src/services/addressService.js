import { apiRequest } from "./api";

// 주소 목록 조회
export const getAddresses = async () => {
    const response = await apiRequest.get("/api/address");
    return response.data;
};

// 주소 추가
export const createAddress = async (addressData) => {
    const response = await apiRequest.post("/api/address", {
        type: addressData.type,
        address: addressData.address,
        detail: addressData.detail,
        alias: addressData.alias,
        isDefault: addressData.isDefault,
        postcode: addressData.postcode || "",
        latitude: addressData.latitude,
        longitude: addressData.longitude
    });
    return response.data;
};

// 주소 수정
export const updateAddress = async (id, addressData) => {
    const response = await apiRequest.put(`/api/address/${id}`, {
        type: addressData.type,
        address: addressData.address,
        detail: addressData.detail,
        alias: addressData.alias,
        isDefault: addressData.isDefault,
        postcode: addressData.postcode || "",
        latitude: addressData.latitude,
        longitude: addressData.longitude
    });
    return response.data;
};

// 주소 삭제
export const deleteAddress = async (id) => {
    const response = await apiRequest.delete(`/api/address/${id}`);
    return response.data;
};

// 기본 주소 설정
export const setDefaultAddress = async (id) => {
    const response = await apiRequest.put(`/api/address/${id}/default`, {});
    return response.data;
};

// 기본주소 조회
export const getAddressesByDefault = async (id) => {
    const response = await apiRequest.get(`/api/address/${id}`);
    return response.data;
};