import { useState, useEffect } from "react"
import * as addressService from '../../../../../services/addressService'
import './AddressManagePage.css'
import {
  ArrowLeft,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Home,
  Building2,
  MapPinned,
  Clock,
  Search,
  Star,
  Navigation,
  Loader2,
} from "lucide-react"
import AddressAddModal from './components/AddressAddModal'
import AddressEditModal from './components/AddressEditModal'
import AddressDeleteModal from './components/AddressDeleteModal'
import MapModal from './components/MapModal'

const searchAddressAPI = async (query) => {
  try {
    const response = await fetch(`/api/address/search?query=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error("API request failed")
    const data = await response.json()
    return data.results || []
  } catch {
    return [
      { id: "1", address: `${query} 123`, roadAddress: `${query} 123 (도로명)`, jibunAddress: `${query} 123 (지번)`, x: "127.027621", y: "37.497175" },
      { id: "2", address: `${query} 124`, roadAddress: `${query} 124 (도로명)`, jibunAddress: `${query} 124 (지번)`, x: "127.027721", y: "37.497275" },
    ]
  }
}

const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error("Geolocation is not supported")); return }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  })

const getAddressFromCoords = async (lat, lng) => {
  try {
    const response = await fetch(`/api/address/reverse?lat=${lat}&lng=${lng}`)
    if (!response.ok) throw new Error("Reverse geocoding failed")
    const data = await response.json()
    return data.address || "주소를 찾을 수 없습니다"
  } catch {
    return "서울시 강남구 테헤란로 427 (현재 위치)"
  }
}

export default function AddressManagePage({ user, onBack }) {
  // 사용자의 주소 목록 로드
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        const addresses = await addressService.getAddresses()
        
        const formattedAddresses = addresses.map(addr => ({
          id: addr.id,
          type: addr.type,
          typeName: addr.type === "home" ? "집" : addr.type === "office" ? "회사" : "기타",
          icon: addr.type === "home" ? Home : addr.type === "office" ? Building2 : MapPinned,
          address: addr.address,
          detail: addr.detail,
          alias: addr.alias,
          isDefault: addr.isDefault,
          distance: "거리 계산 중...",
          color: "",
        }))
        
        setSavedAddresses(formattedAddresses)
      } catch (error) {
        console.error('주소 목록 로드 오류:', error)
        setSavedAddresses([])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAddresses()
  }, [user])
  const [activeTab, setActiveTab] = useState("address")
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAddressForAction, setSelectedAddressForAction] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [recentSearches, setRecentSearches] = useState(["서울시 강남구 테헤란로", "서울시 서초구 강남대로", "서울시 송파구 올림픽로"])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const pastBookingAddresses = [
    { id: "past-1", address: "서울시 용산구 이태원로 123", detail: "301호", date: "2024-01-15", petMateName: "김펫메이트" },
    { id: "past-2", address: "서울시 종로구 종로 456", detail: "2층", date: "2024-01-10", petMateName: "박펫메이트" },
    { id: "past-3", address: "서울시 성동구 왕십리로 789", detail: "B1층", date: "2024-01-05", petMateName: "이펫메이트" },
  ]

  const handleAddressSearch = async (query) => {
    setSearchQuery(query)
    if (query.length > 1) {
      setIsSearching(true)
      try {
        const results = await searchAddressAPI(query)
        setSearchResults(results)
        if (!recentSearches.includes(query)) setRecentSearches((prev) => [query, ...prev.slice(0, 4)])
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    } else {
      setSearchResults([])
    }
  }

  const handleCurrentLocation = async () => {
    setIsGettingLocation(true)
    try {
      const coords = await getCurrentLocation()
      const address = await getAddressFromCoords(coords.latitude, coords.longitude)
      setSearchQuery(address)
      setSearchResults([])
      const currentLocationResult = { id: "current-location", address, roadAddress: address, jibunAddress: address, x: coords.longitude.toString(), y: coords.latitude.toString() }
      setSelectedAddress(currentLocationResult)
    } catch {
      alert("현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.")
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleAddressSelect = (result) => {
    setSearchQuery(result.roadAddress || result.address)
    setSelectedAddress(result)
    setSearchResults([])
  }

  const handleAddToAddressBook = (pastAddress) => {
    const existingAddress = savedAddresses.find((addr) => addr.address === pastAddress.address && addr.detail === pastAddress.detail)
    if (existingAddress) { alert("이미 저장된 주소입니다."); return }
    const newAddress = {
      id: Date.now(),
      type: "other",
      typeName: "기타",
      icon: MapPinned,
      address: pastAddress.address,
      detail: pastAddress.detail,
      alias: `${pastAddress.petMateName} 방문지`,
      isDefault: false,
      distance: "거리 계산 중...",
      color: "",
    }
    setSavedAddresses((prev) => [...prev, newAddress])
    alert("주소가 주소록에 추가되었습니다!")
  }

  const handleDeleteClick = (address) => {
    setSelectedAddressForAction(address)
    setShowDeleteModal(true)
  }

  const handleEditClick = (address) => {
    setSelectedAddressForAction(address)
    setShowEditModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await addressService.deleteAddress(selectedAddressForAction.id)
      setSavedAddresses((prev) => prev.filter((addr) => addr.id !== selectedAddressForAction.id))
      setSelectedAddressForAction(null)
      alert("주소가 삭제되었습니다.")
    } catch (error) {
      console.error('주소 삭제 오류:', error)
      alert(error.response?.data?.message || "주소 삭제 중 오류가 발생했습니다.")
    }
  }

  const handleSaveEdit = async (editFormData) => {
    try {
      const updatedAddress = await addressService.updateAddress(selectedAddressForAction.id, editFormData)
      
      setSavedAddresses((prev) =>
        prev.map((addr) =>
          addr.id === selectedAddressForAction.id
            ? {
                ...addr,
                type: updatedAddress.type,
                typeName: updatedAddress.type === "home" ? "집" : updatedAddress.type === "office" ? "회사" : "기타",
                icon: updatedAddress.type === "home" ? Home : updatedAddress.type === "office" ? Building2 : MapPinned,
                address: updatedAddress.address,
                detail: updatedAddress.detail,
                alias: updatedAddress.alias,
                isDefault: updatedAddress.isDefault,
              }
            : addr,
        ),
      )
      setSelectedAddressForAction(null)
      alert("주소가 수정되었습니다.")
    } catch (error) {
      console.error('주소 수정 오류:', error)
      alert(error.response?.data?.message || "주소 수정 중 오류가 발생했습니다.")
    }
  }

  const handleAddAddress = async (newAddressData) => {
    try {
      const savedAddress = await addressService.createAddress(newAddressData)
      
      const newAddress = {
        id: savedAddress.id,
        type: savedAddress.type,
        typeName: savedAddress.type === "home" ? "집" : savedAddress.type === "office" ? "회사" : "기타",
        icon: savedAddress.type === "home" ? Home : savedAddress.type === "office" ? Building2 : MapPinned,
        address: savedAddress.address,
        detail: savedAddress.detail,
        alias: savedAddress.alias,
        isDefault: savedAddress.isDefault,
        distance: "거리 계산 중...",
        color: "",
      }
      
      setSavedAddresses(prev => [...prev, newAddress])
      alert("주소가 추가되었습니다!")
    } catch (error) {
      console.error('주소 저장 오류:', error)
      alert(error.response?.data?.message || "주소 저장 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="address-page">
      <div className="address-main">
        <div className="address-content">
          <div className="section-header">
            <div>
              <h2 className="section-title">주소 관리</h2>
              <p className="section-subtitle">회원님의 주소를 관리하세요</p>
            </div>
            <button className="add-button" onClick={() => setShowAddressModal(true)}>
              <Plus size={16} />
              주소 추가
            </button>
          </div>

          {/* <div className="search-card">
            <div className="search-content">
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="도로명, 건물명으로 검색"
                  value={searchQuery}
                  onChange={(e) => handleAddressSearch(e.target.value)}
                  className="search-input"
                />
                {isSearching && <Loader2 size={16} className="loading-icon" />}
              </div>

              <div className="action-buttons">
                <button className="outline-button" onClick={handleCurrentLocation} disabled={isGettingLocation}>
                  {isGettingLocation ? <Loader2 size={16} className="spin" /> : <Navigation size={16} />}
                  현재 위치로 찾기
                </button>
                <button className="outline-button" onClick={() => setShowMapModal(true)}>
                  <MapPin size={16} />
                  지도에서 찾기
                </button>
              </div>
            </div>
          </div> */}

          <div className="addresses-section">
            <h3>저장된 주소</h3>
            <div className="addresses-list">
              {isLoading ? (
                <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                  주소 목록을 불러오는 중...
                </div>
              ) : savedAddresses.length === 0 ? (
                <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                  저장된 주소가 없습니다.
                </div>
              ) : (
                savedAddresses.map((address) => {
                const IconComponent = address.icon
                return (
                  <div key={address.id} className="address-card">
                    <div className="address-card-content">
                      <div className="address-info">
                        <div className="address-icon-wrapper">
                          <IconComponent size={20} />
                        </div>
                        <div className="address-details">
                          <div className="address-type-row">
                            <span className="address-type">{address.typeName}</span>
                            {address.isDefault && (
                              <span className="default-badge">
                                <Star size={12} />
                                기본
                              </span>
                            )}
                          </div>
                          <p className="address-main-text">{address.address}</p>
                          <p className="address-detail-text">{address.detail}</p>
                          <div className="address-meta">
                            <span>{address.distance}</span>
                            <span>별칭: {address.alias}</span>
                          </div>
                        </div>
                      </div>
                      <div className="address-actions">
                        <button className="icon-button" onClick={() => handleEditClick(address)}>
                          <Edit size={16} />
                        </button>
                        <button className="icon-button" onClick={() => handleDeleteClick(address)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
                })
              )}
            </div>
          </div>

          <div className="history-section">
            <h3>과거 예약 주소</h3>
            {pastBookingAddresses.map((history) => (
              <div key={history.id} className="history-card">
                <div className="history-card-content">
                  <div>
                    <p className="history-address">{history.address}</p>
                    <p className="history-detail">{history.detail}</p>
                    <p className="history-meta">사용일: {history.date} | 펫메이트: {history.petMateName}</p>
                  </div>
                  <button className="small-button" onClick={() => handleAddToAddressBook(history)}>
                    주소록에 추가
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AddressAddModal
          show={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedAddress={selectedAddress}
          isSearching={isSearching}
          onAddressSearch={handleAddressSearch}
          onSave={handleAddAddress}
        />

        <AddressEditModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          address={selectedAddressForAction}
          onSave={handleSaveEdit}
        />

        <AddressDeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          address={selectedAddressForAction}
          onConfirm={handleConfirmDelete}
        />

        <MapModal
          show={showMapModal}
          onClose={() => setShowMapModal(false)}
          onLocationSelect={(location) => {
            setSearchQuery(location.address)
            setSelectedAddress({
              id: "map-selected",
              address: location.address,
              x: location.longitude,
              y: location.latitude
            })
          }}
        />
      </div>
    </div>
  )
}