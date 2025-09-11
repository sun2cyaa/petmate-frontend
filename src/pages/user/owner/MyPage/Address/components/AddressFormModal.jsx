import { useState, useEffect } from "react"
import './AddressFormModal.css'
import {
  X,
  Search,
  Loader2,
  Home,
  Building2,
  MapPinned,
} from "lucide-react"

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
  setSearchQuery = () => {},
  selectedAddress = null,
  isSearching = false,
  onAddressSearch = () => {}
}) {
  const isEditMode = !!address
  
  const [formData, setFormData] = useState({
    type: "home",
    address: "",
    detail: "",
    alias: "",
    isDefault: false,
    postcode: ""
  })

  useEffect(() => {
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
    // 추가 모드에서 searchQuery 변경 시 formData.address 동기화
    if (!isEditMode && searchQuery) {
      setFormData(prev => ({ ...prev, address: searchQuery }))
    }
  }, [searchQuery, isEditMode])

  useEffect(() => {
    // 다음 우편번호 API 스크립트 로드 (추가 모드에서만)
    if (!isEditMode && !window.daum) {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      document.head.appendChild(script);
    }
  }, [isEditMode]);

  const handleDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        const addr = data.address; // 최종 주소
        const postcode = data.zonecode; // 우편번호
        setSearchQuery(addr);
        setFormData(prev => ({ 
          ...prev, 
          address: addr,
          postcode: postcode
        }))
        console.log('검색된 주소:', addr, '우편번호:', postcode);
      }
    }).open();
  };

  if (!show) return null

  const handleSave = () => {
    if (!formData.address.trim()) {
      alert("주소를 입력해주세요.")
      return
    }
    
    if (isEditMode) {
      onSave(formData)
    } else {
      // 추가 모드에서는 coordinates 정보도 포함
      const addressData = {
        ...formData,
        coordinates: selectedAddress ? { x: selectedAddress.x, y: selectedAddress.y } : null
      }
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
            {isEditMode ? (
              <input
                type="text"
                placeholder="도로명 주소를 입력하세요"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                className="address_form_input"
              />
            ) : (
              <div className="address_input_group">
                <input
                  type="text"
                  placeholder="주소 검색 버튼을 눌러주세요"
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
            )}
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
    </div>
  )
}