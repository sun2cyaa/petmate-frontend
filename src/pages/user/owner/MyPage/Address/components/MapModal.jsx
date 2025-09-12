import { useState, useEffect } from "react"
import { X, MapPin, Loader2, Navigation } from "lucide-react"
import './MapModal.css'

export default function MapModal({
    show,
    onClose,
    onLocationSelect
}) {
    const [isKakaoLoaded, setIsKakaoLoaded] = useState(false)
    const [map, setMap] = useState(null)
    const [marker, setMarker] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [isLoadingLocation, setIsLoadingLocation] = useState(false)

    // 카카오 맵 스크립트 로드
    useEffect(() => {
        if (!show) return

        const loadKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
                setIsKakaoLoaded(true)
                return
            }

            const script = document.createElement("script")
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&autoload=false&libraries=services`
            script.async = true

            script.onload = () => {
                window.kakao.maps.load(() => {
                    setIsKakaoLoaded(true)
                })
            }

            script.onerror = () => {
                console.error("카카오 맵 스크립트 로딩에 실패했습니다.")
            }

            document.head.appendChild(script)
        }

        loadKakaoMap()
    }, [show])

    // 지도 초기화
    useEffect(() => {
        if (!isKakaoLoaded || !show) return

        const initializeMap = () => {
            const container = document.getElementById("modal-map")
            if (!container) return

            // 서울시청을 기본 위치로 설정
            const defaultPosition = new window.kakao.maps.LatLng(37.5665, 126.9780)

            const options = {
                center: defaultPosition,
                level: 3,
            }

            const newMap = new window.kakao.maps.Map(container, options)
            setMap(newMap)

            // 기본 마커 생성
            const newMarker = new window.kakao.maps.Marker({
                position: defaultPosition,
                draggable: true
            })
            newMarker.setMap(newMap)
            setMarker(newMarker)

            // 초기 위치 정보 설정
            const initialLocation = {
                address: "서울특별시 중구 태평로1가 31 (서울시청)",
                latitude: 37.5665,
                longitude: 126.9780
            }
            setSelectedLocation(initialLocation)

            // Geocoder 객체 생성
            const geocoder = new window.kakao.maps.services.Geocoder()

            // 마커 드래그 이벤트
            window.kakao.maps.event.addListener(newMarker, 'dragend', function () {
                const position = newMarker.getPosition()

                // 좌표로 주소 검색
                geocoder.coord2Address(position.getLng(), position.getLat(), function (result, status) {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const address = result[0].address.address_name
                        setSelectedLocation({
                            address: address,
                            latitude: position.getLat(),
                            longitude: position.getLng()
                        })
                    }
                })
            })

            // 지도 클릭 이벤트
            window.kakao.maps.event.addListener(newMap, 'click', function (mouseEvent) {
                const position = mouseEvent.latLng

                // 마커 위치 이동
                newMarker.setPosition(position)

                // 좌표로 주소 검색
                geocoder.coord2Address(position.getLng(), position.getLat(), function (result, status) {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const address = result[0].address.address_name
                        const postcode = result[0].address.zone_no || result[0].road_address?.zone_no || ""
                        console.log('지도 클릭 - 좌표로 검색된 결과:', result[0])
                        console.log('지도 클릭 - address 객체:', result[0].address)
                        console.log('지도 클릭 - road_address 객체:', result[0].road_address)
                        setSelectedLocation({
                            address: address,
                            postcode: postcode,
                            latitude: position.getLat(),
                            longitude: position.getLng()
                        })
                    }
                })
            })

            // 현재 위치로 이동 시도
            getCurrentLocationAndMove(newMap, newMarker, geocoder)
        }

        initializeMap()
    }, [isKakaoLoaded, show])

    const getCurrentLocationAndMove = (mapInstance, markerInstance, geocoder) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude
                    const lng = position.coords.longitude
                    const currentPosition = new window.kakao.maps.LatLng(lat, lng)

                    // 지도 중심과 마커를 현재 위치로 이동
                    mapInstance.setCenter(currentPosition)
                    markerInstance.setPosition(currentPosition)

                    // 현재 위치의 주소 검색
                    geocoder.coord2Address(lng, lat, function (result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const address = result[0].address.address_name
                            const postcode = result[0].address.zone_no || result[0].road_address?.zone_no || ""
                            console.log('현재 위치 - 좌표로 검색된 결과:', result[0])
                            console.log('현재 위치 - address 객체:', result[0].address)
                            console.log('현재 위치 - road_address 객체:', result[0].road_address)
                            setSelectedLocation({
                                address: address,
                                postcode: postcode,
                                latitude: lat,
                                longitude: lng
                            })
                        }
                    })
                },
                (error) => {
                    console.log("위치 정보를 가져올 수 없습니다:", error)
                }
            )
        }
    }

    const handleCurrentLocation = () => {
        if (!map || !marker) return

        setIsLoadingLocation(true)

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude
                    const lng = position.coords.longitude
                    const currentPosition = new window.kakao.maps.LatLng(lat, lng)

                    // 지도 중심과 마커를 현재 위치로 이동
                    map.setCenter(currentPosition)
                    marker.setPosition(currentPosition)

                    // Geocoder로 주소 검색
                    const geocoder = new window.kakao.maps.services.Geocoder()
                    geocoder.coord2Address(lng, lat, function (result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const address = result[0].address.address_name
                            const postcode = result[0].address.zone_no || result[0].road_address?.zone_no || ""
                            console.log('현재위치 버튼 - 좌표로 검색된 결과:', result[0])
                            console.log('현재위치 버튼 - address 객체:', result[0].address)
                            console.log('현재위치 버튼 - road_address 객체:', result[0].road_address)
                            setSelectedLocation({
                                address: address,
                                postcode: postcode,
                                latitude: lat,
                                longitude: lng
                            })
                        }
                    })

                    setIsLoadingLocation(false)
                },
                (error) => {
                    console.error("위치 정보를 가져올 수 없습니다:", error)
                    alert("현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.")
                    setIsLoadingLocation(false)
                }
            )
        }
    }

    const handleLocationSelect = () => {
        if (selectedLocation) {
            onLocationSelect?.(selectedLocation)
        }
        onClose()
    }

    if (!show) return null

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
                    {!isKakaoLoaded && (
                        <div className="map-loading">
                            <Loader2 size={32} className="spin" />
                            <p>지도를 로딩 중...</p>
                        </div>
                    )}
                    <div
                        id="modal-map"
                        style={{
                            width: "100%",
                            height: "400px",
                            display: isKakaoLoaded ? 'block' : 'none'
                        }}
                    ></div>
                </div>

                <div className="map-info">
                    <div className="location-info">
                        <MapPin size={16} />
                        <span>{selectedLocation?.address || "위치를 선택해주세요"}</span>
                    </div>
                    <button
                        className="current-location-btn"
                        onClick={handleCurrentLocation}
                        disabled={isLoadingLocation}
                    >
                        {isLoadingLocation ? <Loader2 size={16} className="spin" /> : <Navigation size={16} />}
                        현재 위치로 이동
                    </button>
                </div>

                <div className="map-actions">
                    <button
                        onClick={handleLocationSelect}
                        className="select-location-button"
                        disabled={!selectedLocation}
                    >
                        이 위치로 설정
                    </button>
                </div>
            </div>
        </div>
    )
}