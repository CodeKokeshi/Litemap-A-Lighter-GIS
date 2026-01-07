/**
 * LiteMap - A Working Lightweight Google Maps Alternative
 * 
 * INTERACTION TYPES:
 * 1. MANIPULATING - Direct manipulation of the map (drag, zoom, pinch)
 * 2. INSTRUCTING - Commands via search, buttons, forms
 */

import { useState, useRef } from 'react'
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

// Component to handle map events and controls
function MapController({ center, zoom, onMapClick, onLocationFound, onMapMove }) {
  const map = useMap()
  
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng)
    },
    locationfound: (e) => {
      onLocationFound(e.latlng)
      map.flyTo(e.latlng, 15)
    },
    moveend: () => {
      // Track the actual map center when user pans/zooms
      const center = map.getCenter()
      onMapMove([center.lat, center.lng])
    }
  })

  // Update map view when center/zoom changes
  if (center) {
    map.flyTo(center, zoom || map.getZoom())
  }

  return null
}

// Zoom control component
function ZoomControls() {
  const map = useMap()
  
  return (
    <div className="zoom-controls">
      <button 
        onClick={() => map.zoomIn()} 
        aria-label="Zoom in"
      >
        +
      </button>
      <button 
        onClick={() => map.zoomOut()} 
        aria-label="Zoom out"
      >
        −
      </button>
    </div>
  )
}

// Locate me button
function LocateButton({ onLocate }) {
  const map = useMap()
  
  const handleLocate = () => {
    map.locate({ setView: false })
    onLocate()
  }
  
  return (
    <button 
      className="locate-btn"
      onClick={handleLocate}
      aria-label="Find my location"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
      </svg>
    </button>
  )
}

function App() {
  // Map state
  const [mapCenter, setMapCenter] = useState([14.5995, 120.9842]) // Manila, Philippines
  const [currentViewCenter, setCurrentViewCenter] = useState([14.5995, 120.9842]) // Tracks actual map view
  const [mapZoom, setMapZoom] = useState(13)
  const [markers, setMarkers] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  // Category filters - INSTRUCTING examples
  const categories = [
    { id: 'restaurant', label: 'Food', icon: '🍔' },
    { id: 'hospital', label: 'Hospital', icon: '🏥' },
    { id: 'fuel', label: 'Gas', icon: '⛽' },
    { id: 'atm', label: 'ATM', icon: '🏧' },
    { id: 'pharmacy', label: 'Pharmacy', icon: '💊' },
    { id: 'parking', label: 'Parking', icon: '🅿️' },
  ]
  
  // UI state
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedPlace, setSelectedPlace] = useState(null)
  
  const searchInputRef = useRef(null)

  // Search for places using Nominatim (free OpenStreetMap geocoding)
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setActiveFilter(null) // Clear filter when searching
    setIsSearching(true)
    try {
      // Bias search towards current map view
      const [lat, lon] = currentViewCenter
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&viewbox=${lon-0.5},${lat+0.5},${lon+0.5},${lat-0.5}&bounded=0`
      )
      const data = await response.json()
      setSearchResults(data)
      setShowSidebar(true)
      
      // If results found, zoom to first result
      if (data.length > 0) {
        const first = data[0]
        setMapCenter([parseFloat(first.lat), parseFloat(first.lon)])
        setMapZoom(15)
      }
    } catch (error) {
      console.error('Search failed:', error)
    }
    setIsSearching(false)
  }

  // Filter by category - INSTRUCTING interaction
  const handleCategoryFilter = async (category) => {
    if (activeFilter === category.id) {
      setActiveFilter(null)
      setSearchResults([])
      // Clear filter markers when deselecting
      setMarkers(prev => prev.filter(m => m.type !== 'filter'))
      return
    }
    
    setActiveFilter(category.id)
    setSearchQuery('')
    setIsSearching(true)
    
    try {
      // Search near CURRENT map view (not initial center)
      const [lat, lon] = currentViewCenter
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${category.id}&limit=10&viewbox=${lon-0.1},${lat+0.1},${lon+0.1},${lat-0.1}&bounded=1`
      )
      const data = await response.json()
      setSearchResults(data)
      
      // Auto-drop pins for filter results on the map
      const filterMarkers = data.map((result, index) => ({
        id: `filter-${index}`,
        position: [parseFloat(result.lat), parseFloat(result.lon)],
        name: result.display_name.split(',')[0],
        type: 'filter'
      }))
      // Replace old filter markers with new ones
      setMarkers(prev => [...prev.filter(m => m.type !== 'filter'), ...filterMarkers])
      
      // Don't auto-open sidebar - let user choose via hamburger
    } catch (error) {
      console.error('Filter search failed:', error)
    }
    setIsSearching(false)
  }

  // Handle clicking on a search result
  const handleResultClick = (result) => {
    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)
    setMapCenter([lat, lon])
    setMapZoom(16)
    setSelectedPlace({
      name: result.display_name.split(',')[0],
      address: result.display_name,
      lat,
      lon
    })
    // Add marker
    setMarkers(prev => [...prev.filter(m => m.id !== 'search'), {
      id: 'search',
      position: [lat, lon],
      name: result.display_name.split(',')[0],
      type: 'search'
    }])
  }

  // Handle map click - close popup/deselect (no more pin dropping)
  const handleMapClick = (latlng) => {
    // Just deselect any selected place when clicking empty map area
    setSelectedPlace(null)
  }

  // Handle location found
  const handleLocationFound = (latlng) => {
    setUserLocation([latlng.lat, latlng.lng])
    setMapCenter([latlng.lat, latlng.lng])
  }

  // Clear all markers
  const clearMarkers = () => {
    setMarkers([])
    setSelectedPlace(null)
    setActiveFilter(null) // Also clear active filter
    setSearchResults([]) // Clear search results
  }

  return (
    <div className="app">
      {/* HEADER - Search Bar (INSTRUCTING interaction) */}
      <header className="header">
        <button 
          className="menu-btn"
          onClick={() => setShowSidebar(!showSidebar)}
          aria-label="Menu"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>

        <div className="brand">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path fill="#4285f4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle fill="#fff" cx="12" cy="9" r="2.5"/>
          </svg>
          <span>LiteMap</span>
        </div>

        {/* Search Form - INSTRUCTING */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search for a place"
          />
          <button type="submit" disabled={isSearching} aria-label="Search">
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
        {/* Sidebar Overlay - tap to close */}
        {showSidebar && (
          <div 
            className="sidebar-overlay" 
            onClick={() => setShowSidebar(false)}
            aria-hidden="true"
          />
        )}

        {/* SIDEBAR - Results & Info (INSTRUCTING) */}
        <aside className={`sidebar ${showSidebar ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>
              {searchResults.length > 0 
                ? (activeFilter 
                    ? `${categories.find(c => c.id === activeFilter)?.label || 'Results'} Nearby`
                    : 'Search Results')
                : 'LiteMap'}
            </h2>
            <button 
              className="sidebar-close"
              onClick={() => setShowSidebar(false)}
              aria-label="Close sidebar"
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
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="sidebar-empty">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="#dadce0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <p>Search for a place</p>
              </div>
            )}

            {/* Selected Place Info - Bottom Sheet */}
            {selectedPlace && (
              <div className="place-card">
                <h3>{selectedPlace.name}</h3>
                <p>{selectedPlace.address}</p>
                <div className="place-actions">
                  <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lon}`, '_blank')}>
                    Directions
                  </button>
                  <button onClick={() => {
                    navigator.clipboard.writeText(`${selectedPlace.lat}, ${selectedPlace.lon}`)
                  }}>
                    Share
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {markers.length > 0 && (
              <div className="quick-actions">
                <button className="clear-btn" onClick={clearMarkers}>
                  Clear All Pins
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* MAP - Main interaction area (MANIPULATING) */}
        <div className="map-wrapper">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            className="map"
            zoomControl={false}
            attributionControl={false}
          >
            {/* Map tiles - Clean without attribution */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Map controller for events */}
            <MapController 
              center={null}
              zoom={mapZoom}
              onMapClick={handleMapClick}
              onLocationFound={handleLocationFound}
              onMapMove={setCurrentViewCenter}
            />
            
            {/* Custom zoom controls */}
            <ZoomControls />
            
            {/* Locate button */}
            <LocateButton onLocate={() => {}} />
            
            {/* User location marker */}
            {userLocation && (
              <Marker position={userLocation} icon={blueIcon}>
                <Popup>📍 You are here</Popup>
              </Marker>
            )}
            
            {/* Custom markers */}
            {markers.map(marker => (
              <Marker 
                key={marker.id} 
                position={marker.position}
                icon={marker.type === 'search' ? redIcon : greenIcon}
              >
                <Popup>
                  <strong>{marker.name}</strong>
                  <br />
                  <small>{marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}</small>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Custom LiteMap attribution - above zoom controls */}
          <div className="map-attribution">
            LiteMap
          </div>

          {/* Category Filters - INSTRUCTING */}
          <div className={`category-filters-wrapper ${showSidebar ? 'sidebar-open' : ''}`}>
            <button 
              className="scroll-arrow scroll-left"
              onClick={(e) => {
                e.stopPropagation()
                const container = e.target.closest('.category-filters-wrapper').querySelector('.category-filters')
                container.scrollBy({ left: -150, behavior: 'smooth' })
              }}
              aria-label="Scroll left"
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
                  aria-label={`Find ${cat.label}`}
                >
                  <span className="chip-icon">{cat.icon}</span>
                  <span className="chip-label">{cat.label}</span>
                </button>
              ))}
            </div>
            <button 
              className="scroll-arrow scroll-right"
              onClick={(e) => {
                e.stopPropagation()
                const container = e.target.closest('.category-filters-wrapper').querySelector('.category-filters')
                container.scrollBy({ left: 150, behavior: 'smooth' })
              }}
              aria-label="Scroll right"
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
