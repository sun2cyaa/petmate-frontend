// product/ProductEditPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductPage.css";
import {
  getProduct,
  updateProduct,
  getCompanies,
  getServiceCategories,
} from "../../services/product/productService";

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
    availableTimes: [],
    isActive: true,
    isAllDay: false,
  });

  const [errors, setErrors] = useState({});

  // 사용 가능한 시간 옵션
  const timeOptions = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  useEffect(() => {
    loadInitialData();
  }, [productId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productData, companiesData, categoriesData] = await Promise.all([
        getProduct(productId),
        getCompanies(),
        getServiceCategories(),
      ]);

      setFormData({
        companyId: productData.companyId || "",
        serviceTypeId: productData.serviceTypeId || "",
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price || "",
        duration: productData.duration || "",
        availableTimes: productData.availableTimes || [],
        isActive:
          productData.isActive !== undefined ? productData.isActive : true,
        isAllDay: productData.isAllDay || false,
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

  const handleTimeToggle = (time) => {
    setFormData((prev) => ({
      ...prev,
      availableTimes: prev.availableTimes.includes(time)
        ? prev.availableTimes.filter((t) => t !== time)
        : [...prev.availableTimes, time].sort(),
    }));
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
    if (!formData.isAllDay && formData.availableTimes.length === 0) {
      newErrors.availableTimes =
        "종일 상품이 아닌 경우 최소 하나의 이용 가능 시간을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      await updateProduct(productId, {
        ...formData,
        price: Number(formData.price),
      });

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
              <option value="">김밥시티 개인사업</option>
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
              <option value="">돌봄</option>
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
            <label htmlFor="duration">소요시간</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="1시간"
              className={errors.duration ? "error" : ""}
            />
            {errors.duration && (
              <span className="error-message">{errors.duration}</span>
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

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isAllDay"
              checked={formData.isAllDay}
              onChange={handleInputChange}
            />
            <span className="checkbox-text">종일 상품 (시간 선택 불가)</span>
          </label>
        </div>

        <div className="form-group">
          <label>이용 가능 시간:</label>
          <div className="available-times-note">
            고객이 선택할 수 있는 시간대
          </div>
          <div className="time-selection-grid">
            {timeOptions.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleTimeToggle(time)}
                disabled={formData.isAllDay}
                className={`time-option-btn ${
                  formData.availableTimes.includes(time) ? "selected" : ""
                } ${formData.isAllDay ? "disabled" : ""}`}
              >
                {time}
              </button>
            ))}
          </div>
          {errors.availableTimes && (
            <span className="error-message">{errors.availableTimes}</span>
          )}
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
