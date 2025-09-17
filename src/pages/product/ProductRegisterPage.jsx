import React, { useEffect, useState } from "react";
import "./ProductRegisterPage.css";
import { useNavigate } from "react-router-dom";
import {
  PackagePlus,
  CalendarDays,
  Sunrise,
  Clock,
  CheckCircle2,
  Dog,
  Tag,
  Users,
} from "lucide-react";

import {
  createProduct,
  getCompanies,
  getServiceCategories,
} from "../../services/product/productService";
import { createProductSlots } from "../../services/product/availabilitySlotService";

const ProductRegisterPage = () => {
  const navigate = useNavigate();
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
    isAllDay: false,
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const [slotSettings, setSlotSettings] = useState({
    startDate: "",
    endDate: "",
    selectedTimes: [],
    capacity: 1,
  });

  // 30분 단위 시간 생성
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const endHour = minute === 30 ? hour + 1 : hour;
        const endMinute = minute === 30 ? 0 : 30;
        const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute
          .toString()
          .padStart(2, "0")}`;

        slots.push(`${startTime}-${endTime}`);
      }
    }
    return slots;
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [companiesData, categoriesData] = await Promise.all([
        getCompanies(),
        getServiceCategories(),
      ]);

      setCompanies(companiesData);
      setServiceCategories(categoriesData);
    } catch (error) {
      console.error("데이터 로드 실패", error);
      alert("데이터를 불러오는데 실패하였습니다.");
      navigate("/product");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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
    if (!formData.duration || formData.duration <= 0)
      newErrors.duration = "올바른 소요시간을 입력해주세요.";
    if (!formData.minPet || formData.minPet <= 0)
      newErrors.minPet = "최소 펫 수를 입력해주세요.";
    if (!formData.maxPet || formData.maxPet <= 0)
      newErrors.maxPet = "최대 펫 수를 입력해주세요.";
    if (parseInt(formData.minPet) > parseInt(formData.maxPet))
      newErrors.maxPet = "최대 펫 수는 최소 펫 수보다 커야 합니다.";

    if (slotSettings.selectedTimes.length > 0) {
      if (!slotSettings.startDate)
        newErrors.startDate = "시작 날짜를 선택해주세요.";
      if (!slotSettings.endDate) newErrors.endDate = "종료 날짜를 선택해주세요.";
      if (slotSettings.capacity <= 0)
        newErrors.capacity = "수용 인원을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const createdProduct = await createProduct({
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        minPet: Number(formData.minPet),
        maxPet: Number(formData.maxPet),
        companyId: Number(formData.companyId),
      });

      if (slotSettings.selectedTimes.length > 0) {
        const timeSlots = slotSettings.selectedTimes.map((timeRange) => {
          const [startTime, endTime] = timeRange.split("-");
          return { startTime, endTime };
        });

        await createProductSlots(createdProduct.id, formData.companyId, {
          startDate: slotSettings.startDate,
          endDate: slotSettings.endDate,
          timeSlots,
          capacity: slotSettings.capacity,
        });
      }

      alert("상품과 시간 슬롯이 성공적으로 등록되었습니다.");
      navigate("/product");
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm("등록을 취소하시겠습니까? 입력한 내용은 모두 사라집니다.")
    ) {
      navigate("/product");
    }
  };

  const handleReset = () => {
    if (window.confirm("입력한 내용을 모두 초기화하시겠습니까?")) {
      setFormData({
        companyId: "",
        serviceTypeId: "",
        name: "",
        description: "",
        price: "",
        duration: "",
        minPet: "1",
        maxPet: "1",
        isAllDay: false,
        isActive: true,
      });
      setErrors({});
    }
  };

  const handleAllDayChange = (e) => {
    const isAllDay = e.target.checked;

    if (isAllDay) {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setDate(today.getDate() + 30);

      const startDate = today.toISOString().split("T")[0];
      const endDate = nextMonth.toISOString().split("T")[0];

      setSlotSettings((prev) => ({
        ...prev,
        startDate,
        endDate,
        selectedTimes: ["09:00-18:00"],
        capacity: 1,
      }));

      alert("종일 상품으로 설정되어 30일 기간이 자동 선택되었습니다.");
    } else {
      setSlotSettings((prev) => ({
        ...prev,
        startDate: "",
        endDate: "",
        selectedTimes: [],
      }));
    }

    setFormData((prev) => ({
      ...prev,
      isAllDay: isAllDay,
    }));
  };

  if (loading) {
    return (
      <div className="product-management">
        <div style={{ textAlign: "center", padding: "40px" }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="product-register_wrap">
      <div className="register-header">
        <div className="header-title">
          <div className="header-icon">
            <PackagePlus size={22} />
          </div>
          <h2>상품 등록</h2>
        </div>
        <p>새로운 서비스 상품을 등록하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="companyId">업체 선택 *</label>
              <select
                id="companyId"
                name="companyId"
                value={formData.companyId}
                onChange={handleInputChange}
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
            <div className="form-field">
              <label htmlFor="serviceTypeId">서비스 유형</label>
              <select
                id="serviceTypeId"
                name="serviceTypeId"
                value={formData.serviceTypeId}
                onChange={handleInputChange}
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

          {/* 상품명 */}
          <div className="form-field">
            <label htmlFor="name">상품명</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              placeholder="상품명을 입력하세요"
              className={errors.name ? "error" : ""}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          {/* 상품 설명 */}
          <div className="form-field">
            <label htmlFor="description">상품 설명</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="상품에 대한 자세한 설명을 입력하세요"
              rows="4"
              className={errors.description ? "error" : ""}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          {/* 가격 + 소요시간 */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="price">
                <Tag size={16} /> 가격(원)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ""}
                onChange={handleInputChange}
                placeholder="가격을 입력하세요"
                min="0"
                step="100"
                className={errors.price ? "error" : ""}
              />
              {errors.price && (
                <span className="error-message">{errors.price}</span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="duration">
                <Clock size={16} /> 소요 시간(분)
              </label>
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

          {/* 최소펫/최대펫 */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="minPet">
                <Dog size={16} /> 최소 펫 수
              </label>
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
            <div className="form-field">
              <label htmlFor="maxPet">
                <Dog size={16} /> 최대 펫 수
              </label>
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

          {/* 슬롯 설정 섹션 */}
          <div className="form-section slot-settings-section">
            <h3 className="section-title">
              <CalendarDays size={18} /> 예약 슬롯 설정
            </h3>

            <div className="form-field">
              <label className="checkbox-label all-day-label">
                <input
                  type="checkbox"
                  name="isAllDay"
                  checked={formData.isAllDay}
                  onChange={handleAllDayChange}
                />
                <span className="checkbox-text">
                  <Sunrise size={16} /> 종일 상품 (자동으로 30일 기간 설정)
                </span>
              </label>
            </div>

            <div
              className={`date-selection-row ${
                formData.isAllDay ? "auto-selected" : ""
              }`}
            >
              <div className="form-field">
                <label>
                  <CalendarDays size={16} /> 시작 날짜
                  {formData.isAllDay && (
                    <span className="auto-label">(자동 설정)</span>
                  )}
                </label>
                <input
                  type="date"
                  value={slotSettings.startDate}
                  onChange={(e) =>
                    setSlotSettings((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  disabled={formData.isAllDay}
                  className={formData.isAllDay ? "auto-selected" : ""}
                />
              </div>
              <div className="form-field">
                <label>
                  <CalendarDays size={16} /> 종료 날짜
                  {formData.isAllDay && (
                    <span className="auto-label">(자동 설정)</span>
                  )}
                </label>
                <input
                  type="date"
                  value={slotSettings.endDate}
                  onChange={(e) =>
                    setSlotSettings((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  disabled={formData.isAllDay}
                  className={formData.isAllDay ? "auto-selected" : ""}
                />
              </div>
            </div>

            <div className="form-field">
              <label>
                <Clock size={16} /> 이용 가능 시간 *
                {formData.isAllDay && (
                  <span className="auto-label">(종일 자동 설정)</span>
                )}
              </label>
              <div className="time-selection">
                {generateTimeSlots().map((timeSlot) => (
                  <button
                    key={timeSlot}
                    type="button"
                    disabled={formData.isAllDay}
                    className={`time-option ${
                      slotSettings.selectedTimes.includes(timeSlot)
                        ? "selected"
                        : ""
                    } ${formData.isAllDay ? "disabled" : ""}`}
                    onClick={() => {
                      if (!formData.isAllDay) {
                        setSlotSettings((prev) => ({
                          ...prev,
                          selectedTimes: prev.selectedTimes.includes(timeSlot)
                            ? prev.selectedTimes.filter((t) => t !== timeSlot)
                            : [...prev.selectedTimes, timeSlot],
                        }));
                      }
                    }}
                  >
                    {timeSlot}
                  </button>
                ))}
              </div>
              <div className="selected-times-summary">
                <CheckCircle2 size={16} /> 선택된 시간:{" "}
                {slotSettings.selectedTimes.length > 0
                  ? slotSettings.selectedTimes.join(", ")
                  : "없음"}
              </div>
            </div>

            <div className="form-field capacity-field">
              <label>
                <Dog size={16} /> 수용 가능 펫 수
              </label>
              <div className="capacity-input-wrapper">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={slotSettings.capacity}
                  onChange={(e) =>
                    setSlotSettings((prev) => ({
                      ...prev,
                      capacity: parseInt(e.target.value),
                    }))
                  }
                  className="capacity-input"
                />
                <span className="capacity-label">마리</span>
              </div>
            </div>
          </div>

          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span className="checkbox-text">등록과 동시에 활성화</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleReset}
            disabled={saving}
          >
            초기화
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={saving}
          >
            취소
          </button>
          <button className="btn-submit" type="submit" disabled={saving}>
            {saving ? "등록 중..." : "상품 등록"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductRegisterPage;
