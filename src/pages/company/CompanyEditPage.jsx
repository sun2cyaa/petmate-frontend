// src/pages/company/CompanyEditPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CompanyRegisterPage.css";
import { updateCompany, getCompanyById, checkBusinessNumber } from "../../services/companyService";
import MapModal from "../user/owner/MyPage/Address/components/MapModal";
import { ImageUploadViewer } from "../../util/ImageUtil";

// 코드↔라벨 매핑 (백엔드와 동일한 숫자 코드 사용)
const SERVICE_LABELS = { 
  "1": "돌봄", 
  "2": "산책", 
  "3": "미용", 
  "4": "병원", 
  "9": "기타" 
};
const SERVICE_CODES = {
  "돌봄": "1",
  "산책": "2", 
  "미용": "3",
  "병원": "4",
  "기타": "9"
};
const toServiceLabel = (val) => SERVICE_LABELS[val] ?? val ?? "";
const toServiceCode = (val) => SERVICE_CODES[val] ?? val ?? "";

function CompanyEditPage() {
  const { id: idParam } = useParams();
  const companyId = idParam ? String(idParam) : null;
  const navigate = useNavigate();

  const serviceCategories = ["돌봄", "산책", "미용", "병원", "기타"];
  const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
  const makeDefault = () =>
    Object.fromEntries(days.map((d) => [d, { open: "09:00", close: "18:00", closed: false }]));
  const clone = (obj) =>
    typeof structuredClone === "function" ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));

  // UI
  const [loading, setLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);

  // 라디오/식별정보 잠금
  const [isTypeLocked, setIsTypeLocked] = useState(false);
  const [isIdBlockLocked, setIsIdBlockLocked] = useState(false);

  // 유형
  const [companyType, setCompanyType] = useState("PERSONAL"); // PERSONAL | BUSINESS

  // 서비스/시간
  const [checkService, setCheckService] = useState({
    전체: false,
    돌봄: false,
    산책: false,
    미용: false,
    병원: false,
    기타: false,
  });
  const [allDay, setAllDay] = useState(false);
  const [time, setTime] = useState(() => makeDefault());
  const backupRef = useRef(null);
  const [files, setFiles] = useState([]);

  // 폼
  const [formInputs, setFormInputs] = useState({
    // 개인(일반인)
    ssnFirst: "",
    ssnSecond: "",
    personalName: "",
    // 개인/법인사업자
    businessNumber: "",
    corporationName: "",
    representativeName: "",
    // 공통
    roadAddr: "",
    detailAddr: "",
    postcode: "",
    latitude: "",
    longitude: "",
    mainService: "",
    phone1: "",
    phone2: "",
    phone3: "",
    introduction: "",
  });

  // refs
  const ssnSecondRef = useRef(null);
  const telSecondRef = useRef(null);
  const telThirdRef = useRef(null);

  // 외부 스크립트
  useEffect(() => {
    if (!window.daum) {
      const s = document.createElement("script");
      s.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      document.head.appendChild(s);
    }
    if (!window.kakao) {
      const s = document.createElement("script");
      s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&libraries=services`;
      document.head.appendChild(s);
    }
  }, []);

  // 데이터 로드
  useEffect(() => {
    const loadCompany = async () => {
      if (!companyId) {
        alert("잘못된 접근입니다. (id 없음)");
        navigate("/companymanage");
        return;
      }
      try {
        const c = await getCompanyById(companyId);

        // 유형 결정 및 잠금 - DB의 type 필드 기준으로 설정
        const dbType = c?.type || "";
        const lockedType = dbType === "B" ? "BUSINESS" : "PERSONAL";
        setCompanyType(lockedType);
        setIsTypeLocked(true); // 라디오 버튼 변경 불가
        setIsIdBlockLocked(true); // 식별 정보 변경 불가

        // 전화번호
        const tel = c?.tel || "";
        const [p1 = "", p2 = "", p3 = ""] = tel.split("-");

        // 주소
        const lat = c?.lat ?? c?.latitude;
        const lng = c?.lng ?? c?.longitude;

        // 개인 정보 처리
        const ssnFirst = c?.ssnFirst || "";
        const ssnSecond = c?.ssnSecond || "";
        const personalName = c?.personalName || "";

        // 사업자 정보 처리
        const corporationName = c?.name || "";
        const repName = c?.repName || "";
        const bizRegNo = c?.bizRegNo || "";

        // 대표 서비스 (백엔드에서 repService 필드로 숫자 코드 전송)
        const rawMainService = c?.repService ?? "";
        const normalizedMainService = toServiceLabel(rawMainService);

        // 제공 서비스
        if (c?.services) {
          const services = typeof c.services === "string" ? JSON.parse(c.services) : c.services;
          const normalized = serviceCategories.reduce(
            (acc, s) => ({ ...acc, [s]: !!services[s] }),
            {}
          );
          const allChecked = serviceCategories.every((s) => normalized[s]);
          setCheckService({ 전체: allChecked, ...normalized });
        }

        // 운영시간
        if (c?.operatingHours) {
          const oh =
            typeof c.operatingHours === "string"
              ? JSON.parse(c.operatingHours)
              : c.operatingHours;
          setAllDay(Boolean(oh?.allDay));
          setTime(oh?.schedule ?? makeDefault());
        } else {
          setAllDay(false);
          setTime(makeDefault());
        }

        setFormInputs({
          // 개인(일반인) 정보
          ssnFirst: ssnFirst,
          ssnSecond: ssnSecond,
          personalName: personalName,
          // 사업자 정보
          businessNumber: formatBusinessNumber(bizRegNo),
          corporationName: corporationName,
          representativeName: repName,
          // 공통
          roadAddr: c?.roadAddr ?? "",
          detailAddr: c?.detailAddr ?? "",
          postcode: c?.postcode ?? "",
          latitude: lat != null ? String(lat) : "",
          longitude: lng != null ? String(lng) : "",
          mainService: normalizedMainService,
          phone1: p1,
          phone2: p2,
          phone3: p3,
          introduction: c?.descText ?? "",
        });

        setLoading(false);
      } catch (e) {
        console.error("업체 정보 로드 오류:", e);
        alert("업체 정보를 불러오는 중 오류가 발생했습니다.");
        navigate("/companymanage");
      }
    };
    loadCompany();
  }, [companyId, navigate]);

  // 핸들러
  const handleInputChange = (field, value) => setFormInputs((p) => ({ ...p, [field]: value }));
  const handleNumericInput = (v, max) => v.replace(/[^0-9]/g, "").slice(0, max);

  const handleSsnFirstInput = (e) => {
    const v = handleNumericInput(e.target.value, 6);
    handleInputChange("ssnFirst", v);
    if (v.length === 6) ssnSecondRef.current?.focus();
  };
  const handleSsnSecondInput = (e) => {
    const v = handleNumericInput(e.target.value, 7);
    handleInputChange("ssnSecond", v);
  };
  const handleTelFirstInput = (e) => {
    const v = handleNumericInput(e.target.value, 3);
    handleInputChange("phone1", v);
    if (v.length === 3) telSecondRef.current?.focus();
  };
  const handleTelSecondInput = (e) => {
    const v = handleNumericInput(e.target.value, 4);
    handleInputChange("phone2", v);
    if (v.length === 4) telThirdRef.current?.focus();
  };
  const handleTelThirdInput = (e) => {
    const v = handleNumericInput(e.target.value, 4);
    handleInputChange("phone3", v);
  };

  const formatBusinessNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
  };
  const handleBusinessNumberInput = (e) =>
    handleInputChange("businessNumber", formatBusinessNumber(e.target.value));

  const handleBizNoSearchBtnClick = async () => {
    const clean = (formInputs.businessNumber || "").replace(/[^0-9]/g, "");
    if (!clean || clean.length !== 10) {
      alert("올바른 사업자등록번호(10자리)를 입력하세요.");
      return;
    }
    try {
      const result = await checkBusinessNumber(clean);
      if (result) {
        handleInputChange("corporationName", result.companyName || "");
        handleInputChange("representativeName", result.representativeName || "");
        alert(
          `사업자 조회 완료\n상호명: ${result.companyName || "-"}\n대표자: ${
            result.representativeName || "-"
          }`
        );
      } else {
        alert("조회 결과가 없습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("사업자 조회 중 오류가 발생했습니다.");
    }
  };

  // 주소/지도
  const handleAddressSearchBtnClick = () => {
    if (!window.daum) {
      alert("주소 검색 로드 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        const addr = data.address;
        const postcode = data.zonecode;
        handleInputChange("roadAddr", addr);
        handleInputChange("postcode", postcode);
        if (window.kakao?.maps?.services) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(addr, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const latitude = parseFloat(result[0].y);
              const longitude = parseFloat(result[0].x);
              handleInputChange("latitude", String(latitude));
              handleInputChange("longitude", String(longitude));
              setShowMapModal(true);
            }
          });
        }
      },
    }).open();
  };
  const handleLocationSelect = (loc) => {
    handleInputChange("roadAddr", loc.address);
    if (loc.postcode) handleInputChange("postcode", loc.postcode);
    handleInputChange("latitude", String(loc.latitude));
    handleInputChange("longitude", String(loc.longitude));
    setShowMapModal(false);
  };
  const handleCloseMapModal = () => setShowMapModal(false);

  // 제공 서비스 체크
  const handleAllServiceChange = (e) => {
    const chk = e.target.checked;
    const next = {};
    serviceCategories.forEach((s) => (next[s] = chk));
    setCheckService({ 전체: chk, ...next });
  };
  const handleServiceChange = (e) => {
    const { name, checked } = e.target;
    setCheckService((prev) => {
      const updated = { ...prev, [name]: checked };
      updated.전체 = serviceCategories.every((s) => updated[s]);
      return updated;
    });
  };

  // 운영시간
  const handleAllTimeChange = (e) => {
    const chk = e.target.checked;
    setAllDay(chk);
    if (chk) {
      setTime((prev) => {
        const base = prev ?? makeDefault();
        backupRef.current = clone(base);
        const next = { ...base };
        days.forEach((d) => (next[d] = { open: "00:00", close: "23:59", closed: false }));
        return next;
      });
    } else {
      setTime((prev) => {
        const restored = backupRef.current ?? prev ?? makeDefault();
        backupRef.current = null;
        return restored;
      });
    }
  };
  const handleTimeChange = (day, field, value) =>
    setTime((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  const handleClosedChange = (day, checked) =>
    setTime((prev) => ({ ...prev, [day]: { ...prev[day], closed: checked } }));

  // 유효성
  const validateForm = () => {
    if (companyType === "PERSONAL") {
      if (
        !formInputs.ssnFirst ||
        formInputs.ssnFirst.length !== 6 ||
        !formInputs.ssnSecond ||
        formInputs.ssnSecond.length !== 7 ||
        !formInputs.personalName.trim()
      ) {
        return false;
      }
    } else {
      if (
        !formInputs.businessNumber.trim() ||
        !formInputs.corporationName.trim() ||
        !formInputs.representativeName.trim()
      ) {
        return false;
      }
    }
    if (
      !formInputs.roadAddr.trim() ||
      !formInputs.mainService ||
      !formInputs.phone1 ||
      formInputs.phone1.length !== 3 ||
      !formInputs.phone2 ||
      formInputs.phone2.length !== 4 ||
      !formInputs.phone3 ||
      formInputs.phone3.length !== 4
    ) {
      return false;
    }
    const selected = Object.entries(checkService).filter(([k, v]) => k !== "전체" && v === true);
    if (selected.length === 0) return false;
    return true;
  };

  // 취소/저장
  const handleCancel = () => {
    if (window.confirm("업체 수정을 취소하시겠습니까?")) navigate("/companymanage");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("입력되지 않은 정보가 있습니다.");
      return;
    }
    if (!companyId) {
      alert("잘못된 접근입니다. (id 없음)");
      return;
    }
    if (window.confirm("업체 정보를 수정하시겠습니까?")) {
      try {
        const fd = new FormData();

        // 유형(잠금 상태 유지)
        fd.append("type", companyType === "BUSINESS" ? "BUSINESS" : "PERSONAL");

        if (companyType === "PERSONAL") {
          fd.append("ssnFirst", formInputs.ssnFirst);
          fd.append("ssnSecond", formInputs.ssnSecond);
          fd.append("personalName", formInputs.personalName);
        } else {
          const cleanBiz = (formInputs.businessNumber || "").replace(/[^0-9]/g, "");
          fd.append("bizRegNo", cleanBiz);
          fd.append("name", formInputs.corporationName);
          fd.append("repName", formInputs.representativeName);
        }

        // 공통
        fd.append("roadAddr", formInputs.roadAddr);
        fd.append("detailAddr", formInputs.detailAddr);
        fd.append("postcode", formInputs.postcode);
        fd.append("latitude", formInputs.latitude);
        fd.append("longitude", formInputs.longitude);

        const tel = `${formInputs.phone1}-${formInputs.phone2}-${formInputs.phone3}`;
        fd.append("tel", tel);

        // 대표 서비스(코드로 저장 필요 시)
        fd.append("repService", toServiceCode(formInputs.mainService));
        // 필요 시 라벨 저장이면 아래로 교체:
        // fd.append("repService", formInputs.mainService);

        fd.append("services", JSON.stringify(checkService));
        fd.append("operatingHours", JSON.stringify({ allDay, schedule: time }));

        // 소개(호환용 키 동시 전송)
        fd.append("introduction", formInputs.introduction);
        fd.append("descText", formInputs.introduction);

        const result = await updateCompany(companyId, fd);
        if (result) {
          alert("업체 정보가 수정되었습니다!");
          navigate("/companymanage");
        }
      } catch (e) {
        console.error("업체 수정 중 오류:", e);
        alert("수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="company_register_page">
      <div className="company_register_main">
        <div className="company_register_content">
          {/* 헤더 */}
          <div className="section-header">
            <div className="header_info">
              <h2 className="section-title">업체 수정</h2>
              <p className="section-subtitle">펫케어 업체 정보를 수정하세요</p>
            </div>
          </div>

          {/* 업체 구분 (잠금) */}
          <div className="company_register_section">
            <h3>업체 구분</h3>
            <div className="radio_group">
              <label className={`radio_item ${isTypeLocked ? "locked" : ""}`}>
                <input
                  type="radio"
                  name="company_type"
                  value="PERSONAL"
                  checked={companyType === "PERSONAL"}
                  onChange={(e) => !isTypeLocked && setCompanyType(e.target.value)}
                  disabled={isTypeLocked}
                />
                <span>개인(일반인)</span>
              </label>
              <label className={`radio_item ${isTypeLocked ? "locked" : ""}`}>
                <input
                  type="radio"
                  name="company_type"
                  value="BUSINESS"
                  checked={companyType === "BUSINESS"}
                  onChange={(e) => !isTypeLocked && setCompanyType(e.target.value)}
                  disabled={isTypeLocked}
                />
                <span>개인/법인사업자</span>
              </label>
            </div>

            {/* 유형별 식별 영역 (읽기전용) */}
            {companyType === "PERSONAL" ? (
              <div className="company_form_grid">
                <div className="company_form_group">
                  <span>주민등록번호</span>
                  <div className="ssn_input_group">
                    <input
                      type="text"
                      className="form_input"
                      maxLength={6}
                      value={formInputs.ssnFirst}
                      onChange={handleSsnFirstInput}
                      readOnly={isIdBlockLocked}
                    />
                    -
                    <input
                      type="password"
                      className="form_input"
                      maxLength={7}
                      value={formInputs.ssnSecond}
                      onChange={handleSsnSecondInput}
                      ref={ssnSecondRef}
                      readOnly={isIdBlockLocked}
                    />
                  </div>
                </div>
                <div className="company_form_group">
                  <span>성함</span>
                  <input
                    type="text"
                    className="form_input"
                    placeholder="홍길동"
                    value={formInputs.personalName}
                    onChange={(e) => handleInputChange("personalName", e.target.value)}
                    readOnly={isIdBlockLocked}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="company_form_grid">
                  <div className="company_form_group" style={{ gridColumn: "1 / -1" }}>
                    <span>사업자등록번호</span>
                    <div className="input_button_group">
                      <input
                        type="text"
                        className="form_input"
                        placeholder="123-45-67890"
                        value={formInputs.businessNumber}
                        onChange={handleBusinessNumberInput}
                        maxLength={12}
                        readOnly={isIdBlockLocked}
                      />
                      <button
                        type="button"
                        className="search_btn"
                        onClick={handleBizNoSearchBtnClick}
                        disabled={isIdBlockLocked}
                        title={isIdBlockLocked ? "수정 시 사업자번호 조회/변경 불가" : ""}
                      >
                        사업장 조회
                      </button>
                    </div>
                  </div>
                </div>
                <div className="company_form_grid">
                  <div className="company_form_group">
                    <span>상호명</span>
                    <input
                      type="text"
                      className="form_input"
                      placeholder="홍길동펫샵 또는 (주)펫메이트"
                      value={formInputs.corporationName}
                      onChange={(e) => handleInputChange("corporationName", e.target.value)}
                      readOnly={isIdBlockLocked}
                    />
                  </div>
                  <div className="company_form_group">
                    <span>대표자명</span>
                    <input
                      type="text"
                      className="form_input"
                      placeholder="홍길동"
                      value={formInputs.representativeName}
                      onChange={(e) => handleInputChange("representativeName", e.target.value)}
                      readOnly={isIdBlockLocked}
                    />
                  </div>
                </div>
              </>
            )}

            {/* 주소 */}
            <div className="company_form_grid">
              <div className="company_form_group">
                <span>주소</span>
                <div className="input_button_group">
                  <input
                    type="text"
                    className="form_input"
                    placeholder="도로명 주소를 검색해주세요"
                    value={formInputs.roadAddr}
                    readOnly
                  />
                  <button type="button" className="search_btn" onClick={handleAddressSearchBtnClick}>
                    주소 검색
                  </button>
                </div>
              </div>
              <div className="company_form_group">
                <span>상세주소</span>
                <input
                  type="text"
                  className="form_input"
                  placeholder="상세 주소를 입력해주세요"
                  value={formInputs.detailAddr}
                  onChange={(e) => handleInputChange("detailAddr", e.target.value)}
                />
              </div>
            </div>

            {/* 대표 서비스 & 연락처 */}
            <div className="company_form_grid">
              <div className="company_form_group">
                <span>대표 서비스</span>
                <select
                  className="form_select"
                  value={formInputs.mainService} // "돌봄" 등 라벨
                  onChange={(e) => handleInputChange("mainService", e.target.value)}
                >
                  <option value="">선택해주세요</option>
                  <option value="돌봄">돌봄</option>
                  <option value="산책">산책</option>
                  <option value="미용">미용</option>
                  <option value="병원">병원</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="company_form_group">
                <span>연락처</span>
                <div className="tel_input_group">
                  <input
                    type="tel"
                    className="tel_form_input"
                    maxLength={3}
                    value={formInputs.phone1}
                    onChange={handleTelFirstInput}
                  />
                  -
                  <input
                    type="tel"
                    className="tel_form_input"
                    maxLength={4}
                    value={formInputs.phone2}
                    onChange={handleTelSecondInput}
                    ref={telSecondRef}
                  />
                  -
                  <input
                    type="tel"
                    className="tel_form_input"
                    maxLength={4}
                    value={formInputs.phone3}
                    onChange={handleTelThirdInput}
                    ref={telThirdRef}
                  />
                </div>
              </div>
            </div>

            {/* 제공 서비스 */}
            <div className="company_form_section">
              <span>제공 서비스</span>
              <div className="company_checkbox_group">
                <label>
                  <input
                    type="checkbox"
                    name="전체"
                    checked={checkService.전체}
                    onChange={handleAllServiceChange}
                  />
                  전체
                </label>
                {serviceCategories.map((service) => (
                  <label key={service}>
                    <input
                      type="checkbox"
                      name={service}
                      checked={checkService[service]}
                      onChange={handleServiceChange}
                    />
                    {service}
                  </label>
                ))}
              </div>
            </div>

            {/* 운영 시간 */}
            <div className="company_form_section">
              <span>운영시간</span>
              <label>
                <input type="checkbox" checked={allDay} onChange={handleAllTimeChange} />
                24시간 운영
              </label>

              {days.map((day) => {
                const dayState = time?.[day] ?? { open: "09:00", close: "18:00", closed: false };
                const { open, close, closed } = dayState;
                const disabled = allDay || closed;
                return (
                  <div key={day}>
                    {day}
                    <input
                      type="time"
                      value={open}
                      onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                      disabled={disabled}
                    />
                    {" ~ "}
                    <input
                      type="time"
                      value={close}
                      onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                      disabled={disabled}
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={closed}
                        onChange={(e) => handleClosedChange(day, e.target.checked)}
                        disabled={allDay}
                      />
                      휴무
                    </label>
                  </div>
                );
              })}
            </div>

            {/* 업체 사진 */}
            <div className="company_form_section">
              <span>업체 사진</span>
              <ImageUploadViewer
                imageTypeCode="03"
                referenceId={Number(companyId)}
                buttonText="업체 사진 업로드"
                mode="multiple"
                files={files}
                setFiles={setFiles}
              />
            </div>

            {/* 업체 소개 */}
            <div className="company_form_section">
              <span>업체 소개</span>
              <textarea
                className="company_form_textarea"
                placeholder="업체 소개글을 작성해주세요"
                rows={4}
                value={formInputs.introduction}
                onChange={(e) => handleInputChange("introduction", e.target.value)}
              />
            </div>

            {/* 버튼 */}
            <div className="company_form_btn">
              <button type="button" className="cancel_btn" onClick={handleCancel}>
                취소
              </button>
              <button type="button" className="submit_btn" onClick={handleSubmit}>
                수정
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 지도 모달 */}
      <MapModal show={showMapModal} onClose={handleCloseMapModal} onLocationSelect={handleLocationSelect} />
    </div>
  );
}

export default CompanyEditPage;

