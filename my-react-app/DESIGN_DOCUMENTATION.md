# LiteMap - Design Documentation

## Overview
LiteMap is a **mobile-first** lightweight alternative to Google Maps, built with React and Leaflet. It demonstrates real map interactions using the **Manipulating** and **Instructing** interaction paradigms.

---

## 1. Interaction Types

### 🖱️ MANIPULATING (Direct Manipulation)
Users directly manipulate objects on screen with continuous feedback.

| Action | Input | Feedback |
|--------|-------|----------|
| **Pan Map** | Touch + Drag | Map moves with finger |
| **Zoom** | Pinch gesture | Map scales between fingers |
| **Pinch Zoom** | Two-finger pinch | Map scales smoothly |
| **Double-tap Zoom** | Double-tap | Map zooms in at point |

### 💬 INSTRUCTING (Command-Based)
Users issue commands through discrete actions.

| Action | Input | Result |
|--------|-------|--------|
| **Search** | Type + Submit | Find and navigate to location |
| **Drop Pin** | Tap on map | Add marker at location |
| **My Location** | Tap 📍 button | Center map on GPS location |
| **Zoom +/−** | Tap buttons | Step zoom in/out |
| **Get Directions** | Tap button | Open Google Maps directions |
| **Share Location** | Tap Share | Copy coordinates to clipboard |
| **Clear Markers** | Tap Clear | Remove all dropped pins |

---

## 2. How to Use

### Basic Navigation
1. **Move around**: Drag the map with one finger to pan
2. **Zoom in/out**: Pinch with two fingers or use the +/- buttons
3. **Find yourself**: Tap the location button (📍) to center on your GPS

### Search for Places
1. Tap the search bar at the top
2. Type a place name, address, or landmark
3. Tap search to see results
4. Tap a result to navigate there and drop a pin

### Drop Custom Pins
1. Tap anywhere on the map
2. A pin will drop at that location
3. View coordinates and get directions from the sidebar

### Get Directions
1. Search for or tap a location
2. Tap "Directions" in the place card
3. Opens Google Maps with turn-by-turn navigation

---

## 3. Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | React 19 | UI components |
| Map Engine | Leaflet + react-leaflet | Interactive mapping |
| Map Tiles | OpenStreetMap | Free map imagery |
| Geocoding | Nominatim API | Place search |
| Build Tool | Vite | Fast development |

---

## 4. UI Layout (Mobile-First)

### Mobile View (Primary)
```
┌────────────────────────────┐
│  [≡] 🗺️  [__Search...__] 🔍│ Header (56px)
├────────────────────────────┤
│                            │
│                            │
│      MAP CANVAS            │
│    (Full Screen)           │
│                       [+]  │
│                       [-]  │
│                            │
│    📍 Tap to drop pin [📍] │
│                            │
│ [Map][Sat]                 │
└────────────────────────────┘

Sidebar: Slides in from left on ≡ tap
```

### Desktop View
```
┌─────────────────────────────────────────────────────────────┐
│  [≡] [🗺️ LiteMap]  [______Search places..._______] [🔍]    │
├──────────────────┬──────────────────────────────────────────┤
│                  │                                          │
│    SIDEBAR       │              MAP CANVAS                  │
│    (360px)       │                                          │
│                  │                                    [+]  │
│  Search Results  │                                    [-]  │
│                  │                                         │
│  ┌────────────┐  │         📍 Markers                 [📍] │
│  │Place Card  │  │                                         │
│  │[Directions]│  │                                         │
│  │[Share]     │  │    [Map][Satellite]                     │
│  └────────────┘  │                                          │
│                  │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

---

## 5. Component Structure

```
App.jsx (Single-File Architecture for Simplicity)
├── Header (56px fixed)
│   ├── Menu Toggle Button
│   ├── Brand Logo
│   └── Search Form
│       ├── Text Input (16px font to prevent iOS zoom)
│       └── Submit Button
├── Sidebar (Slide-in drawer on mobile)
│   ├── Search Results List
│   ├── Place Card (bottom-sheet style)
│   │   ├── Place Name
│   │   ├── Address
│   │   ├── Directions Button
│   │   └── Share Button
│   └── Clear Markers Button
└── Map Container (Leaflet)
    ├── TileLayer (OpenStreetMap)
    ├── Markers (colored by type)
    ├── ZoomControls (right side, mobile-optimized)
    ├── LocateButton (GPS)
    └── MapTypeSelector (bottom left)
```

---

## 6. Features

### ✅ Working Features

| Feature | Interaction Type | Description |
|---------|-----------------|-------------|
| Real Map | MANIPULATING | Drag, zoom, pinch OpenStreetMap |
| Search | INSTRUCTING | Find real places via Nominatim |
| Drop Pins | INSTRUCTING | Tap map to add markers |
| My Location | INSTRUCTING | GPS geolocation |
| Zoom Controls | INSTRUCTING | +/− buttons |
| Directions | INSTRUCTING | Opens Google Maps |
| Share Location | INSTRUCTING | Clipboard API |

### 🎯 Design Focus

1. **Mobile-First** - Designed primarily for phone usage
2. **Simplicity** - Clean UI, no clutter
3. **Touch-Optimized** - 44px touch targets, gestures
4. **Real Functionality** - Not a mockup

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Full-screen map, slide-in sidebar |
| Tablet | 768px+ | Side-by-side layout |
| Desktop | 1024px+ | Larger search bar |

### Mobile-First Design Principles
- **Touch targets**: All buttons are 44x44px minimum
- **No hover states**: Uses `:active` for touch feedback
- **16px input font**: Prevents iOS auto-zoom
- **Dynamic viewport**: Uses `100dvh` for proper mobile height
- **Slide-in drawer**: Sidebar animates from left on toggle

---

## 7. Color System

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#4285f4` | Buttons, links, focus |
| Success | `#34a853` | Custom markers |
| Danger | `#ea4335` | Search markers |
| Background | `#f8f9fa` | Page background |
| Surface | `#ffffff` | Cards, panels |
| Text | `#202124` | Primary text |
| Secondary | `#5f6368` | Secondary text |

---

## 8. API Integration

### OpenStreetMap Tiles
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```
- Free, open-source
- No API key required
- Good global coverage

### Nominatim Geocoding
```
https://nominatim.openstreetmap.org/search?format=json&q={query}
```
- Free geocoding service
- Returns lat/lon coordinates
- Rate limited (be respectful)

---

## 9. User Flows

### Search Flow (INSTRUCTING)
```
[Tap search bar] → [Type query] → [Submit] → [Results appear] → [Tap result] → [Map flies to location]
```

### Pin Drop Flow (INSTRUCTING)
```
[Tap map] → [Pin drops] → [Place card shows] → [Tap Directions/Share]
```

### Location Flow (INSTRUCTING)
```
[Tap 📍 button] → [Permission prompt] → [GPS acquired] → [Map centers on you]
```

### Map Navigation (MANIPULATING)
```
[Drag map] → [Map pans smoothly]
[Pinch] → [Map zooms in/out]
[Double-tap] → [Map zooms in at point]
```

---

## 10. Accessibility

- ✅ Touch-friendly targets (44px minimum)
- ✅ ARIA labels on all buttons
- ✅ High contrast text
- ✅ Semantic HTML structure
- ✅ No tap-highlight color (cleaner touch feedback)
- ✅ Focus indicators for keyboard users

---

## 11. Files

| File | Purpose |
|------|---------|
| `App.jsx` | Main component with all logic |
| `App.css` | All styles |
| `index.css` | Base reset |

---

## 12. Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

*LiteMap - A mobile-first lightweight map application*  
*HCI Course Final Project*  
*Interaction Types: Manipulating + Instructing*
