import datejs from "dayjs";

// 샘플 데이터 (실제로는 API 엔드포인트로 교체)
const sampleReservations = [
  {
    id: 1,
    userName: '김반하인',
    userLocation: '서울시 강남구 대치1동',
    userAvatar: '/avatars/user1.jpg',
    serviceName: '홈웨어 - 하루종일 돌봄 서비스',
    petInfo: '망아이, 아용이',
    startTime: '09:00',
    endTime: '18:00',
    price: 50000,
    status: 'pending',
    date: datejs().format('YYYY-MM-DD')
  },
  {
    id: 2,
    userName: '박멍주인',
    userLocation: '서울시 서초구 강남대로',
    userAvatar: '/avatars/user2.jpg',
    serviceName: '산책 - 오후 산책 서비스',
    petInfo: '초코',
    startTime: '14:00',
    endTime: '16:00',
    price: 30000,
    status: 'approved',
    date: datejs().format('YYYY-MM-DD')
  },
  {
    id: 3,
    userName: '이댕댕이',
    userLocation: '서울시 송파구 잠실1동',
    userAvatar: '/avatars/user3.jpg',
    serviceName: '미용 - 기본 미용 서비스',
    petInfo: '복실이',
    startTime: '10:00',
    endTime: '12:00',
    price: 40000,
    status: 'approved',
    date: datejs().format('YYYY-MM-DD')
  }
];

export const bookingService = {
  // 특정 날짜의 예약 목록 가져오기
  async getReservations(date) {
    // 실제 API 호출 시뮬레이션
    return new Promise((resolve) => {
      setTimeout(() => {
        const dateStr = datejs(date).format('YYYY-MM-DD');
        const filteredReservations = sampleReservations.filter(
          reservation => reservation.date === dateStr
        );
        resolve(filteredReservations);
      }, 500);
    });
  },

  // 오늘의 예약 통계 가져오기
  async getTodayStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = datejs().format('YYYY-MM-DD');
        const todayReservations = sampleReservations.filter(
          reservation => reservation.date === today
        );
        
        const stats = {
          total: todayReservations.length,
          pending: todayReservations.filter(r => r.status === 'pending').length,
          completed: todayReservations.filter(r => r.status === 'approved').length
        };
        
        resolve(stats);
      }, 300);
    });
  },

  // 예약 상태 업데이트
  async updateReservationStatus(reservationId, status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reservation = sampleReservations.find(r => r.id === reservationId);
        if (reservation) {
          reservation.status = status;
        }
        resolve({ success: true });
      }, 200);
    });
  },

  // 예약 삭제
  async deleteReservation(reservationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = sampleReservations.findIndex(r => r.id === reservationId);
        if (index > -1) {
          sampleReservations.splice(index, 1);
        }
        resolve({ success: true });
      }, 200);
    });
  }
};