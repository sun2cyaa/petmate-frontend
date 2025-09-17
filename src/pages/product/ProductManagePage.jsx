import React, { useEffect, useState } from "react";
import "./ProductManagePage.css";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import productAnim from "../../assets/lottie/product.json";
import {
  Package,
  Edit3,
  Trash2,
  Clock3,
  CalendarDays,
  Moon,
} from "lucide-react";
import {
  deleteProduct,
  getCompanies,
  getProducts,
  getServiceCategories,
} from "../../services/product/productService";
import { getAvailableSlots } from "../../services/product/availabilitySlotService";

// 서비스 타입 코드를 이름으로 변환하는 함수
const getServiceTypeName = (serviceType) => {
  switch (serviceType) {
    case "C":
      return "돌봄";
    case "W":
      return "산책";
    case "G":
      return "미용";
    case "M":
      return "병원";
    case "E":
      return "기타";
    default:
      return serviceType || "알 수 없음";
  }
};

const ProductManagePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    companyId: "",
    serviceType: "",
  });
  // 슬롯 데이터 상태 추가
  const [slotsData, setSlotsData] = useState({});

  // 초기 데이터
  useEffect(() => {
    loadInitialData();
  }, []);

  // 검색필터 변경시
  useEffect(() => {
    loadProducts();
  }, [searchFilters]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productData, companiesData, categoriesData] = await Promise.all([
        getProducts(),
        getCompanies(),
        getServiceCategories(),
      ]);
      setProducts(productData);
      setCompanies(companiesData);
      setServiceCategories(categoriesData);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      alert("데이터를 불러오는데 실패하였습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 슬롯 정보 조회 함수
  const loadProductSlots = async (productId) => {
    try {
      const slots = await getAvailableSlots(
        productId,
        new Date().toISOString().split("T")[0]
      );
      return slots;
    } catch (error) {
      console.error("슬롯 조회 실패:", error);
      return [];
    }
  };

  // 기존 loadProducts 함수 개선
  const loadProducts = async () => {
    try {
      const params = {};
      if (searchFilters.companyId) params.companyId = searchFilters.companyId;
      if (searchFilters.serviceType)
        params.serviceType = searchFilters.serviceType;

      const productsData = await getProducts(params);
      setProducts(productsData);

      // 각 상품의 슬롯 정보 조회
      const slotsPromises = productsData.map((product) =>
        loadProductSlots(product.id).then((slots) => ({
          productId: product.id,
          slots,
        }))
      );

      const slotsResults = await Promise.all(slotsPromises);
      const slotsMap = {};
      slotsResults.forEach(({ productId, slots }) => {
        slotsMap[productId] = slots;
      });
      setSlotsData(slotsMap);
    } catch (error) {
      console.error("상품 목록 조회에 실패하였습니다.", error);
    }
  };

  const handleSearchFilterChange = (key, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRegisterClick = () => {
    navigate("/product/register");
  };

  const handleEditClick = (productid) => {
    navigate(`/product/edit/${productid}`);
  };

  // 새로운 handleDeleteClick 함수 - 슬롯 정보 포함 확인
  const handleDeleteClick = async (productId) => {
    try {
      const slots = slotsData[productId] || [];
      const product = products.find((p) => p.id === productId);

      let confirmMessage = `정말로 "${product.name}" 상품을 삭제하시겠습니까?`;

      if (slots.length > 0) {
        const bookedSlots = slots.filter((slot) => slot.booked > 0).length;

        confirmMessage += `\n\n📅 슬롯 정보:`;
        confirmMessage += `\n• 총 등록된 슬롯: ${slots.length}개`;

        if (bookedSlots > 0) {
          confirmMessage += `\n• ⚠️ 예약된 슬롯: ${bookedSlots}개`;
          confirmMessage += `\n\n경고: 예약된 슬롯이 있습니다!`;
          confirmMessage += `\n정말 모든 슬롯과 함께 삭제하시겠습니까?`;
        } else {
          confirmMessage += `\n• 예약된 슬롯: 없음`;
          confirmMessage += `\n\n모든 슬롯도 함께 삭제됩니다.`;
        }
      } else {
        confirmMessage += `\n\n등록된 슬롯이 없습니다.`;
      }

      if (window.confirm(confirmMessage)) {
        await deleteProduct(productId);
        alert("상품과 관련 슬롯이 모두 삭제되었습니다.");
        loadProducts(); // 목록 새로고침
      }
    } catch (error) {
      console.error("상품 삭제 실패", error);
      alert("상품 삭제에 실패했습니다: " + error.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-kr").format(price);
  };

  const formatTime = (minutes) => {
    if (!minutes) return "정보 없음";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours}시간${mins > 0 ? ` ${mins}분` : ""}`
      : `${mins}분`;
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
      <div className="header">
        <div className="header-title">
          <div className="header-lottie">
        <Lottie
          animationData={productAnim}
          loop
          speed={1.2}
          style={{ width: 200, height: 200 }}
        />
      </div>
          <h2>상품 관리</h2>
        </div>
        <p>고객에게 제공할 서비스 상품을 관리하세요</p>
      </div>

      <div className="search-section">
        <div className="search-row">
          <div className="search-field">
            <label htmlFor="company-select">업체 선택</label>
            <select
              id="company-select"
              value={searchFilters.companyId}
              onChange={(e) =>
                handleSearchFilterChange("companyId", e.target.value)
              }
            >
              <option value="">전체</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-field">
            <label htmlFor="service-select">서비스 유형</label>
            <select
              id="service-select"
              value={searchFilters.serviceType}
              onChange={(e) =>
                handleSearchFilterChange("serviceType", e.target.value)
              }
            >
              <option value="">전체</option>
              {serviceCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="register-btn" onClick={() => handleRegisterClick()}>
          새 상품 등록하기
        </button>
      </div>

      {/* 서비스 섹션 */}
      <div className="services-section">
        {products.map((product) => {
          const productSlots = slotsData[product.id] || [];
          const todaySlots = productSlots.filter(
            (slot) => slot.slotDate === new Date().toISOString().split("T")[0]
          );

          return (
            <div
              key={product.id}
              className={`service-card ${!product.isActive ? "inactive" : ""}`}
            >
              <div className="service-status"></div>

              <div className="service-header">
                <div className="service-title">
                  <span className="service-badge">
                    {product.serviceTypeName ||
                      getServiceTypeName(product.serviceType)}
                  </span>
                </div>
              </div>

              <div className="service-info">
                <div className="service-name">{product.name}</div>
                <div className="service-price">
                  <strong>가격: {formatPrice(product.price)}원</strong>
                </div>
                <div className="service-time">
                  소요시간:{" "}
                  {product.durationMin
                    ? formatTime(product.durationMin)
                    : "정보 없음"}
                </div>
                <div className="service-description">
                  {product.introText || "설명이 없습니다."}
                </div>
              </div>

              {/* 이용 가능 시간 섹션 */}
              <div className="available-times-section">
                <h4>
                  <Clock3 size={16} className="section-icon" />
                  오늘 이용 가능 시간
                </h4>
                {todaySlots.length > 0 ? (
                  <div className="time-slots">
                    {todaySlots.map((slot, index) => (
                      <div key={index} className="time-slot">
                        <span className="time-text">
                          {slot.startDt.split("T")[1].substring(0, 5)}
                        </span>
                        <span className="capacity-badge">
                          {slot.capacity - slot.booked}자리
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-times-available">
                    <Moon size={16} className="no-times-icon" />
                    오늘은 예약 불가
                  </div>
                )}

                {productSlots.length > todaySlots.length && (
                  <div className="more-slots-info">
                    <CalendarDays size={16} className="info-icon" />
                    총 {productSlots.length}개 슬롯 등록됨
                  </div>
                )}
              </div>

              <div className="service-meta">
                등록일:{" "}
                {new Date(product.createdAt).toLocaleDateString("ko-KR")} | 업체:{" "}
                {product.companyName}
              </div>

              <div className="service-actions">
                <button
                  className="btn-secondary"
                  onClick={() => handleEditClick(product.id)}
                >
                  <Edit3 size={16} className="btn-icon" />
                  수정
                </button>
                <button
                  className="btn-primary"
                  onClick={() => handleDeleteClick(product.id)}
                >
                  <Trash2 size={16} className="btn-icon" />
                  삭제
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          등록된 상품이 없습니다.
        </div>
      )}
    </div>
  );
};

export default ProductManagePage;
