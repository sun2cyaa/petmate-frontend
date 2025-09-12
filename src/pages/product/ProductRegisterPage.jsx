import React, { useEffect, useState } from "react";
import "./ProductPage.css";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  getCompanies,
  getServiceCategories,
} from "../../services/product/productService";

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
    isAllDay: false, // 백엔드의 allDay 필드에 해당
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  // 사용 가능한 시간(임시)
  const timeOptions = [
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

    // 에러 메세지
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // const handleTimeToggle = (time) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     availableTimes: prev.availableTimes.includes(time)
  //       ? prev.availableTimes.filter((t) => t !== time)
  //       : [...prev.availableTimes, time].sort(),
  //   }));

  //   // 에러 메세지 제거
  //   if (errors.availableTimes) {
  //     setErrors((prev) => ({ ...prev, availableTimes: "" }));
  //   }
  // };

  const validateForm = () => {
    const newErrors = {};

    // if (!formData.companyId) newErrors.companyId = "업체를 선택해주세요.";
    // if (!formData.serviceTypeId)
    //   newErrors.serviceTypeId = "서비스 유형을 선택해주세요.";
    // if (!formData.name.trim()) newErrors.name = "상품명을 입력해주세요.";
    // if (!formData.description.trim())
    //   newErrors.description = "상품 설명을 입력해주세요.";
    // if (!formData.price || formData.price <= 0)
    //   newErrors.price = "올바른 가격을 입력해주세요.";
    // if (!formData.duration || formData.duration <= 0)
    //   newErrors.duration = "올바른 소요시간을 입력해주세요.";
    // if (formData.availableTimes.length === 0)
    //   newErrors.availableTimes = "최소 하나의 이용 가능 시간을 선택해주세요.";

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
      await createProduct({
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
      });
      alert("상품이 성공적으로 등록되었습니다.");
      navigate("/product");
    } catch (error) {
      console.error("상품 등록 실패 : ", error);
      alert("상품 등록에 실패하였습니다.");
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
        availableTimes: [],
        isActive: true,
      });
      setErrors({});
    }
  };

  if (loading) {
    return (
      <div className="product-management">
        <div style={{ textAlign: "center", padding: "40px" }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="product-manage_wrap">
      <div className="product-header">
        <div className="header-title">
          <div className="header-icon"></div>
          <h2>상품 등록</h2>
        </div>
        <p>새로운 서비스 상품을 등록하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="company-name">업체 선택 *</label>
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
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="price">가격(원)</label>
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
              <label htmlFor="duration">소요 시간(분)</label>
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
          {/* <div className="form-field">
            <label>이용 가능 시간 *</label>
            <div className="time-selection">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeToggle(time)}
                  className={`time-option ${
                    formData.availableTimes.includes(time) ? "selected" : ""
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {errors.availableTimes && (
              <span className="error-message">{errors.availableTimes}</span>
            )}
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
              선택된 시간 : {formData.availableTimes.join(",") || "없음"}
            </div>
          </div> */}
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isAllDay"
                checked={formData.isAllDay}
                onChange={handleInputChange}
              />
              <span className="checkbox-text">종일 상품 (하루종일 이용 가능)</span>
            </label>
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
