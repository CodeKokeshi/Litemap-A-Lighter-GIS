/**
 * MapView Component
 * 
 * PURPOSE: Display the map canvas with controls and markers
 * 
 * INTERACTION DESIGN:
 * - Map canvas: MANIPULATING - Drag to pan, scroll/pinch to zoom
 * - Zoom buttons: INSTRUCTING - Click to zoom in/out
 * - Location button: INSTRUCTING - Click to center on user location
 * - Fullscreen button: INSTRUCTING - Toggle fullscreen mode
 * - Markers: INSTRUCTING - Click to view location details
 * 
 * NOTE: This is a static UI mockup. The map is represented
 * by a styled SVG pattern. In production, this would integrate
 * with a real mapping library (Leaflet, Mapbox, etc.)
 */

import { useState } from 'react'
import './MapView.css'

// Sample markers for demonstration
const SAMPLE_MARKERS = [
  { id: 1, name: 'Central Park', lat: 40.785091, lng: -73.968285, type: 'park' },
  { id: 2, name: 'Times Square', lat: 40.758896, lng: -73.985130, type: 'landmark' },
  { id: 3, name: 'Empire State Building', lat: 40.748817, lng: -73.985428, type: 'building' },
  { id: 4, name: 'Your Location', lat: 40.730610, lng: -73.935242, type: 'user' }
]

function MapView({ selectedLocation, onLocationSelect, onDirectionsRequest, directions }) {
  const [zoomLevel, setZoomLevel] = useState(12)
  const [mapStyle, setMapStyle] = useState('default') // 'default', 'satellite', 'terrain'
  const [showLayers, setShowLayers] = useState(false)
  const [showTraffic, setShowTraffic] = useState(false)
  const [showTransit, setShowTransit] = useState(false)

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 20))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 1))

  // Handle marker click
  const handleMarkerClick = (marker) => {
    onLocationSelect(marker)
  }

  return (
    <div className="map-container">
      {/* Static Map Display - SVG representation */}
      <div className="map-canvas" role="application" aria-label="Map view">
        {/* Map Background Pattern - Simulates map tiles */}
        <svg 
          className="map-background" 
          viewBox="0 0 800 600" 
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Grid pattern for streets */}
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
            </pattern>
            
            {/* Water pattern */}
            <pattern id="water" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#a8d5e5"/>
            </pattern>
            
            {/* Park pattern */}
            <pattern id="park" width="30" height="30" patternUnits="userSpaceOnUse">
              <rect width="30" height="30" fill="#c8e6c9"/>
            </pattern>
          </defs>
          
          {/* Map base */}
          <rect width="100%" height="100%" fill="#f5f5f5"/>
          
          {/* Grid overlay */}
          <rect width="100%" height="100%" fill="url(#grid)"/>
          
          {/* Water body (Hudson River simulation) */}
          <path d="M 0 0 L 80 0 L 80 600 L 0 600 Z" fill="url(#water)" opacity="0.8"/>
          
          {/* Parks */}
          <rect x="250" y="80" width="200" height="120" rx="10" fill="url(#park)"/>
          <text x="350" y="145" textAnchor="middle" fontSize="12" fill="#2e7d32">Central Park</text>
          
          {/* Major roads */}
          <line x1="150" y1="0" x2="150" y2="600" stroke="#fff" strokeWidth="8"/>
          <line x1="150" y1="0" x2="150" y2="600" stroke="#ffeb3b" strokeWidth="2" strokeDasharray="10,5"/>
          
          <line x1="350" y1="0" x2="350" y2="600" stroke="#fff" strokeWidth="8"/>
          <line x1="350" y1="0" x2="350" y2="600" stroke="#ffeb3b" strokeWidth="2" strokeDasharray="10,5"/>
          
          <line x1="550" y1="0" x2="550" y2="600" stroke="#fff" strokeWidth="6"/>
          
          <line x1="0" y1="250" x2="800" y2="250" stroke="#fff" strokeWidth="8"/>
          <line x1="0" y1="250" x2="800" y2="250" stroke="#ffeb3b" strokeWidth="2" strokeDasharray="10,5"/>
          
          <line x1="0" y1="400" x2="800" y2="400" stroke="#fff" strokeWidth="6"/>
          
          {/* Highway */}
          <path d="M 700 0 Q 650 300 700 600" stroke="#ffa726" strokeWidth="12" fill="none"/>
          <path d="M 700 0 Q 650 300 700 600" stroke="#fff" strokeWidth="2" strokeDasharray="15,10" fill="none"/>
          
          {/* Buildings (blocks) */}
          <rect x="160" y="260" width="80" height="60" fill="#e0e0e0" rx="2"/>
          <rect x="260" y="260" width="60" height="60" fill="#e0e0e0" rx="2"/>
          <rect x="360" y="260" width="100" height="50" fill="#e0e0e0" rx="2"/>
          <rect x="360" y="320" width="80" height="70" fill="#e0e0e0" rx="2"/>
          <rect x="560" y="100" width="90" height="70" fill="#e0e0e0" rx="2"/>
          <rect x="560" y="260" width="120" height="60" fill="#e0e0e0" rx="2"/>
          <rect x="160" y="410" width="150" height="80" fill="#e0e0e0" rx="2"/>
          <rect x="360" y="410" width="100" height="90" fill="#e0e0e0" rx="2"/>
          <rect x="480" y="410" width="80" height="60" fill="#e0e0e0" rx="2"/>
          
          {/* Street labels */}
          <text x="160" y="240" fontSize="10" fill="#757575">5th Avenue</text>
          <text x="360" y="240" fontSize="10" fill="#757575">Broadway</text>
          <text x="100" y="270" fontSize="10" fill="#757575" transform="rotate(-90, 100, 270)">42nd St</text>
        </svg>

        {/* Traffic Layer Overlay */}
        {showTraffic && (
          <div className="map-layer traffic-layer">
            <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
              {/* Red traffic (heavy) */}
              <line x1="150" y1="200" x2="150" y2="350" stroke="#ea4335" strokeWidth="6" opacity="0.7"/>
              {/* Yellow traffic (moderate) */}
              <line x1="350" y1="100" x2="350" y2="230" stroke="#fbbc05" strokeWidth="6" opacity="0.7"/>
              {/* Green traffic (light) */}
              <line x1="550" y1="250" x2="550" y2="450" stroke="#34a853" strokeWidth="6" opacity="0.7"/>
            </svg>
          </div>
        )}

        {/* Transit Layer Overlay */}
        {showTransit && (
          <div className="map-layer transit-layer">
            <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
              {/* Subway lines */}
              <line x1="100" y1="350" x2="600" y2="350" stroke="#4285f4" strokeWidth="4" strokeDasharray="none"/>
              <circle cx="200" cy="350" r="8" fill="#4285f4" stroke="#fff" strokeWidth="2"/>
              <circle cx="350" cy="350" r="8" fill="#4285f4" stroke="#fff" strokeWidth="2"/>
              <circle cx="500" cy="350" r="8" fill="#4285f4" stroke="#fff" strokeWidth="2"/>
              
              <line x1="250" y1="100" x2="250" y2="500" stroke="#ea4335" strokeWidth="4"/>
              <circle cx="250" cy="200" r="8" fill="#ea4335" stroke="#fff" strokeWidth="2"/>
              <circle cx="250" cy="350" r="8" fill="#ea4335" stroke="#fff" strokeWidth="2"/>
            </svg>
          </div>
        )}

        {/* Route Line (when directions are active) */}
        {directions.origin && directions.destination && (
          <svg className="route-overlay" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#4285f4"/>
              </marker>
            </defs>
            <path 
              d="M 300 450 Q 350 400 350 300 Q 350 200 400 150" 
              stroke="#4285f4" 
              strokeWidth="6" 
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
            />
            {/* Origin marker */}
            <circle cx="300" cy="450" r="10" fill="#34a853" stroke="#fff" strokeWidth="3"/>
            {/* Destination marker */}
            <circle cx="400" cy="150" r="10" fill="#ea4335" stroke="#fff" strokeWidth="3"/>
          </svg>
        )}

        {/* Map Markers */}
        <div className="markers-container">
          {SAMPLE_MARKERS.map(marker => (
            <button
              key={marker.id}
              className={`map-marker ${marker.type} ${selectedLocation?.id === marker.id ? 'selected' : ''}`}
              style={{
                // Position markers (simplified positioning for demo)
                left: marker.type === 'park' ? '350px' : 
                      marker.type === 'landmark' ? '380px' : 
                      marker.type === 'building' ? '420px' : '300px',
                top: marker.type === 'park' ? '140px' : 
                     marker.type === 'landmark' ? '280px' : 
                     marker.type === 'building' ? '320px' : '450px'
              }}
              onClick={() => handleMarkerClick(marker)}
              aria-label={`${marker.name} marker`}
              title={marker.name}
            >
              {marker.type === 'user' ? (
                <div className="user-marker">
                  <div className="user-marker-pulse"></div>
                  <div className="user-marker-dot"></div>
                </div>
              ) : (
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path 
                    fill={marker.type === 'park' ? '#34a853' : '#ea4335'} 
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  />
                  <circle fill="#fff" cx="12" cy="9" r="2.5"/>
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Map Attribution */}
        <div className="map-attribution">
          <span>© LiteMap | Map data for demonstration only</span>
        </div>
      </div>

      {/* Zoom Level Indicator */}
      <div className="zoom-indicator" aria-live="polite">
        Zoom: {zoomLevel}
      </div>

      {/* Map Controls - Right Side */}
      <div className="map-controls right">
        {/* Zoom Controls */}
        <div className="control-group zoom-controls">
          <button 
            className="control-btn"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            title="Zoom in"
            disabled={zoomLevel >= 20}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
          <button 
            className="control-btn"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            title="Zoom out"
            disabled={zoomLevel <= 1}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
        </div>

        {/* Location Button */}
        <button 
          className="control-btn location-btn"
          aria-label="My location"
          title="My location"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
          </svg>
        </button>

        {/* Fullscreen Button */}
        <button 
          className="control-btn"
          aria-label="Toggle fullscreen"
          title="Fullscreen"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
        </button>
      </div>

      {/* Map Layer Controls - Bottom Left */}
      <div className="map-controls bottom-left">
        <div className="layers-panel">
          <button 
            className={`layers-toggle ${showLayers ? 'active' : ''}`}
            onClick={() => setShowLayers(!showLayers)}
            aria-label="Map layers"
            aria-expanded={showLayers}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>
            </svg>
            <span>Layers</span>
          </button>
          
          {showLayers && (
            <div className="layers-dropdown">
              <div className="layers-section">
                <h4 className="layers-title">Map Type</h4>
                <div className="layer-options map-types">
                  <button 
                    className={`map-type-btn ${mapStyle === 'default' ? 'active' : ''}`}
                    onClick={() => setMapStyle('default')}
                  >
                    <div className="map-type-preview default"></div>
                    <span>Default</span>
                  </button>
                  <button 
                    className={`map-type-btn ${mapStyle === 'satellite' ? 'active' : ''}`}
                    onClick={() => setMapStyle('satellite')}
                  >
                    <div className="map-type-preview satellite"></div>
                    <span>Satellite</span>
                  </button>
                  <button 
                    className={`map-type-btn ${mapStyle === 'terrain' ? 'active' : ''}`}
                    onClick={() => setMapStyle('terrain')}
                  >
                    <div className="map-type-preview terrain"></div>
                    <span>Terrain</span>
                  </button>
                </div>
              </div>
              
              <div className="layers-section">
                <h4 className="layers-title">Details</h4>
                <label className="layer-toggle">
                  <input 
                    type="checkbox" 
                    checked={showTraffic}
                    onChange={(e) => setShowTraffic(e.target.checked)}
                  />
                  <span className="toggle-label">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M20 10h-3V8.86c1.72-.45 3-2 3-3.86h-3V4c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v1H4c0 1.86 1.28 3.41 3 3.86V10H4c0 1.86 1.28 3.41 3 3.86V15H4c0 1.86 1.28 3.41 3 3.86V20c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1.14c1.72-.45 3-2 3-3.86h-3v-1.14c1.72-.45 3-2 3-3.86zm-8 9c-1.11 0-2-.9-2-2s.89-2 2-2c1.1 0 2 .9 2 2s-.89 2-2 2zm0-5c-1.11 0-2-.9-2-2s.89-2 2-2c1.1 0 2 .9 2 2s-.89 2-2 2zm0-5c-1.11 0-2-.9-2-2 0-1.11.89-2 2-2 1.1 0 2 .89 2 2 0 1.1-.89 2-2 2z"/>
                    </svg>
                    Traffic
                  </span>
                </label>
                <label className="layer-toggle">
                  <input 
                    type="checkbox" 
                    checked={showTransit}
                    onChange={(e) => setShowTransit(e.target.checked)}
                  />
                  <span className="toggle-label">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4z"/>
                    </svg>
                    Transit
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compass */}
      <div className="compass" aria-label="Compass pointing north">
        <svg viewBox="0 0 40 40" width="40" height="40">
          <circle cx="20" cy="20" r="18" fill="white" stroke="#e0e0e0" strokeWidth="1"/>
          <polygon points="20,6 24,20 20,18 16,20" fill="#ea4335"/>
          <polygon points="20,34 24,20 20,22 16,20" fill="#5f6368"/>
          <text x="20" y="10" textAnchor="middle" fontSize="8" fill="#ea4335" fontWeight="bold">N</text>
        </svg>
      </div>

      {/* Scale Bar */}
      <div className="scale-bar">
        <div className="scale-line"></div>
        <span className="scale-text">500 m</span>
      </div>

      {/* Location Info Card (shows when marker is selected) */}
      {selectedLocation && (
        <div className="location-card">
          <button 
            className="location-card-close"
            onClick={() => onLocationSelect(null)}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          <h3 className="location-card-title">{selectedLocation.name}</h3>
          <p className="location-card-type">{selectedLocation.type}</p>
          <div className="location-card-actions">
            <button className="card-action-btn primary">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
              </svg>
              Directions
            </button>
            <button className="card-action-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              Save
            </button>
            <button className="card-action-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
              Share
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet Trigger */}
      <button className="mobile-search-fab" aria-label="Search places">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </button>
    </div>
  )
}

export default MapView