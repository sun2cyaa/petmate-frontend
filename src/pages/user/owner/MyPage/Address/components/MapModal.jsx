import { X, MapPin } from "lucide-react"
import './MapModal.css'

export default function MapModal({ 
  show, 
  onClose,
  onLocationSelect 
}) {
  if (!show) return null

  const handleLocationSelect = () => {
    const selectedLocation = {
      address: "선택된 주소 (지도 API 연동 예정)",
      latitude: 37.497175,
      longitude: 127.027621
    }
    
    onLocationSelect?.(selectedLocation)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="map-modal-content">
        <div className="modal-header">
          <h3 className="modal-title">지도에서 주소 찾기</h3>
          <button className="close-button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="map-content">
          <div className="map-placeholder">
            <div className="map-placeholder-content">
              <MapPin size={32} className="map-placeholder-icon" />
              <p className="map-placeholder-title">지도 API 연동 예정</p>
              <p className="map-placeholder-subtitle">핀을 드래그해서 정확한 위치를 선택하세요</p>
            </div>
          </div>
        </div>

        <div className="map-actions">
          <button onClick={handleLocationSelect} className="select-location-button">
            이 위치로 설정
          </button>
        </div>
      </div>
    </div>
  )
}