/**
 * LiteMap - A Working Lightweight Google Maps Alternative
 * 
 * INTERACTION TYPES:
 * 1. MANIPULATING - Direct manipulation of the map (drag, zoom, pinch)
 * 2. INSTRUCTING - Commands via search, buttons, forms
 * 
 * BIAS SYSTEM:
 * - All searches/filters are based on a "bias point"
 * - Bias point is either: user location (blue) OR dropped pin (orange)
 * - Dropping a pin replaces user location as bias
 * - Pressing locate me sets user location as bias
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'

// Leaflet imports
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom marker icons
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const redIcon = createIcon('red')
const blueIcon = createIcon('blue')
const greenIcon = createIcon('green')
const orangeIcon = createIcon('orange')

// Haversine formula - calculates accurate distance between two lat/lon points
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Format distance for display
function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`
  } else if (km < 10) {
    return `${km.toFixed(1)} km`
  } else {
    return `${Math.round(km)} km`
  }
}

// Component to store map instance reference
function MapInstanceGrabber({ onMapReady }) {
  const map = useMap()
  useEffect(() => {
    onMapReady(map)
  }, [map, onMapReady])
  return null
}

// Component to handle map click events - checks if click is on map tiles only
function MapClickHandler({ onMapClick, disabled }) {
  useMapEvents({
    click: (e) => {
      if (disabled) return
      // Check if click originated from a control, button, or marker
      const target = e.originalEvent?.target
      if (!target) return
      
      const isControl = target.closest('.leaflet-control') || 
                       target.closest('.zoom-controls') || 
                       target.closest('.locate-btn') ||
                       target.closest('.leaflet-marker-icon') ||
                       target.closest('.leaflet-popup') ||
                       target.closest('button')
      
      if (!isControl) {
        onMapClick(e.latlng)
      }
    }
  })
  return null
}

// Component to handle flying to location with animation
function FlyToHandler({ flyTarget, onComplete }) {
  const map = useMap()
  
  useEffect(() => {
    if (flyTarget) {
      map.flyTo(flyTarget.position, flyTarget.zoom, { duration: 1.2 })
      
      const timeout = setTimeout(() => {
        if (onComplete) onComplete()
      }, 1300)
      
      return () => clearTimeout(timeout)
    }
  }, [flyTarget, map, onComplete])
  
  return null
}

// Component to request geolocation
function GeolocateHandler({ trigger, onLocated, onError }) {
  const map = useMap()
  
  useEffect(() => {
    if (trigger) {
      map.locate({ setView: false, enableHighAccuracy: true })
    }
  }, [trigger, map])
  
  useMapEvents({
    locationfound: (e) => {
      onLocated([e.latlng.lat, e.latlng.lng])
    },
    locationerror: (e) => {
      console.error('Location error:', e.message)
      if (onError) onError(e.message)
    }
  })
  
  return null
}

function App() {
  // Map initial center (Carmona, Cavite area)
  const [mapCenter] = useState([14.4324, 120.9619])
  
  // Bias point - the reference location for all searches
  // Can be either user location or dropped pin location
  const [biasLocation, setBiasLocation] = useState(null)
  const [biasType, setBiasType] = useState(null) // 'user' or 'dropped'
  
  // Fly animation state
  const [flyTarget, setFlyTarget] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Geolocation trigger
  const [geoTrigger, setGeoTrigger] = useState(0)
  
  // Markers
  const [filterMarkers, setFilterMarkers] = useState([])
  const [searchMarker, setSearchMarker] = useState(null)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  // Category filters
  const categories = [
    { id: 'church', label: 'Church', icon: '⛪' },
    { id: 'restaurant', label: 'Food', icon: '🍔' },
    { id: 'hospital', label: 'Hospital', icon: '🏥' },
    { id: 'fuel', label: 'Gas', icon: '⛽' },
    { id: 'atm', label: 'ATM', icon: '🏧' },
    { id: 'pharmacy', label: 'Pharmacy', icon: '💊' },
  ]
  
  // UI state
  const [showSidebar, setShowSidebar] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)
  
  // Map instance ref (not MapContainer, actual Leaflet map)
  const mapInstanceRef = useRef(null)
  
  const handleMapReady = useCallback((map) => {
    mapInstanceRef.current = map
  }, [])
  
  // Zoom functions
  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn()
    }
  }, [])
  
  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut()
    }
  }, [])

  // Fly to a location with animation
  const flyTo = useCallback((position, zoom = 16) => {
    setIsAnimating(true)
    setShowSidebar(false)
    setFlyTarget({ position, zoom, timestamp: Date.now() })
  }, [])
  
  // Animation complete handler
  const handleFlyComplete = useCallback(() => {
    setIsAnimating(false)
    setFlyTarget(null)
  }, [])

  // Handle locate me button press
  const handleLocateMe = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setGeoTrigger(prev => prev + 1) // Increment to trigger new locate
  }, [isAnimating])

  // When user location is found
  const handleLocationFound = useCallback((position) => {
    // Set as bias location
    setBiasLocation(position)
    setBiasType('user')
    
    // Fly to location
    flyTo(position, 16)
  }, [flyTo])

  // Handle map click - drop a pin
  const handleMapClick = useCallback(async (latlng) => {
    if (isAnimating) return
    
    const { lat, lng } = latlng
    const position = [lat, lng]
    
    // Set as new bias location (replaces user location)
    setBiasLocation(position)
    setBiasType('dropped')
    
    // Reverse geocode to get address info
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`
      )
      const data = await response.json()
      
      setSelectedPlace({
        name: data.name || data.display_name?.split(',')[0] || 'Dropped Pin',
        address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        lat,
        lon: lng
      })
    } catch (error) {
      setSelectedPlace({
        name: 'Dropped Pin',
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        lat,
        lon: lng
      })
    }
    
    setShowSidebar(true)
  }, [isAnimating])

  // Ensure we have a bias location (auto-locate if needed)
  const ensureBiasLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (biasLocation) {
        resolve(biasLocation)
      } else {
        // Need to get user location first
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = [pos.coords.latitude, pos.coords.longitude]
            setBiasLocation(loc)
            setBiasType('user')
            flyTo(loc, 15)
            setTimeout(() => resolve(loc), 1400)
          },
          (err) => {
            console.error('Geolocation error:', err)
            // Fallback to default location
            const fallback = [14.4324, 120.9619]
            setBiasLocation(fallback)
            setBiasType('user')
            resolve(fallback)
          },
          { enableHighAccuracy: true }
        )
      }
    })
  }, [biasLocation, flyTo])

  // Search for places
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim() || isAnimating) return
    
    setActiveFilter(null)
    setIsSearching(true)
    setFilterMarkers([])
    
    // Ensure we have a bias location
    const bias = await ensureBiasLocation()
    const [lat, lon] = bias
    
    try {
      // Search with tight local bias first (~5km radius = 0.045 degrees)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=20&viewbox=${lon-0.045},${lat+0.045},${lon+0.045},${lat-0.045}&bounded=1`
      )
      let data = await response.json()
      
      // If no local results, widen to ~15km
      if (data.length === 0) {
        const widerResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=20&viewbox=${lon-0.15},${lat+0.15},${lon+0.15},${lat-0.15}&bounded=1`
        )
        data = await widerResponse.json()
      }
      
      // If still no results, search Philippines-wide
      if (data.length === 0) {
        const fallbackResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=20&countrycodes=ph`
        )
        data = await fallbackResponse.json()
      }
      
      // Calculate actual distance and sort by it
      data = data.map(item => ({
        ...item,
        distance: getDistanceKm(lat, lon, parseFloat(item.lat), parseFloat(item.lon))
      }))
      data.sort((a, b) => a.distance - b.distance)
      
      setSearchResults(data.slice(0, 6))
      setShowSidebar(true)
      
    } catch (error) {
      console.error('Search failed:', error)
    }
    setIsSearching(false)
  }

  // Filter by category
  const handleCategoryFilter = async (category) => {
    if (isAnimating) return
    
    if (activeFilter === category.id) {
      setActiveFilter(null)
      setSearchResults([])
      setFilterMarkers([])
      return
    }
    
    setActiveFilter(category.id)
    setSearchQuery('')
    setIsSearching(true)
    setSearchMarker(null)
    
    // Ensure we have a bias location
    const bias = await ensureBiasLocation()
    const [lat, lon] = bias
    
    try {
      // Search tight radius first (~3km)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${category.id}&limit=30&viewbox=${lon-0.03},${lat+0.03},${lon+0.03},${lat-0.03}&bounded=1`
      )
      let data = await response.json()
      
      // If not enough results, widen to ~8km
      if (data.length < 5) {
        const widerResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${category.id}&limit=30&viewbox=${lon-0.08},${lat+0.08},${lon+0.08},${lat-0.08}&bounded=1`
        )
        const widerData = await widerResponse.json()
        // Merge and deduplicate by place_id
        const existingIds = new Set(data.map(d => d.place_id))
        widerData.forEach(item => {
          if (!existingIds.has(item.place_id)) data.push(item)
        })
      }
      
      // Calculate actual distance and sort
      data = data.map(item => ({
        ...item,
        distance: getDistanceKm(lat, lon, parseFloat(item.lat), parseFloat(item.lon))
      }))
      data.sort((a, b) => a.distance - b.distance)
      
      data = data.slice(0, 8)
      setSearchResults(data)
      
      // Create filter markers
      const markers = data.map((result, index) => ({
        id: `filter-${index}`,
        position: [parseFloat(result.lat), parseFloat(result.lon)],
        name: result.display_name.split(',')[0]
      }))
      setFilterMarkers(markers)
      setShowSidebar(true)
      
    } catch (error) {
      console.error('Filter search failed:', error)
    }
    setIsSearching(false)
  }

  // Handle clicking on a search result
  const handleResultClick = (result) => {
    if (isAnimating) return
    
    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)
    
    setSelectedPlace({
      name: result.display_name.split(',')[0],
      address: result.display_name,
      lat,
      lon
    })
    
    setSearchMarker({
      position: [lat, lon],
      name: result.display_name.split(',')[0]
    })
    
    // Fly to location with animation
    flyTo([lat, lon], 17)
  }

  // Clear all markers and results
  const clearAll = () => {
    setFilterMarkers([])
    setSearchMarker(null)
    setSelectedPlace(null)
    setActiveFilter(null)
    setSearchResults([])
    // Keep bias location
  }

  return (
    <div className={`app ${isAnimating ? 'animating' : ''}`}>
      {/* Loading overlay when animating */}
      {isAnimating && <div className="animation-overlay" />}
      
      {/* HEADER */}
      <header className="header">
        <button 
          className="menu-btn"
          onClick={() => !isAnimating && setShowSidebar(!showSidebar)}
          aria-label="Menu"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>

        <div className="brand">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="#4285f4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle fill="#fff" cx="12" cy="9" r="2.5"/>
          </svg>
          <span>LiteMap</span>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isAnimating}
            aria-label="Search for a place"
          />
          <button type="submit" disabled={isSearching || isAnimating} aria-label="Search">
            {isSearching ? (
              <span className="spinner"></span>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            )}
          </button>
        </form>
      </header>

      <main className="main">
        {/* Sidebar Overlay */}
        {showSidebar && (
          <div 
            className="sidebar-overlay" 
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside className={`sidebar ${showSidebar ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>
              {searchResults.length > 0 
                ? (activeFilter 
                    ? `${categories.find(c => c.id === activeFilter)?.label || 'Results'} Nearby`
                    : 'Search Results')
                : selectedPlace 
                    ? 'Location Info'
                    : 'LiteMap'}
            </h2>
            <button 
              className="sidebar-close"
              onClick={() => setShowSidebar(false)}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          
          <div className="sidebar-content">
            {/* Search Results */}
            {searchResults.length > 0 ? (
              <ul className="results-list">
                {searchResults.map((result, index) => (
                  <li key={index}>
                    <button 
                      className="result-item"
                      onClick={() => handleResultClick(result)}
                      disabled={isAnimating}
                    >
                      <div className="result-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="#ea4335">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                      </div>
                      <div className="result-info">
                        <strong>{result.display_name.split(',')[0]}</strong>
                        <small>{result.display_name.split(',').slice(1, 3).join(',')}</small>
                      </div>
                      {result.distance !== undefined && (
                        <span className="result-distance">{formatDistance(result.distance)}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : selectedPlace ? (
              <div className="place-card">
                <h3>{selectedPlace.name}</h3>
                <p>{selectedPlace.address}</p>
                <div className="place-actions">
                  <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lon}`, '_blank')}>
                    Directions
                  </button>
                  <button onClick={() => {
                    navigator.clipboard.writeText(`${selectedPlace.lat}, ${selectedPlace.lon}`)
                    alert('Coordinates copied!')
                  }}>
                    Share
                  </button>
                </div>
              </div>
            ) : (
              <div className="sidebar-empty">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="#dadce0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <p>Search for a place or tap the map</p>
              </div>
            )}

            {/* Quick Actions */}
            {(filterMarkers.length > 0 || searchMarker || selectedPlace) && (
              <div className="quick-actions">
                <button className="clear-btn" onClick={clearAll}>
                  Clear All
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* MAP */}
        <div className="map-wrapper">
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="map"
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Grab map instance for external controls */}
            <MapInstanceGrabber onMapReady={handleMapReady} />
            
            {/* Handle map clicks - only on map tiles */}
            <MapClickHandler onMapClick={handleMapClick} disabled={isAnimating} />
            
            {/* Handle geolocation */}
            <GeolocateHandler 
              trigger={geoTrigger} 
              onLocated={handleLocationFound}
              onError={(msg) => {
                alert('Could not find your location: ' + msg)
                setIsAnimating(false)
              }}
            />
            
            {/* Fly to animation handler */}
            <FlyToHandler flyTarget={flyTarget} onComplete={handleFlyComplete} />
            
            {/* Bias location marker - Blue for user, Orange for dropped */}
            {biasLocation && (
              <Marker 
                position={biasLocation} 
                icon={biasType === 'user' ? blueIcon : orangeIcon}
              >
                <Popup>
                  <strong>{biasType === 'user' ? '📍 You are here' : '📌 Dropped Pin'}</strong>
                </Popup>
              </Marker>
            )}
            
            {/* Search result marker */}
            {searchMarker && (
              <Marker position={searchMarker.position} icon={redIcon}>
                <Popup>
                  <strong>{searchMarker.name}</strong>
                </Popup>
              </Marker>
            )}
            
            {/* Filter markers */}
            {filterMarkers.map(marker => (
              <Marker 
                key={marker.id} 
                position={marker.position}
                icon={greenIcon}
              >
                <Popup>
                  <strong>{marker.name}</strong>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Zoom Controls - Outside of Leaflet */}
          <div className="zoom-controls">
            <button 
              onClick={handleZoomIn}
              aria-label="Zoom in"
            >
              +
            </button>
            <button 
              onClick={handleZoomOut}
              aria-label="Zoom out"
            >
              −
            </button>
          </div>

          {/* Locate Button - Outside of Leaflet */}
          <button 
            className="locate-btn"
            onClick={handleLocateMe}
            disabled={isAnimating}
            aria-label="Find my location"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
            </svg>
          </button>

          {/* Category Filters */}
          <div className={`category-filters-wrapper ${showSidebar ? 'sidebar-open' : ''}`}>
            <button 
              className="scroll-arrow scroll-left"
              onClick={(e) => {
                const container = e.currentTarget.closest('.category-filters-wrapper').querySelector('.category-filters')
                container.scrollBy({ left: -150, behavior: 'smooth' })
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <div className="category-filters">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-chip ${activeFilter === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter(cat)}
                  disabled={isAnimating}
                >
                  <span className="chip-icon">{cat.icon}</span>
                  <span className="chip-label">{cat.label}</span>
                </button>
              ))}
            </div>
            <button 
              className="scroll-arrow scroll-right"
              onClick={(e) => {
                const container = e.currentTarget.closest('.category-filters-wrapper').querySelector('.category-filters')
                container.scrollBy({ left: 150, behavior: 'smooth' })
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
