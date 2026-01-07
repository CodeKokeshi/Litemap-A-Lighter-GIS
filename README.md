# LiteMap - Lightweight Google Maps Alternative

A clean, responsive mapping application built as an HCI (Human-Computer Interaction) final project. Features real-time location services, place search, and road routing.

## ✨ Features

- 📍 **Location Services** - Find your current location with one tap
- 🗺️ **Interactive Map** - Pan, zoom, and drop pins anywhere on OpenStreetMap
- 🔍 **Smart Search** - Search for places with distance-based results
- 🏷️ **Quick Filters** - Find nearby churches, food, hospitals, gas stations, ATMs, and pharmacies
- 🛣️ **Road Routing** - Get actual driving directions with distance and estimated time (via OSRM)
- 📤 **Share Places** - Copy location info to clipboard
- ❓ **Interactive Tutorial** - Built-in guide for first-time users

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **Vite 6** - Build Tool
- **Leaflet / React-Leaflet** - Interactive Maps
- **OpenStreetMap** - Map Tiles
- **Nominatim API** - Geocoding & Search
- **OSRM API** - Road Routing

## 🚀 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Steps

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd HCI-Finals
   ```

2. **Navigate to the React app directory**
   ```bash
   cd my-react-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

### Build for Production

```bash
cd my-react-app
npm run build
```

The built files will be in the `dist/` folder.

## 📱 How to Use

### 1. Find Your Location
Tap the **locate button** (📍) in the bottom-right corner to center the map on your current position. This sets your reference point for nearby searches.

### 2. Drop a Pin
Tap anywhere on the map to drop an **orange pin**. This becomes your new reference point for distance calculations.

### 3. Search for Places
Use the **search bar** at the top to find any place. Results are automatically sorted by distance from your location or dropped pin.

### 4. Use Quick Filters
Tap the **filter buttons** at the bottom to quickly find:
- ⛪ Churches
- 🍔 Food & Restaurants
- 🏥 Hospitals
- ⛽ Gas Stations
- 🏧 ATMs
- 💊 Pharmacies

### 5. Interact with Results
Tap any search result to reveal **3 action buttons**:
- **Locate** - Fly to the location on the map
- **Route** - Get driving directions with distance and time
- **Share** - Copy the place info to clipboard

### 6. View Sidebar
Tap the **hamburger menu** (☰) to open the sidebar with all your search results and details.

### 7. Get Help
Tap the **?** button anytime for an interactive tutorial walkthrough.

## 📁 Project Structure

```
HCI-Finals/
├── my-react-app/
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── App.css        # Application styles (mobile-first)
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles & CSS variables
│   ├── public/            # Static assets
│   ├── index.html         # HTML template
│   ├── package.json       # Dependencies
│   └── vite.config.js     # Vite configuration
└── README.md              # This file
```

## 📜 Available Scripts

Run these commands from the `my-react-app` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## ⚠️ Notes

- Location services require **HTTPS** in production (localhost works in development)
- Search results are biased toward Cagayan de Oro area by default
- Internet connection required for map tiles and API calls

## 📝 Documentation

See [my-react-app/DESIGN_DOCUMENTATION.md](./my-react-app/DESIGN_DOCUMENTATION.md) for complete design decisions and interaction patterns.

## 📄 License

MIT License - Feel free to use and modify for your own projects.

---

*Built with ❤️ for HCI Finals - January 2026*
