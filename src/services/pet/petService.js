import { apiRequest } from '../api';

/**
 * 내 반려동물 목록 조회
 */
export const getMyPets = async () => {
  try {
    const response = await apiRequest.get('/pet/my');
    return response.data;
  } catch (error) {
    console.error('내 반려동물 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 내 특정 반려동물 단건 조회
 */
export const getMyPet = async (petId) => {
  try {
    const response = await apiRequest.get(`/pet/my/${petId}`);
    return response.data;
  } catch (error) {
    console.error('반려동물 상세 조회 실패:', error);
    throw error;
  }
};