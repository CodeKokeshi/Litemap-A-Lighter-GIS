/**
 * Sidebar Component
 * 
 * PURPOSE: Display search results, directions, and saved places
 * 
 * INTERACTION DESIGN:
 * - Tab navigation: INSTRUCTING - Click tabs to switch views
 * - Search results: INSTRUCTING - Click to select location
 * - Directions form: INSTRUCTING - Enter origin/destination
 * - Saved places: INSTRUCTING - Click to navigate, manage favorites
 * 
 * CONTENT HIERARCHY:
 * 1. View mode tabs (highest priority)
 * 2. Content area based on selected mode
 * 3. Action buttons (contextual)
 */

import { useState } from 'react'
import './Sidebar.css'

// Sample data for demonstration
const SAMPLE_SEARCH_RESULTS = [
  {
    id: 1,
    name: 'Central Park',
    address: 'New York, NY 10024',
    type: 'Park',
    distance: '2.3 km',
    rating: 4.8,
    icon: 'park'
  },
  {
    id: 2,
    name: 'Times Square',
    address: 'Manhattan, NY 10036',
    type: 'Landmark',
    distance: '3.1 km',
    rating: 4.6,
    icon: 'landmark'
  },
  {
    id: 3,
    name: 'Empire State Building',
    address: '350 5th Ave, New York, NY 10118',
    type: 'Building',
    distance: '4.2 km',
    rating: 4.7,
    icon: 'building'
  },
  {
    id: 4,
    name: 'Brooklyn Bridge',
    address: 'Brooklyn Bridge, New York, NY',
    type: 'Bridge',
    distance: '5.8 km',
    rating: 4.9,
    icon: 'bridge'
  }
]

const SAMPLE_SAVED_PLACES = [
  { id: 1, name: 'Home', address: '123 Main Street', icon: 'home' },
  { id: 2, name: 'Work', address: '456 Office Blvd', icon: 'work' },
  { id: 3, name: 'Gym', address: '789 Fitness Ave', icon: 'gym' }
]

function Sidebar({ 
  isOpen, 
  onClose, 
  viewMode, 
  onViewModeChange,
  searchQuery,
  selectedLocation,
  directions,
  onDirectionsChange 
}) {
  const [travelMode, setTravelMode] = useState('driving')

  // Render icon based on type
  const renderIcon = (iconType) => {
    const icons = {
      park: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M17 12h2L12 2 5 12h2l-3 6h7v4h2v-4h7l-3-6z"/>
        </svg>
      ),
      landmark: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
        </svg>
      ),
      building: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
        </svg>
      ),
      bridge: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M7 14v-4l-4 4v6h6v-4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v4h6v-6l-4-4v4H7z"/>
        </svg>
      ),
      home: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ),
      work: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
        </svg>
      ),
      gym: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
        </svg>
      )
    }
    return icons[iconType] || icons.landmark
  }

  return (
    <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      {/* Sidebar Header with Close Button (Mobile) */}
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          {viewMode === 'explore' && 'Explore'}
          {viewMode === 'directions' && 'Directions'}
          {viewMode === 'saved' && 'Saved Places'}
        </h2>
        <button 
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      {/* View Mode Tabs */}
      <nav className="sidebar-tabs" role="tablist">
        <button 
          className={`sidebar-tab ${viewMode === 'explore' ? 'active' : ''}`}
          onClick={() => onViewModeChange('explore')}
          role="tab"
          aria-selected={viewMode === 'explore'}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <span>Explore</span>
        </button>
        <button 
          className={`sidebar-tab ${viewMode === 'directions' ? 'active' : ''}`}
          onClick={() => onViewModeChange('directions')}
          role="tab"
          aria-selected={viewMode === 'directions'}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
          </svg>
          <span>Directions</span>
        </button>
        <button 
          className={`sidebar-tab ${viewMode === 'saved' ? 'active' : ''}`}
          onClick={() => onViewModeChange('saved')}
          role="tab"
          aria-selected={viewMode === 'saved'}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span>Saved</span>
        </button>
      </nav>

      {/* Content Area */}
      <div className="sidebar-content">
        {/* Explore View - Search Results */}
        {viewMode === 'explore' && (
          <div className="explore-view">
            {searchQuery ? (
              <>
                <div className="results-header">
                  <span className="results-count">{SAMPLE_SEARCH_RESULTS.length} results</span>
                  <span className="results-query">for "{searchQuery}"</span>
                </div>
                <ul className="results-list">
                  {SAMPLE_SEARCH_RESULTS.map(result => (
                    <li key={result.id} className="result-item">
                      <button className="result-button">
                        <div className="result-icon">
                          {renderIcon(result.icon)}
                        </div>
                        <div className="result-info">
                          <h3 className="result-name">{result.name}</h3>
                          <p className="result-address">{result.address}</p>
                          <div className="result-meta">
                            <span className="result-type">{result.type}</span>
                            <span className="result-distance">{result.distance}</span>
                            <span className="result-rating">★ {result.rating}</span>
                          </div>
                        </div>
                        <div className="result-actions">
                          <button 
                            className="result-action-btn"
                            aria-label="Get directions"
                            title="Directions"
                          >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                              <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
                            </svg>
                          </button>
                          <button 
                            className="result-action-btn"
                            aria-label="Save place"
                            title="Save"
                          >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                            </svg>
                          </button>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="explore-empty">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h3 className="empty-title">Discover Places</h3>
                <p className="empty-text">Search for restaurants, hotels, attractions, and more</p>
                
                {/* Quick Categories */}
                <div className="quick-categories">
                  <button className="category-chip">
                    <span>🍽️</span> Restaurants
                  </button>
                  <button className="category-chip">
                    <span>☕</span> Cafes
                  </button>
                  <button className="category-chip">
                    <span>🏨</span> Hotels
                  </button>
                  <button className="category-chip">
                    <span>⛽</span> Gas Stations
                  </button>
                  <button className="category-chip">
                    <span>🏪</span> Stores
                  </button>
                  <button className="category-chip">
                    <span>🏥</span> Hospitals
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Directions View */}
        {viewMode === 'directions' && (
          <div className="directions-view">
            {/* Origin/Destination Form */}
            <div className="directions-form">
              <div className="directions-input-group">
                <div className="directions-marker origin">
                  <div className="marker-dot"></div>
                </div>
                <input 
                  type="text"
                  className="directions-input"
                  placeholder="Choose starting point..."
                  value={directions.origin}
                  onChange={(e) => onDirectionsChange({...directions, origin: e.target.value})}
                />
              </div>
              
              <button className="swap-btn" aria-label="Swap origin and destination">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
                </svg>
              </button>
              
              <div className="directions-input-group">
                <div className="directions-marker destination">
                  <div className="marker-dot"></div>
                </div>
                <input 
                  type="text"
                  className="directions-input"
                  placeholder="Choose destination..."
                  value={directions.destination}
                  onChange={(e) => onDirectionsChange({...directions, destination: e.target.value})}
                />
              </div>
            </div>

            {/* Travel Mode Selector */}
            <div className="travel-modes">
              <button 
                className={`travel-mode-btn ${travelMode === 'driving' ? 'active' : ''}`}
                onClick={() => setTravelMode('driving')}
                aria-label="Driving"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
                <span>Drive</span>
              </button>
              <button 
                className={`travel-mode-btn ${travelMode === 'transit' ? 'active' : ''}`}
                onClick={() => setTravelMode('transit')}
                aria-label="Public transit"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z"/>
                </svg>
                <span>Transit</span>
              </button>
              <button 
                className={`travel-mode-btn ${travelMode === 'walking' ? 'active' : ''}`}
                onClick={() => setTravelMode('walking')}
                aria-label="Walking"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
                </svg>
                <span>Walk</span>
              </button>
              <button 
                className={`travel-mode-btn ${travelMode === 'cycling' ? 'active' : ''}`}
                onClick={() => setTravelMode('cycling')}
                aria-label="Cycling"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
                </svg>
                <span>Bike</span>
              </button>
            </div>

            {/* Sample Route Results */}
            <div className="route-results">
              <div className="route-option best">
                <div className="route-badge">Fastest</div>
                <div className="route-info">
                  <div className="route-time">25 min</div>
                  <div className="route-distance">12.3 km</div>
                </div>
                <div className="route-description">Via Highway 101</div>
              </div>
              <div className="route-option">
                <div className="route-info">
                  <div className="route-time">32 min</div>
                  <div className="route-distance">10.8 km</div>
                </div>
                <div className="route-description">Via Main Street</div>
              </div>
              <div className="route-option">
                <div className="route-info">
                  <div className="route-time">38 min</div>
                  <div className="route-distance">14.1 km</div>
                </div>
                <div className="route-description">Via Scenic Route</div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Places View */}
        {viewMode === 'saved' && (
          <div className="saved-view">
            <div className="saved-section">
              <h3 className="saved-section-title">Your Places</h3>
              <ul className="saved-list">
                {SAMPLE_SAVED_PLACES.map(place => (
                  <li key={place.id} className="saved-item">
                    <button className="saved-button">
                      <div className="saved-icon">
                        {renderIcon(place.icon)}
                      </div>
                      <div className="saved-info">
                        <h4 className="saved-name">{place.name}</h4>
                        <p className="saved-address">{place.address}</p>
                      </div>
                      <div className="saved-actions">
                        <button className="saved-action-btn" aria-label="Edit">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="saved-section">
              <h3 className="saved-section-title">Recent</h3>
              <ul className="recent-list">
                <li className="recent-item">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                  </svg>
                  <span>Central Park</span>
                </li>
                <li className="recent-item">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                  </svg>
                  <span>Times Square</span>
                </li>
              </ul>
            </div>

            <button className="add-place-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add a place
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar