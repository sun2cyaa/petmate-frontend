import { useState, useEffect } from "react"
import './AddressEditModal.css'
import {
  X,
  Home,
  Building2,
  MapPinned,
} from "lucide-react"

const addressTypes = [
  { type: "home", name: "집", icon: Home, color: "" },
  { type: "office", name: "회사", icon: Building2, color: "" },
  { type: "other", name: "기타", icon: MapPinned, color: "" },
]

export default function AddressEditModal({ 
  show, 
  onClose, 
  address,
  onSave
}) {
  const [editFormData, setEditFormData] = useState({
    type: "home",
    address: "",
    detail: "",
    alias: "",
    isDefault: false
  })

  useEffect(() => {
    if (address && show) {
      setEditFormData({
        type: address.type,
        address: address.address,
        detail: address.detail,
        alias: address.alias,
        isDefault: address.isDefault
      })
    }
  }, [address, show])

  if (!show) return null

  const handleSave = () => {
    onSave(editFormData)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">주소 수정</h3>
          <button className="close-button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label className="form-label">주소 유형</label>
            <div className="address-type-grid">
              {addressTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <button
                    key={type.type}
                    onClick={() => setEditFormData(prev => ({ ...prev, type: type.type }))}
                    className={`address-type-button ${editFormData.type === type.type ? 'selected' : ''}`}
                  >
                    <div className="address-type-icon">
                      <IconComponent size={16} />
                    </div>
                    <span className="address-type-text">{type.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">주소</label>
            <input
              type="text"
              placeholder="도로명 주소를 입력하세요"
              value={editFormData.address}
              onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">상세 주소</label>
            <input
              type="text"
              placeholder="동, 호수를 입력하세요"
              value={editFormData.detail}
              onChange={(e) => setEditFormData(prev => ({ ...prev, detail: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">별칭</label>
            <input
              type="text"
              placeholder="예) 우리집, 회사, 친구집"
              value={editFormData.alias}
              onChange={(e) => setEditFormData(prev => ({ ...prev, alias: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="editDefault"
              checked={editFormData.isDefault}
              onChange={(e) => setEditFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="checkbox"
            />
            <label htmlFor="editDefault" className="checkbox-label">기본 주소로 설정</label>
          </div>

          <div className="modal-actions">
            <button onClick={handleSave} className="primary-button">
              수정하기
            </button>
            <button onClick={onClose} className="secondary-button">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}