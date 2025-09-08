import { useState, useEffect } from "react"
import './AddressAddModal.css'
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
  { type: "other", name: "기타", icon: MapPinned, color: "" },
]

export default function AddressAddModal({ 
  show, 
  onClose, 
  searchQuery, 
  setSearchQuery, 
  selectedAddress, 
  isSearching, 
  onAddressSearch,
  onSave 
}) {
  const [selectedType, setSelectedType] = useState("home")
  const [detailAddress, setDetailAddress] = useState("")
  const [alias, setAlias] = useState("")
  const [isDefault, setIsDefault] = useState(false)

  useEffect(() => {
    // 다음 우편번호 API 스크립트 로드
    if (!window.daum) {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      document.head.appendChild(script);
    }
  }, []);

  const handleDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        const addr = data.address; // 최종 주소
        setSearchQuery(addr);
        console.log('검색된 주소:', addr);
      }
    }).open();
  };

  if (!show) return null

  const handleSave = () => {
    if (!searchQuery.trim()) {
      alert("주소를 입력해주세요.")
      return
    }
    
    if (!alias.trim()) {
      alert("별칭을 입력해주세요.")
      return
    }

    const addressData = {
      type: selectedType,
      address: searchQuery,
      detail: detailAddress,
      alias,
      isDefault,
      coordinates: selectedAddress ? { x: selectedAddress.x, y: selectedAddress.y } : null
    }
    
    onSave(addressData)
    
    // 폼 초기화
    setSelectedType("home")
    setDetailAddress("")
    setAlias("")
    setIsDefault(false)
    setSearchQuery("")
    
    onClose()
  }

  return (
    <div className="address_modal_overlay">
      <div className="address_modal_content">
        <div className="address_modal_header">
          <h3 className="address_modal_title">주소 추가</h3>
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
                    onClick={() => setSelectedType(type.type)}
                    className={`address_type_button ${selectedType === type.type ? 'selected' : ''}`}
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
                placeholder="주소 검색 버튼을 눌러주세요"
                value={searchQuery}
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
            
          </div>

          <div className="address_form_group">
            <label className="address_form_label">상세 주소</label>
            <input 
              type="text"
              placeholder="동, 호수를 입력하세요" 
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              className="address_form_input"
            />
          </div>

          <div className="address_form_group">
            <label className="address_form_label">별칭</label>
            <input 
              type="text"
              placeholder="예) 우리집, 회사, 친구집" 
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="address_form_input"
            />
          </div>

          <div className="address_checkbox_group">
            <input 
              type="checkbox" 
              id="default" 
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="address_checkbox"
            />
            <label htmlFor="default" className="address_checkbox_label">기본 주소로 설정</label>
          </div>

          <div className="address_modal_actions">
            <button onClick={handleSave} className="address_save_button">
              저장하기
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