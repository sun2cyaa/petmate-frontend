import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CompanyRegisterPage.css";
import { updateCompany, getCompanyById } from "../../services/companyService";

function CompanyEditPage({user}) {
    const navigate = useNavigate();

    const serviceCategories = ["돌봄", "산책", "미용", "병원", "기타"];
    const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];

    const makeDefault = () =>
        Object.fromEntries(
            days.map(d => [d, {open: "09:00", close: "18:00", closed:false }])
        );

    // hook
    const [loading, setLoading] = useState(true);
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

    // 폼 입력 필드 상태
    const [formInputs, setFormInputs] = useState({
        name: '',
        roadAddr: '',
        detailAddr: '',
        postcode: '',
        latitude: '',
        longitude: '',
        repService: '',
        phone1: '',
        phone2: '',
        phone3: '',
        descText: ''
    });

    const inputRef = useRef(null);
    const backupRef = useRef(null);

    // 다음 주소 API 스크립트 로드
    useEffect(() => {
        if (!window.daum) {
            const postcodeScript = document.createElement('script');
            postcodeScript.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            document.head.appendChild(postcodeScript);
        }

        if (!window.kakao) {
            const kakaoScript = document.createElement('script');
            kakaoScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&libraries=services`;
            document.head.appendChild(kakaoScript);
        }
    }, []);

    // 업체 정보 로드
    useEffect(() => {
        const loadCompany = async () => {
            try {
                const company = await getCompanyById(user);

                // 전화번호 분리
                const phoneParts = company.tel ? company.tel.split('-') : ['', '', ''];

                setFormInputs({
                    name: company.name || '',
                    roadAddr: company.roadAddr || '',
                    detailAddr: company.detailAddr || '',
                    postcode: company.postcode || '',
                    latitude: company.lat ? company.lat.toString() : '',
                    longitude: company.lng ? company.lng.toString() : '',
                    repService: company.repService || '',
                    phone1: phoneParts[0] || '',
                    phone2: phoneParts[1] || '',
                    phone3: phoneParts[2] || '',
                    descText: company.descText || ''
                });

                // 서비스 정보 파싱
                if (company.services) {
                    try {
                        const services = JSON.parse(company.services);
                        setCheckService(services);
                    } catch (e) {
                        console.error('서비스 정보 파싱 오류:', e);
                    }
                }

                // 운영시간 정보 파싱
                if (company.operatingHours) {
                    try {
                        const operatingData = JSON.parse(company.operatingHours);
                        setAllDay(operatingData.allDay || false);
                        setTime(operatingData.schedule || makeDefault());
                    } catch (e) {
                        console.error('운영시간 정보 파싱 오류:', e);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('업체 정보 로드 오류:', error);
                alert('업체 정보를 불러오는 중 오류가 발생했습니다.');
                navigate('/companymanage');
            }
        };

        if (user) {
            loadCompany();
        }
    }, [user, navigate]);

    // handler
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

    const handleTelFirstInput = (e) => {
        const numericValue = handleNumericInput(e.target.value, 3);
        handleInputChange('phone1', numericValue);
    };

    const handleTelSecondInput = (e) => {
        const numericValue = handleNumericInput(e.target.value, 4);
        handleInputChange('phone2', numericValue);
    };

    const handleTelThirdInput = (e) => {
        const numericValue = handleNumericInput(e.target.value, 4);
        handleInputChange('phone3', numericValue);
    };

    // 주소 검색
    const handleAddressSearchBtnClick = () => {
        if (!window.daum) {
            alert("주소 검색 서비스를 로드하는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: function(data) {
                const addr = data.address;
                const postcode = data.zonecode;

                handleInputChange('roadAddr', addr);
                handleInputChange('postcode', postcode);

                if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
                    const geocoder = new window.kakao.maps.services.Geocoder();
                    geocoder.addressSearch(addr, function(result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const latitude = parseFloat(result[0].y);
                            const longitude = parseFloat(result[0].x);

                            handleInputChange('latitude', latitude);
                            handleInputChange('longitude', longitude);
                        }
                    });
                }
            }
        }).open();
    };

    // 제공 서비스 전체 체크박스 변경
    const handleAllServiceChange = (e) => {
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
        const {name, checked} = e.target;

        setCheckService((prev) => {
            const updated = {...prev, [name]: checked};
            const allChecked = serviceCategories.every((item) => updated[item]);
            updated.전체 = allChecked;
            return updated;
        });
    };

    // 운영시간 전체 체크박스 변경
    const handleAllTimeChange = (e) => {
        const isChecked = e.target.checked;
        setAllDay(isChecked);

        if(isChecked) {
            setTime((prev) => {
                const base = prev ?? makeDefault();
                backupRef.current = JSON.parse(JSON.stringify(base));
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

    // 운영시간 변경
    const handleTimeChange = (day, field, value) => {
        setTime(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };

    // 운영시간 휴무 변경
    const handleClosedChange = (day, checked) => {
        setTime(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                closed: checked
            }
        }));
    };

    // 폼 유효성 검사 함수
    const validateForm = () => {
        if (!formInputs.name.trim() ||
            !formInputs.roadAddr.trim() ||
            !formInputs.repService ||
            !formInputs.phone1 || formInputs.phone1.length !== 3 ||
            !formInputs.phone2 || formInputs.phone2.length !== 4 ||
            !formInputs.phone3 || formInputs.phone3.length !== 4) {
            return false;
        }

        const selectedServices = Object.entries(checkService)
            .filter(([key, value]) => key !== '전체' && value === true);

        return selectedServices.length > 0;
    };

    // 업체 수정 취소
    const handleCompanyEditCancelBtnClick = () => {
        if(window.confirm("업체 수정을 취소하시겠습니까?")) {
            navigate("/companymanage");
        }
    };

    // 업체 수정
    const handleCompanyEditBtnClick = async () => {
        if (!validateForm()) {
            alert("입력되지 않은 정보가 있습니다.");
            return;
        }

        if(window.confirm("업체 정보를 수정하시겠습니까?")) {
            try {
                const formData = new FormData();

                formData.append('name', formInputs.name);
                formData.append('roadAddr', formInputs.roadAddr);
                formData.append('detailAddr', formInputs.detailAddr);
                formData.append('postcode', formInputs.postcode);
                formData.append('latitude', formInputs.latitude);
                formData.append('longitude', formInputs.longitude);

                const fullPhoneNumber = `${formInputs.phone1}-${formInputs.phone2}-${formInputs.phone3}`;
                formData.append('tel', fullPhoneNumber);

                formData.append('repService', formInputs.repService);
                formData.append('services', JSON.stringify(checkService));
                formData.append('operatingHours', JSON.stringify({
                    allDay: allDay,
                    schedule: time
                }));
                formData.append('descText', formInputs.descText);

                const result = await updateCompany(user, formData);

                if (result) {
                    alert('업체 정보가 수정되었습니다!');
                    navigate('/companymanage');
                }
            } catch (error) {
                console.error('업체 수정 중 오류:', error);
                alert('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return(
        <div className="company_register_page">
            <div className="company_register_main">
                <div className="company_register_content">
                    {/* 헤더 섹션 */}
                    <div className="section-header">
                        <div className="header_info">
                            <h2 className="section-title">업체 수정</h2>
                            <p className="section-subtitle">펫케어 업체 정보를 수정하세요</p>
                        </div>
                    </div>

                    {/* 업체 정보 */}
                    <div className="company_register_section">
                        <h3>업체 정보</h3>

                        {/* 업체명 & 연락처 */}
                        <div className="company_form_grid">
                            <div className="company_form_group">
                                <span>업체명</span>
                                <input
                                    type="text"
                                    className="form_input"
                                    placeholder="업체명을 입력해주세요"
                                    value={formInputs.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
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
                                    />
                                    -
                                    <input
                                        type="tel"
                                        className="tel_form_input"
                                        maxLength={4}
                                        value={formInputs.phone3}
                                        onChange={handleTelThirdInput}
                                    />
                                </div>
                            </div>
                        </div>

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

                        {/* 대표 서비스 */}
                        <div className="company_form_grid">
                            <div className="company_form_group">
                                <span>대표 서비스</span>
                                <select
                                    className="form_select"
                                    value={formInputs.repService}
                                    onChange={(e) => handleInputChange('repService', e.target.value)}
                                >
                                    <option value="">선택해주세요</option>
                                    <option value="돌봄">돌봄</option>
                                    <option value="산책">산책</option>
                                    <option value="미용">미용</option>
                                    <option value="병원">병원</option>
                                    <option value="기타">기타</option>
                                </select>
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

                        {/* 업체 소개 */}
                        <div className="company_form_section">
                            <span>업체 소개</span>
                            <textarea
                                className="company_form_textarea"
                                placeholder="업체 소개글을 작성해주세요"
                                rows={4}
                                value={formInputs.descText}
                                onChange={(e) => handleInputChange('descText', e.target.value)}
                            />
                        </div>

                        {/* 버튼 영역 */}
                        <div className="company_form_btn">
                            <button type="button" className="cancel_btn" onClick={handleCompanyEditCancelBtnClick}>취소</button>
                            <button type="submit" className="submit_btn" onClick={handleCompanyEditBtnClick}>수정</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyEditPage;