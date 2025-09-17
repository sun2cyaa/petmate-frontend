// product/ProductEditPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductManagePage.css";
import {
  getProduct,
  updateProduct,
  getCompanies,
  getServiceCategories,
} from "../../services/product/productService";
import { getAvailableSlots, createProductSlots, deleteSlot, deleteSlotsByProductId } from "../../services/product/availabilitySlotService";

const ProductEditPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);

  const [formData, setFormData] = useState({
    companyId: "",
    serviceTypeId: "",
    name: "",
    description: "",
    price: "",
    duration: "",
    minPet: "1",
    maxPet: "1",
    isActive: true,
    isAllDay: false,
  });

  const [errors, setErrors] = useState({});

  // 슬롯 관리 상태 추가
  const [showSlotManagement, setShowSlotManagement] = useState(false);
  const [existingSlots, setExistingSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({
    startDate: '',
    endDate: '',
    selectedTimes: [],
    capacity: 1
  });

  // 슬롯 관리 옵션 상태 추가 (기본값 변경)
  const [slotManagementOption, setSlotManagementOption] = useState('add');

  // 개별 슬롯 삭제 함수
  const handleDeleteSlot = async (slotId) => {
    if (window.confirm('이 슬롯을 삭제하시겠습니까?')) {
      try {
        console.log(`슬롯 ${slotId} 삭제 요청`);
        await deleteSlot(slotId);

        // API 호출 성공 후 UI에서 제거
        setExistingSlots(prev => prev.filter(slot => slot.id !== slotId));
        alert('슬롯이 삭제되었습니다.');
      } catch (error) {
        console.error('슬롯 삭제 실패:', error);
        alert('슬롯 삭제에 실패했습니다.');
      }
    }
  };

  // 모든 슬롯 삭제 함수
  const handleDeleteAllSlots = async () => {
    if (window.confirm(`모든 슬롯(${existingSlots.length}개)을 삭제하시겠습니까?`)) {
      try {
        console.log(`상품 ${productId}의 모든 슬롯 삭제`);
        await deleteSlotsByProductId(productId);

        // API 호출 성공 후 UI에서 제거
        setExistingSlots([]);
        alert('모든 슬롯이 삭제되었습니다.');
      } catch (error) {
        console.error('전체 슬롯 삭제 실패:', error);
        alert('슬롯 삭제에 실패했습니다.');
      }
    }
  };

  // 30분 단위 시간 생성 함수
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = minute === 30 ? hour + 1 : hour;
        const endMinute = minute === 30 ? 0 : 30;
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

        slots.push(`${startTime}-${endTime}`);
      }
    }
    return slots;
  };

  useEffect(() => {
    loadInitialData();
  }, [productId]);

  // 슬롯 관리 토글 시 기존 슬롯 조회
  useEffect(() => {
    if (showSlotManagement) {
      loadExistingSlots();
    }
  }, [showSlotManagement, productId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productData, companiesData, categoriesData] = await Promise.all([
        getProduct(productId),
        getCompanies(),
        getServiceCategories(),
      ]);

      // 슬롯 개수 정보도 초기에 로드
      loadExistingSlots();


      setFormData({
        companyId: productData.companyId || "",
        serviceTypeId: productData.serviceType || "",
        name: productData.name || "",
        description: productData.introText || "",
        price: productData.price || "",
        duration: productData.durationMin || "",
        minPet: productData.minPet || "1",
        maxPet: productData.maxPet || "1",
        isActive: productData.isActive === 1,
        isAllDay: productData.allDay === 1,
      }); 

      setCompanies(companiesData);
      setServiceCategories(categoriesData);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      alert("상품 정보를 불러오는데 실패했습니다.");
      navigate("/product");
    } finally {
      setLoading(false);
    }
  };

  // 기존 슬롯 조회
  const loadExistingSlots = async () => {
    try {
      const slots = await getAvailableSlots(productId, new Date().toISOString().split('T')[0]);
      setExistingSlots(slots);
    } catch (error) {
      console.error('슬롯 조회 실패:', error);
    }
  };

  // 새 슬롯 시간 토글
  const handleNewSlotTimeToggle = (timeSlot) => {
    setNewSlot(prev => ({
      ...prev,
      selectedTimes: prev.selectedTimes.includes(timeSlot)
        ? prev.selectedTimes.filter(t => t !== timeSlot)
        : [...prev.selectedTimes, timeSlot]
    }));
  };

  // 새 슬롯 추가
  const handleAddNewSlots = async () => {
    if (!newSlot.startDate || !newSlot.endDate || newSlot.selectedTimes.length === 0) {
      alert('날짜와 시간을 모두 선택해주세요.');
      return;
    }

    try {
      const timeSlots = newSlot.selectedTimes.map(timeRange => {
        const [startTime, endTime] = timeRange.split('-');
        return { startTime, endTime };
      });

      await createProductSlots(productId, formData.companyId, {
        startDate: newSlot.startDate,
        endDate: newSlot.endDate,
        timeSlots,
        capacity: newSlot.capacity
      });

      alert('새 슬롯이 추가되었습니다.');
      setNewSlot({ startDate: '', endDate: '', selectedTimes: [], capacity: 1 });
      loadExistingSlots(); // 새로고침
    } catch (error) {
      console.error('슬롯 추가 실패:', error);
      alert('슬롯 추가에 실패했습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyId) newErrors.companyId = "업체를 선택해주세요.";
    if (!formData.serviceTypeId)
      newErrors.serviceTypeId = "서비스 유형을 선택해주세요.";
    if (!formData.name.trim()) newErrors.name = "상품명을 입력해주세요.";
    if (!formData.description.trim())
      newErrors.description = "상품 설명을 입력해주세요.";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "올바른 가격을 입력해주세요.";
    if (!formData.duration) newErrors.duration = "소요시간을 입력해주세요.";
    if (!formData.minPet || formData.minPet <= 0)
      newErrors.minPet = "최소 펫 수를 입력해주세요.";
    if (!formData.maxPet || formData.maxPet <= 0)
      newErrors.maxPet = "최대 펫 수를 입력해주세요.";
    if (parseInt(formData.minPet) > parseInt(formData.maxPet))
      newErrors.maxPet = "최대 펫 수는 최소 펫 수보다 커야 합니다.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // 새로운 handleSubmit 함수 - 슬롯 관리 옵션 포함
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // 1. 상품 정보 수정
      await updateProduct(productId, {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        minPet: Number(formData.minPet),
        maxPet: Number(formData.maxPet),
      });

      // 2. 새 슬롯 추가 처리 (슬롯 설정이 있는 경우만)
      if (newSlot.selectedTimes.length > 0 && newSlot.startDate && newSlot.endDate) {
        console.log('새 슬롯 추가');

        const timeSlots = newSlot.selectedTimes.map(timeRange => {
          const [startTime, endTime] = timeRange.split('-');
          return { startTime, endTime };
        });

        await createProductSlots(productId, formData.companyId, {
          startDate: newSlot.startDate,
          endDate: newSlot.endDate,
          timeSlots,
          capacity: newSlot.capacity
        });

        console.log('새 슬롯 추가 완료:', {
          startDate: newSlot.startDate,
          endDate: newSlot.endDate,
          timeSlots,
          capacity: newSlot.capacity
        });
        alert(`${newSlot.selectedTimes.length}개의 새 슬롯이 추가되었습니다.`);
      }

      alert("상품이 성공적으로 수정되었습니다.");
      navigate("/product");
    } catch (error) {
      console.error("상품 수정 실패:", error);
      alert("상품 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm("수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.")
    ) {
      navigate("/product");
    }
  };

  if (loading) {
    return (
      <div className="product-register">
        <div style={{ textAlign: "center", padding: "40px" }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="product-register">
      <div className="header">
        <div className="header-title">
          <div className="header-icon"></div>
          <h1>상품 수정</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="companyId">업체</label>
            <select
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleInputChange}
              className={errors.companyId ? "error" : ""}
            >
              <option value="">업체를 선택하세요</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {errors.companyId && (
              <span className="error-message">{errors.companyId}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="serviceTypeId">서비스 유형</label>
            <select
              id="serviceTypeId"
              name="serviceTypeId"
              value={formData.serviceTypeId}
              onChange={handleInputChange}
              className={errors.serviceTypeId ? "error" : ""}
            >
              <option value="">서비스 유형을 선택하세요</option>
              {serviceCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.serviceTypeId && (
              <span className="error-message">{errors.serviceTypeId}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">상품명 *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="기본 돌봄 서비스"
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="price">가격 (원) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="15000"
              min="0"
              step="100"
              className={errors.price ? "error" : ""}
            />
            {errors.price && (
              <span className="error-message">{errors.price}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="duration">소요시간(분)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              step="1"
              placeholder="소요 시간을 입력하세요"
              className={errors.duration ? "error" : ""}
            />
            {errors.duration && (
              <span className="error-message">{errors.duration}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="minPet">최소 펫 수</label>
            <input
              type="number"
              id="minPet"
              name="minPet"
              value={formData.minPet || ""}
              onChange={handleInputChange}
              min="1"
              max="10"
              placeholder="최소 펫 수"
              className={errors.minPet ? "error" : ""}
            />
            {errors.minPet && (
              <span className="error-message">{errors.minPet}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="maxPet">최대 펫 수</label>
            <input
              type="number"
              id="maxPet"
              name="maxPet"
              value={formData.maxPet || ""}
              onChange={handleInputChange}
              min="1"
              max="10"
              placeholder="최대 펫 수"
              className={errors.maxPet ? "error" : ""}
            />
            {errors.maxPet && (
              <span className="error-message">{errors.maxPet}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">상품 설명</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="산책, 말동무, 돌아주기 등 기본적인 돌봄 서비스입니다."
            rows="4"
            className={errors.description ? "error" : ""}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>


        {/* 새로운 슬롯 관리 섹션 - 옵션 선택 방식 */}
        <div className="form-group slot-management-section">
          <div className="slot-toggle-header" onClick={() => setShowSlotManagement(!showSlotManagement)}>
            <h3 className="slot-toggle-label">
              <span className="slot-icon">📅</span>
              슬롯 관리 ({existingSlots.length}개 등록됨)
            </h3>
            <button className={`toggle-btn ${showSlotManagement ? 'active' : ''}`} type="button">
              {showSlotManagement ? '숨기기' : '보기'}
            </button>
          </div>

          {showSlotManagement && (
            <div className="slot-management-content">


              {/* 삭제 기능 포함 */}
              <div className="existing-slots-section">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                  <h4 style={{margin: 0}}>📋 현재 등록된 슬롯 ({existingSlots.length}개)</h4>
                  {existingSlots.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteAllSlots}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ 전체 삭제
                    </button>
                  )}
                </div>

                {existingSlots.length > 0 ? (
                  <div className="slots-grid">
                    {existingSlots.map(slot => (
                      <div key={slot.id} className="slot-card" style={{position: 'relative'}}>
                        <div className="slot-info">
                          <div className="slot-date">{slot.slotDate}</div>
                          <div className="slot-time">
                            {slot.startDt.split('T')[1].substring(0, 5)} -
                            {slot.endDt.split('T')[1].substring(0, 5)}
                          </div>
                          <div className="slot-capacity">
                            {slot.capacity - slot.booked}마리 여유 (총 {slot.capacity}마리)
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(slot.id)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="이 슬롯 삭제"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-slots-message">
                    등록된 예약 슬롯이 없습니다.
                  </div>
                )}
              </div>

              {/* 새 슬롯 추가 섹션 - 항상 표시 */}
              <div className="add-slots-section">
                <h4>➕ 새 슬롯 추가</h4>
                <div className="slot-form-row">
                  <div className="form-field">
                    <label>시작 날짜</label>
                    <input
                      type="date"
                      value={newSlot.startDate}
                      onChange={(e) => setNewSlot(prev => ({...prev, startDate: e.target.value}))}
                    />
                  </div>
                  <div className="form-field">
                    <label>종료 날짜</label>
                    <input
                      type="date"
                      value={newSlot.endDate}
                      onChange={(e) => setNewSlot(prev => ({...prev, endDate: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="time-selection-section">
                  <label>이용 가능 시간 선택</label>
                  <div className="time-selection">
                    {generateTimeSlots().map(timeSlot => (
                      <button
                        key={timeSlot}
                        type="button"
                        className={`time-option ${
                          newSlot.selectedTimes.includes(timeSlot) ? 'selected' : ''
                        }`}
                        onClick={() => handleNewSlotTimeToggle(timeSlot)}
                      >
                        {timeSlot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-field capacity-field">
                  <label>🐕 수용 가능 펫 수</label>
                  <div className="capacity-input-wrapper">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newSlot.capacity}
                      onChange={(e) => setNewSlot(prev => ({...prev, capacity: parseInt(e.target.value)}))}
                      className="capacity-input"
                    />
                    <span className="capacity-label">마리</span>
                  </div>
                </div>

                <div style={{marginTop: '12px', padding: '12px', background: '#fff3cd', borderRadius: '6px', fontSize: '14px', color: '#856404'}}>
                  <strong>💡 새 슬롯 추가 방법:</strong><br/>
                  1. 시작/종료 날짜를 선택하세요<br/>
                  2. 원하는 시간대를 클릭하세요 (복수 선택 가능)<br/>
                  3. 수용 가능한 펫 수를 입력하세요<br/>
                  4. '수정하기' 버튼을 눌러 저장하세요
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isAllDay"
              checked={formData.isAllDay}
              onChange={handleInputChange}
            />
            <span className="checkbox-text">🌅 종일 상품 (시간 선택 불가)</span>
          </label>
        </div>

        <div className="form-group">
          <label className="checkbox-label active">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <span className="checkbox-text">
              상품 활성화 (비활성화 시 고객에게 노출되지 않음)
            </span>
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-cancel"
            disabled={saving}
          >
            취소
          </button>
          <button type="submit" className="btn-submit" disabled={saving}>
            {saving ? "수정 중..." : "수정하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditPage;
