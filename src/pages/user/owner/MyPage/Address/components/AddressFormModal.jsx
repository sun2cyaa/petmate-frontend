import { useState, useEffect } from "react"
import './AddressFormModal.css'
import {
    X,
    Search,
    Loader2,
    Home,
    Building2,
    MapPinned,
    Map,
} from "lucide-react"
import MapModal from './MapModal'

const addressTypes = [
    { type: "home", name: "집", icon: Home, color: "" },
    { type: "office", name: "회사", icon: Building2, color: "" },
    { type: "etc", name: "기타", icon: MapPinned, color: "" },
]

export default function AddressFormModal({
    show,
    onClose,
    address = null, // null이면 추가 모드, 값이 있으면 수정 모드
    onSave,
    searchQuery = "",
    setSearchQuery = () => { },
    selectedAddress = null,
    isSearching = false,
    onAddressSearch = () => { }
}) {
    const isEditMode = !!address
    const [showMapModal, setShowMapModal] = useState(false)
    const [mapSelectedLocation, setMapSelectedLocation] = useState(null)

    const [formData, setFormData] = useState({
        type: "home",
        address: "",
        detail: "",
        alias: "",
        isDefault: false,
        postcode: ""
    })

    useEffect(() => {

        console.log('address', address);
        console.log('searchQuery', searchQuery);
        console.log('selectedAddress', selectedAddress);

        if (address && show && isEditMode) {
            setFormData({
                type: address.type,
                address: address.address,
                detail: address.detail,
                alias: address.alias,
                isDefault: address.isDefault,
                postcode: address.postcode || ""
            })
        } else if (!isEditMode && show) {
            // 추가 모드일 때 초기값 설정
            setFormData({
                type: "home",
                address: searchQuery || "",
                detail: "",
                alias: "",
                isDefault: false,
                postcode: ""
            })
        }
    }, [address, show, isEditMode, searchQuery])

    useEffect(() => {
        // searchQuery 변경 시 formData.address 동기화 (추가/수정 모드 모두)
        if (searchQuery) {
            setFormData(prev => ({ ...prev, address: searchQuery }))
        }
    }, [searchQuery])

    useEffect(() => {
        // 다음 우편번호 API 스크립트 로드
        if (!window.daum) {
            const script = document.createElement('script');
            script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            document.head.appendChild(script);
        }
        
        // Kakao 지도 API 스크립트 로드 (좌표 검색용)
        if (!window.kakao) {
            const kakaoScript = document.createElement('script');
            kakaoScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
            kakaoScript.onload = () => {
                window.kakao.maps.load(() => {
                    console.log('AddressFormModal - Kakao 지도 API 로드 완료');
                });
            };
            document.head.appendChild(kakaoScript);
        }
    }, []);

    const handleDaumPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                const addr = data.address; // 최종 주소
                const postcode = data.zonecode; // 우편번호
                setSearchQuery(addr);
                setFormData(prev => ({
                    ...prev,
                    address: addr,
                    postcode: postcode
                }))
                // 다음 우편번호 API는 좌표를 제공하지 않으므로 Kakao 지도 API로 좌표 검색
                const searchCoordinates = () => {
                    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
                        const geocoder = new window.kakao.maps.services.Geocoder();
                        geocoder.addressSearch(addr, function(result, status) {
                            if (status === window.kakao.maps.services.Status.OK) {
                                const coords = {
                                    longitude: parseFloat(result[0].x),
                                    latitude: parseFloat(result[0].y)
                                };
                                console.log('다음 우편번호 API - 좌표 검색 결과:', coords);
                                
                                // mapSelectedLocation에 좌표 정보 저장
                                setMapSelectedLocation({
                                    address: addr,
                                    postcode: postcode,
                                    latitude: coords.latitude,
                                    longitude: coords.longitude
                                });
                            } else {
                                console.warn('다음 우편번호 API - 좌표 검색 실패:', status);
                            }
                        });
                    } else {
                        console.warn('Kakao 지도 API가 아직 로드되지 않았습니다. 잠시 후 다시 시도합니다.');
                        // 1초 후 재시도
                        setTimeout(searchCoordinates, 1000);
                    }
                };
                
                searchCoordinates();
            }
        }).open();
    };

    const handleMapLocationSelect = (location) => {
        // 지도에서 선택한 위치 정보 저장
        setMapSelectedLocation(location);

        // 폼 데이터 업데이트
        setFormData(prev => ({
            ...prev,
            address: location.address,
            postcode: location.postcode
        }));

        // 검색 쿼리도 업데이트
        setSearchQuery(location.address);

        setShowMapModal(false);
    };

    if (!show) return null

    const handleSave = () => {
        if (!formData.address.trim()) {
            alert("주소를 입력해주세요.")
            return
        }

        const { coordinates, postcode } =
        mapSelectedLocation ? {
            // 지도에서 선택한 경우 (최우선)
            coordinates: {
                x: mapSelectedLocation.longitude,
                y: mapSelectedLocation.latitude
            },
            postcode: mapSelectedLocation.postcode || formData.postcode || ""
        }
        :
        formData.postcode && formData.address ? {
            // 다음 우편번호 API로 검색한 경우
            coordinates: null, // 다음 API는 좌표 제공 안함
            postcode: formData.postcode
        }
        :
        selectedAddress ? {
            // 기타 주소 검색 결과
            coordinates: {
                x: selectedAddress.x,
                y: selectedAddress.y
            },
            postcode: selectedAddress.postcode || ""
        }
        :
        address && !mapSelectedLocation && !formData.postcode ? {
            // 수정 모드 기존 데이터 (새로운 선택이 없는 경우에만)
            coordinates: {
                x: address.longitude,
                y: address.latitude
            },
            postcode: address.postcode || ""
        }
        :
        { coordinates: null, postcode: "" };

        const addressData = {
            ...formData,
            coordinates: coordinates,
            postcode: postcode
        }

        console.log('addressData', addressData);

        if (isEditMode) {
            onSave(addressData)
        } else {
            onSave(addressData)

            // 폼 초기화
            setFormData({
                type: "home",
                address: "",
                detail: "",
                alias: "",
                isDefault: false,
                postcode: ""
            })
            setSearchQuery("")
            setMapSelectedLocation(null)
        }

        onClose()
    }

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="address_modal_overlay">
            <div className="address_modal_content">
                <div className="address_modal_header">
                    <h3 className="address_modal_title">
                        {isEditMode ? '주소 수정' : '주소 추가'}
                    </h3>
                    <button className="address_close_button" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                <div className="address_modal_form">
                    <div className="address_form_group">
                        <label className="address_form_label">주소 유형</label>
                        <div className="address_type_grid">
                            {addressTypes.map((type) => {
                                const IconComponent = type.icon
                                return (
                                    <button
                                        key={type.type}
                                        onClick={() => updateFormData('type', type.type)}
                                        className={`address_type_button ${formData.type === type.type ? 'selected' : ''}`}
                                    >
                                        <div className="address_type_icon">
                                            <IconComponent size={16} />
                                        </div>
                                        <span className="address_type_text">{type.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="address_form_group">
                        <label className="address_form_label">주소</label>
                        <div className="address_input_group">
                            <input
                                type="text"
                                placeholder="주소 검색 또는 지도에서 선택하세요"
                                value={formData.address}
                                readOnly
                                className="address_input"
                            />
                            <button
                                type="button"
                                className="address_search_button"
                                onClick={handleDaumPostcode}
                            >
                                <Search size={16} />
                                주소 검색
                            </button>
                        </div>
                        <div className="address_search_buttons">
                            <button
                                type="button"
                                className="map_search_button"
                                onClick={() => setShowMapModal(true)}
                            >
                                <Map size={16} />
                                지도에서 찾기
                            </button>
                            {mapSelectedLocation && (
                                <div className="map_selected_indicator">
                                    <MapPinned size={14} />
                                    <span>지도에서 선택됨</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="address_form_group">
                        <label className="address_form_label">상세 주소</label>
                        <input
                            type="text"
                            placeholder="동, 호수를 입력하세요"
                            value={formData.detail}
                            onChange={(e) => updateFormData('detail', e.target.value)}
                            className="address_form_input"
                        />
                    </div>

                    <div className="address_form_group">
                        <label className="address_form_label">별칭</label>
                        <input
                            type="text"
                            placeholder="예) 우리집, 회사, 친구집"
                            value={formData.alias}
                            onChange={(e) => updateFormData('alias', e.target.value)}
                            className="address_form_input"
                        />
                    </div>

                    <div className="address_checkbox_group">
                        <input
                            type="checkbox"
                            id={isEditMode ? "editDefault" : "default"}
                            checked={formData.isDefault}
                            onChange={(e) => updateFormData('isDefault', e.target.checked)}
                            className="address_checkbox"
                        />
                        <label htmlFor={isEditMode ? "editDefault" : "default"} className="address_checkbox_label">
                            기본 주소로 설정
                        </label>
                    </div>

                    <div className="address_modal_actions">
                        <button onClick={handleSave} className="address_save_button">
                            {isEditMode ? '수정하기' : '저장하기'}
                        </button>
                        <button onClick={onClose} className="address_exit_button">
                            취소
                        </button>
                    </div>
                </div>
            </div>

            <MapModal
                show={showMapModal}
                onClose={() => setShowMapModal(false)}
                onLocationSelect={handleMapLocationSelect}
            />
        </div>
    )
}