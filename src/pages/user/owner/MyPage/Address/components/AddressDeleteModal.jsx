import { X } from "lucide-react"
import './AddressDeleteModal.css'

export default function AddressDeleteModal({ 
  show, 
  onClose, 
  address,
  onConfirm
}) {
  if (!show) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">주소 삭제</h3>
          <button className="close-button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p className="delete-message">다음 주소를 삭제하시겠습니까?</p>
          
          {address && (
            <div className="address-preview">
              <p className="address-preview-main">{address.address}</p>
              <p className="address-preview-detail">{address.detail}</p>
              <p className="address-preview-alias">별칭: {address.alias}</p>
            </div>
          )}
          
          <p className="warning-message">
            삭제된 주소는 복구할 수 없습니다.
          </p>

          <div className="modal-actions">
            <button onClick={handleConfirm} className="danger-button">
              삭제하기
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