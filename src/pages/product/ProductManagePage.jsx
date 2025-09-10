import React, { useEffect, useState } from "react";
import "./ProductPage.css";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  getCompanies,
  getProducts,
  getServiceCategories,
} from "../../services/product/productService";

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

  const loadProducts = async () => {
    try {
      const params = {};
      if (searchFilters.companyId) params.companyId = searchFilters.companyId;
      if (searchFilters.serviceType)
        params.serviceType = searchFilters.serviceType;

      const productsData = await getProducts(params);
      setProducts(productsData);
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

  const handleDeleteClick = async (productId) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      try {
        await deleteProduct(productId);
        alert("상품이 삭제되었습니다.");
        loadProducts(); // 목록 세로고침
      } catch (error) {
        console.error("상품 삭제 실패", error);
        alert("상품 삭제에 실패했습니다.");
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-kr").format(price);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours}시간${mins > 0 ? `${mins}분` : ""}`
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
          <div className="header-icon"></div>
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

      <div className="services-section">
        {products.map((product) => (
          <div
            key={product.id}
            className={`service-card ${!product.isActive ? "inactive" : ""}`}
          >
            <div className="service-status"></div>

            <div className="service-header">
              <div className="service-title">
                <span className="service-badge">
                  {product.serviceType || "돌봄"}
                </span>
              </div>
            </div>

            <div className="service-info">
              <div
                className="service-name"
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginBottom: "8px",
                  color: "#333",
                }}
              >
                {product.name}
              </div>
              <div className="service-price">
                <strong>가격 : {formatPrice(product.price)}원</strong>
              </div>
              <div className="service-time">
                소요시간 : {formatTime(product.duration)}
              </div>
              <div className="service-description">{product.description}</div>
            </div>

            <div className="available-times-section">
              <h4>이용 가능 시간:</h4>
              <div className="time-slot">
                {product.availableTimes &&
                  product.availableTimes.map((time, index) => (
                    <span key={index} className="time-slot">
                      {time}
                    </span>
                  ))}
              </div>
            </div>

            <div className="service-meta">
              등록일: {new Date(product.createdAt).toLocaleDateString("ko-KR")} |
              업체 : {product.companyName}
            </div>

            <div className="service-actions">
              <button
                className="btn-secondary"
                onClick={() => handleEditClick(product.id)}
              >
                수정
              </button>
              <button
                className="btn-primary"
                onClick={() => handleDeleteClick(product.id)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
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
