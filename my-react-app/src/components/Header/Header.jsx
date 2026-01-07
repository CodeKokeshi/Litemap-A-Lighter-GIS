/**
 * Header Component
 * 
 * PURPOSE: Main navigation bar with search functionality
 * 
 * INTERACTION DESIGN:
 * - Search bar: INSTRUCTING - User types query to find locations
 * - Menu button: INSTRUCTING - Toggles sidebar visibility
 * - Voice search: INSTRUCTING - Click to activate voice input
 * 
 * ACCESSIBILITY:
 * - All buttons have aria-labels
 * - Search input has associated label (sr-only)
 * - Keyboard navigation supported
 */

import { useState } from 'react'
import './Header.css'

function Header({ onSearch, onMenuClick, searchQuery }) {
  const [inputValue, setInputValue] = useState(searchQuery || '')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSearch(inputValue.trim())
    }
  }

  const handleClear = () => {
    setInputValue('')
    onSearch('')
  }

  return (
    <header className="header">
      {/* Menu Toggle Button - For mobile/sidebar control */}
      <button 
        className="header-menu-btn"
        onClick={onMenuClick}
        aria-label="Toggle menu"
        title="Toggle menu"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>

      {/* Logo and Brand */}
      <div className="header-brand">
        <div className="header-logo">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path fill="#4285f4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle fill="#fff" cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <span className="header-title">LiteMap</span>
      </div>

      {/* Search Bar */}
      <form 
        className={`header-search ${isSearchFocused ? 'focused' : ''}`}
        onSubmit={handleSubmit}
        role="search"
      >
        <label htmlFor="search-input" className="sr-only">
          Search for a place or address
        </label>
        
        {/* Search Icon */}
        <button 
          type="submit" 
          className="search-icon-btn"
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>

        {/* Search Input */}
        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Search places, addresses..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          autoComplete="off"
        />

        {/* Clear Button - Shows when there's input */}
        {inputValue && (
          <button 
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}

        {/* Voice Search Button */}
        <button 
          type="button"
          className="search-voice-btn"
          aria-label="Search by voice"
          title="Search by voice"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        </button>
      </form>

      {/* User Actions */}
      <div className="header-actions">
        {/* Directions Quick Button */}
        <button 
          className="header-action-btn"
          aria-label="Get directions"
          title="Get directions"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
          </svg>
        </button>

        {/* Layers Button */}
        <button 
          className="header-action-btn"
          aria-label="Map layers"
          title="Map layers"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>
          </svg>
        </button>

        {/* User Profile */}
        <button 
          className="header-profile-btn"
          aria-label="Account settings"
          title="Account"
        >
          <div className="profile-avatar">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header