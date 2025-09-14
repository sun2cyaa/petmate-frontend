import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CompanyRegisterPage.css";
import { registerCompany, checkBusinessNumber } from "../../services/companyService";
import MapModal from "../user/owner/MyPage/Address/components/MapModal";
import { ImageUploadViewer, MultipleImageUpload } from "../../util/ImageUtil";

function CompanyRegisterPage() {

    const serviceCategories = ["돌봄", "산책", "미용", "병원", "기타"];
    const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
    const makeDefault = () =>
        Object.fromEntries(
            days.map(d => [d, {open: "09:00", close: "18:00", closed:false }])
        );
    const clone = (obj) =>
        typeof structuredClone === "function" ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));

    // hook
    const [companyType, setCompanyType] = useState("PERSONAL");
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
    const [files, setFiles] = useState([]);
    const [showMapModal, setShowMapModal] = useState(false);

    // 폼 입력 필드 상태
    const [formInputs, setFormInputs] = useState({
        // 개인(일반인) 정보
        ssnFirst: '',
        ssnSecond: '',
        personalName: '',
        personalCompanyName: '',
        // 개인/법인사업자 정보  
        businessNumber: '',
        corporationName: '',
        representativeName: '',
        // 공통 정보
        roadAddr: '',
        detailAddr: '',
        postcode: '',
        latitude: '',
        longitude: '',
        mainService: '',
        phone1: '',
        phone2: '',
        phone3: '',
        introduction: ''
    });
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const backupRef = useRef(null);
    const ssnSecondRef = useRef(null);
    const telSecondRef = useRef(null);
    const telThirdRef = useRef(null);

    // 다음 주소 API 스크립트 로드
    useEffect(() => {
        if (!window.daum) {
            const postcodeScript = document.createElement('script');
            postcodeScript.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            document.head.appendChild(postcodeScript);
        }
        
        // 카카오 맵 API 스크립트 로드 (좌표 변환용)
        if (!window.kakao) {
            const kakaoScript = document.createElement('script');
            kakaoScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&libraries=services`;
            document.head.appendChild(kakaoScript);
        }
    }, []);

    // handler
    // 파일넣기
    const handleFiles = (newFiles) => {
        const fileArray = Array.from(newFiles);
        setFiles((prev) => [...prev, ...fileArray]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleClickArea = () => {
        inputRef.current?.click();  // current가 null/undefined면 아무 것도 안하고 undefined 반환하고 유효하면 click() 호출
    };

    // 사진 삭제 기능
    const handleRemoveFile = (indexToRemove) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // 입력 필드 값 변경 핸들러
    const handleInputChange = (field, value) => {
        setFormInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 숫자만 입력 허용 함수
    const handleNumericInput = (value, maxLength) => {
        return value.replace(/[^0-9]/g, '').slice(0, maxLength);
    };

    // 사업자등록번호 포맷팅 (###-##-#####)
    const formatBusinessNumber = (value) => {
        const numbers = value.replace(/[^0-9]/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
    };

    // 사업자등록번호 입력 핸들러
    const handleBusinessNumberInput = (e) => {
        const formattedValue = formatBusinessNumber(e.target.value);
        handleInputChange('businessNumber', formattedValue);
    };

    // 자동 포커스 함수들
    const handleSsnFirstInput = (e) => {
        const numericValue = handleNumericInput(e.target.value, 6);
        handleInputChange('ssnFirst', numericValue);
        if (numericValue.length === 6 && ssnSecondRef.current !== null) {
            ssnSecondRef.current.focus();            
        }
    };

    const handleSsnSecondInput = (e) => {
        const numericValue = handleNumericInput(e.target.value, 7);
        handleInputChange('ssnSecond', numericValue);
    };

    const handleTelFirstInput = (e) => {
        const numericValue = handleNumericInput(e.target.value, 3);
        handleInputChange('phone1', numericValue);
        if (numericValue.length === 3 && telSecondRef.current !== null) {
            telSecondRef.current.focus();
        }
    };
                                                 
    const handleTelSecondInput = (e) => {
        const numericValue = handleNumericInput(e.target.value, 4);
        handleInputChange('phone2', numericValue);
        if (numericValue.length === 4 && telThirdRef.current !== null) {
            telThirdRef.current.focus();  
        }           
    };

    const handleTelThirdInput = (e) => {
        const numericValue = handleNumericInput(e.target.value, 4);
        handleInputChange('phone3', numericValue);
    };

    // 폼 유효성 검사 함수
    const validateForm = () => {
        let hasErrors = false;

        // 개인(일반인) vs 개인/법인사업자별 필수 필드 체크
        if (companyType === "PERSONAL") {
            // 개인(일반인) - 주민번호만 필요
            if (!formInputs.ssnFirst || formInputs.ssnFirst.length !== 6 ||
                !formInputs.ssnSecond || formInputs.ssnSecond.length !== 7 ||
                !formInputs.personalName.trim()) {
                hasErrors = true;
            }
        } else {
            // 개인/법인사업자 - 사업자등록번호 필수
            if (!formInputs.businessNumber.trim() ||
                !formInputs.corporationName.trim() ||
                !formInputs.representativeName.trim()) {
                hasErrors = true;
            }
        }

        // 공통 필수 필드 체크
        if (!formInputs.roadAddr.trim() ||
            !formInputs.mainService ||
            !formInputs.phone1 || formInputs.phone1.length !== 3 ||
            !formInputs.phone2 || formInputs.phone2.length !== 4 ||
            !formInputs.phone3 || formInputs.phone3.length !== 4) {
            hasErrors = true;
        }

        // 제공 서비스 체크 (전체 제외하고 최소 1개 선택)
        const selectedServices = Object.entries(checkService)
            .filter(([key, value]) => key !== '전체' && value === true);
        if (selectedServices.length === 0) {
            hasErrors = true;
        }

        return hasErrors;
    };
    
    // 사업자 정보 조회
    const handleBizNoSearchBtnClick = async () => {
        console.log("사업자 정보 조회 실행");

        const businessNumber = formInputs.businessNumber.trim();
        
        // 사업자번호 형식 체크
        if (!businessNumber) {
            alert("사업자등록번호를 입력해주세요.");
            return;
        }

        // 숫자만 추출 (하이픈 제거)
        const cleanBusinessNumber = businessNumber.replace(/[^0-9]/g, '');
        
        if (cleanBusinessNumber.length !== 10) {
            alert("올바른 사업자등록번호를 입력해주세요. (10자리 숫자)");
            return;
        }

        try {
            // companyService를 사용한 사업자 조회 API 호출
            const result = await checkBusinessNumber(cleanBusinessNumber);
            
            if (result) {
                // 개인/법인사업자에서만 사업자 조회 가능
                handleInputChange('corporationName', result.companyName || '');
                handleInputChange('representativeName', result.representativeName || '');
                
                alert(`사업자 조회가 완료되었습니다.\n상호명: ${result.companyName || '정보 없음'}\n대표자: ${result.representativeName || '정보 없음'}`);
            } else {
                alert("등록되지 않은 사업자등록번호이거나 조회할 수 없습니다.");
            }
        } catch (error) {
            console.error('사업자 조회 중 오류:', error);
            alert('사업자 정보 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    }

    // 주소 검색
    const handleAddressSearchBtnClick = () => {
        console.log("주소 검색 실행");

        if (!window.daum) {
            alert("주소 검색 서비스를 로드하는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: function(data) {
                const addr = data.address; // 최종 주소
                const postcode = data.zonecode; // 우편번호
                
                // 주소와 우편번호를 상태에 저장
                handleInputChange('roadAddr', addr);
                handleInputChange('postcode', postcode);

                // 카카오 좌표계 변환 API 호출
                if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
                    const geocoder = new window.kakao.maps.services.Geocoder();
                    geocoder.addressSearch(addr, function(result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const latitude = parseFloat(result[0].y);
                            const longitude = parseFloat(result[0].x);

                            handleInputChange('latitude', latitude.toString());
                            handleInputChange('longitude', longitude.toString());

                            console.log('검색된 주소:', addr, '우편번호:', postcode, '좌표:', { latitude, longitude });

                            // 지도 모달 열기
                            setShowMapModal(true);
                        } else {
                            // 좌표 변환 실패시 좌표 없이 저장
                            console.log('좌표 변환 실패, 주소만 저장:', addr, '우편번호:', postcode);
                        }
                    });
                } else {
                    // 카카오 맵 API가 로드되지 않은 경우
                    console.log('카카오 맵 API 없음, 주소만 저장:', addr, '우편번호:', postcode);
                }
            }
        }).open();
    }

    // 제공 서비스 전체 체크박스 변경
    const handleAllServiceChange = (e) => {
        console.log("대표 서비스 전체 선택");

        const isChecked = e.target.checked;
        const newState = {};
        serviceCategories.forEach((item) => (newState[item] = isChecked));

        setCheckService({
            전체: isChecked,
            ...newState,
        });
  };

    // 제공 서비스 개별 체크박스 변경
    const handleServiceChange = (e) => {
        console.log("대표 서비스 개별 선택");

        const {name, checked} = e.target;

        setCheckService((prev) => {
            const updated = {...prev, [name]: checked};

            // 전체 선택 여부 재계산
            const allChecked = serviceCategories.every((item) => updated[item]);
            updated.전체 = allChecked;

            return updated;
        });

    };



    // 운영시간 전체 체크박스 변경
    const handleAllTimeChange = (e) => {
        console.log("운영시간 전체 선택");

        const isChecked = e.target.checked;
        setAllDay(isChecked);

        if(isChecked) {
            setTime((prev) => {
                const base = prev ?? makeDefault();
                backupRef.current = clone(base);   // ← 여기서 백업 (가장 안전)
                const next = { ...base };
                days.forEach((d) => (next[d] = { open: "00:00", close: "23:59", closed: false }));
                return next;
            });
        } else {
            setTime((prev) => {
                const restored = backupRef.current ?? prev ?? makeDefault();
                backupRef.current = null; // 한번 쓰고 비우기
                return restored;
            });
        }
    };

    // 운영시간 변경
    const handleTimeChange = (day, field, value) => {
        console.log("운영시간 변경");
        setTime(prev => ({
            ...prev, 
            [day]: {            // 특정 요일만 바꿈
                ...prev[day],   // 기존 요일 값 유지
                [field]: value  // 특정 필드만 업데이트
            }
        }));
    };

    // 운영시간 휴무 변경
    const handleClosedChange = (day, checked) => {
        console.log("운영시간 휴무 선택");
        setTime(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                closed: checked // closed 값만 업데이트
            }
        }));
    };

    // 업체 등록 취소
    const handleCompanyRegisterCancleBtnClick = () => {
        console.log("업체 등록 취소");

        if(window.confirm("업체 등록을 취소하시겠습니까?")) {
            navigate("/companymanage");
        } else {
            return null;
        }

    }

    // 업체 등록
    // 지도 모달 핸들러
    const handleLocationSelect = (location) => {
        handleInputChange('roadAddr', location.address);
        if (location.postcode) {
            handleInputChange('postcode', location.postcode);
        }
        handleInputChange('latitude', location.latitude.toString());
        handleInputChange('longitude', location.longitude.toString());
        setShowMapModal(false);
    };

    const handleCloseMapModal = () => {
        setShowMapModal(false);
    };

    const handleCompanyRegisterBtnClick = async () => {
        console.log("업체 등록 요청");

        // 폼 유효성 검사
        const hasErrors = validateForm();
        if (hasErrors) {
            alert("입력되지 않은 정보가 있습니다.");
            return;
        }

        if(window.confirm("업체 등록을 하시겠습니까?")) {
            try {
                // FormData 생성 (파일 업로드 때문에)
                const formData = new FormData();
                
                // 업체 기본 정보 (백엔드 그룹코드에 맞춤)
                const typeCode = companyType === "PERSONAL" ? "PERSONAL" : "BUSINESS";
                formData.append('type', typeCode); // 개인(일반인): PERSONAL, 개인/법인사업자: BUSINESS
                
                // 개인(일반인) vs 개인/법인사업자별 정보
                if (companyType === "PERSONAL") {
                    // 개인(일반인) - 주민번호와 성함만
                    formData.append('ssnFirst', formInputs.ssnFirst);
                    formData.append('ssnSecond', formInputs.ssnSecond);
                    formData.append('repName', formInputs.personalName);
                } else {
                    // 개인/법인사업자 - 사업자번호, 상호명, 대표자명
                    formData.append('bizRegNo', formInputs.businessNumber);
                    formData.append('companyName', formInputs.corporationName);
                    formData.append('repName', formInputs.representativeName);
                }
                
                // 공통 정보
                formData.append('roadAddr', formInputs.roadAddr);
                formData.append('detailAddr', formInputs.detailAddr);
                formData.append('postcode', formInputs.postcode);
                formData.append('latitude', formInputs.latitude);
                formData.append('longitude', formInputs.longitude);
                
                // 연락처 (3개 필드를 하나로 합침)
                const fullPhoneNumber = `${formInputs.phone1}-${formInputs.phone2}-${formInputs.phone3}`;
                formData.append('tel', fullPhoneNumber);
                
                // 서비스 관련
                formData.append('repService', formInputs.mainService);
                formData.append('services', JSON.stringify(checkService));
                
                // 운영시간
                formData.append('operatingHours', JSON.stringify({
                    allDay: allDay,
                    schedule: time
                }));
                
                // 업체 소개
                formData.append('introduction', formInputs.introduction);
                
                // 파일 추가
                files.forEach((file) => {
                    formData.append('images', file);
                });

                // companyService를 사용한 API 호출
                const result = await registerCompany(formData);
                
                if (result) {
                    alert('업체 등록이 완료되었습니다!');
                    navigate('/companymanage'); // 업체 목록 페이지로 이동
                }
            } catch (error) {
                console.error('업체 등록 중 오류:', error);
                alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    }
                                                            

    return(
        <div className="company_register_page">
            <div className="company_register_main">
                <div className="company_register_content">
                    {/* 헤더 섹션 */}
                    <div className="section-header">
                        <div className="header_info">
                        <h2 className="section-title">업체 등록</h2>
                        <p className="section-subtitle">펫케어 업체 정보를 등록하세요</p>
                        </div>
                    </div>

                    {/* 업체 구분 */}
                    <div className="company_register_section">
                        <h3>업체 구분</h3>
                        <div className="radio_group">
                            <label className="radio_item">
                            <input
                                type="radio"
                                name="company_type"
                                value="PERSONAL"
                                checked={companyType === "PERSONAL"}
                                onChange={(e) => setCompanyType(e.target.value)}
                            />
                            <span>개인(일반인)</span>
                        </label>

                        <label className="radio_item">
                            <input
                                type="radio"
                                name="company_type"
                                value="BUSINESS"
                                checked={companyType === "BUSINESS"}
                                onChange={(e) => setCompanyType(e.target.value)}
                            />
                            <span>개인/법인사업자</span>
                        </label>
                        </div>
                        
                        {/* 사업자 정보 */}
                        {companyType === "PERSONAL" 
                        ?
                            (
                                <>
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
                                                />
                                                -
                                                <input 
                                                    type="password"
                                                    className="form_input"
                                                    maxLength={7}
                                                    value={formInputs.ssnSecond}
                                                    onChange={handleSsnSecondInput}
                                                    ref={ssnSecondRef}
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
                                                onChange={(e) => handleInputChange('personalName', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )
                            
                        :
                            (
                                <>
                                    <div className="company_form_grid">
                                        <div className="company_form_group" style={{ gridColumn: '1 / -1' }}>
                                            <span>사업자등록번호</span>
                                            <div className="input_button_group">
                                                <input 
                                                    type="text"
                                                    className="form_input"
                                                    placeholder="123-45-67890"
                                                    value={formInputs.businessNumber}
                                                    onChange={handleBusinessNumberInput}
                                                    maxLength={12}
                                                />
                                                <button type="button" className="search_btn" onClick={handleBizNoSearchBtnClick}>
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
                                                onChange={(e) => handleInputChange('corporationName', e.target.value)}
                                            />
                                        </div>
                                        <div className="company_form_group">
                                            <span>대표자명</span>
                                            <input 
                                                type="text"
                                                className="form_input"
                                                placeholder="홍길동"
                                                value={formInputs.representativeName}
                                                onChange={(e) => handleInputChange('representativeName', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )
                        }
                        
                        {/* 주소 정보 */}
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
                                    onChange={(e) => handleInputChange('detailAddr', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 대표 서비스 & 연락처 */}
                        <div className="company_form_grid">
                            <div className="company_form_group">
                                <span>대표 서비스</span>
                                <select 
                                    className="form_select"
                                    value={formInputs.mainService}
                                    onChange={(e) => handleInputChange('mainService', e.target.value)}
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
                                    <input 
                                        type="checkbox"
                                        checked={allDay} 
                                        onChange={handleAllTimeChange}
                                    /> 
                                    24시간 운영
                                </label>

                                {days.map(day => {
                                    const dayState = time?.[day] ?? { open: "", close: "", closed: false };
                                    const { open, close, closed } = dayState;
                                    const disabled = allDay || closed;
                                    return(
                                        <div key={day}>
                                            {day}
                                            <input 
                                                type="time"
                                                value={open}
                                                onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                                                disabled={disabled}
                                            />
                                             ~
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
                                referenceId={11}
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
                                    onChange={(e) => handleInputChange('introduction', e.target.value)}
                                />                           
                        </div>
                        
                        {/* 버튼 영역 */}
                        <div className="company_form_btn">
                            <button type="button" className="cancel_btn" onClick={handleCompanyRegisterCancleBtnClick}>취소</button>
                            <button type="submit" className="submit_btn" onClick={handleCompanyRegisterBtnClick}>등록</button>
                        </div>

                    </div>
                </div>
            </div>

            {/* 지도 모달 */}
            <MapModal
                show={showMapModal}
                onClose={handleCloseMapModal}
                onLocationSelect={handleLocationSelect}
            />
        </div>
    );
}

export default CompanyRegisterPage;