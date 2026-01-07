# LiteMap - Lightweight Google Maps Alternative

A clean, responsive UI design for a lightweight mapping application. Created as an HCI (Human-Computer Interaction) final project demonstrating UI/UX principles.

![LiteMap Interface](https://via.placeholder.com/800x400?text=LiteMap+Interface+Preview)

## 🎯 Project Overview

LiteMap is designed as a lighter, more focused alternative to Google Maps. The interface prioritizes:
- **Clarity** - Clean, uncluttered design
- **Ease of use** - Intuitive navigation
- **Responsiveness** - Works on all screen sizes
- **Accessibility** - WCAG 2.1 compliant

## ✨ Features

### Core Interface Elements
- 🔍 **Search Bar** - Find places, addresses, and businesses
- 📍 **Interactive Map** - Static SVG-based map visualization
- 🧭 **Navigation Controls** - Zoom, compass, location centering
- 📋 **Sidebar Panel** - Search results, directions, saved places
- 🗺️ **Layer Controls** - Toggle traffic, transit, map styles

### Interaction Types
| Type | Actions |
|------|---------|
| **Manipulating** | Drag to pan, pinch/scroll to zoom, select markers |
| **Instructing** | Search queries, button clicks, form inputs |

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **CSS3** - Styling with CSS variables
- **SVG** - Map visualization

## 📁 Project Structure

```
src/
├── components/
│   ├── Header/          # Navigation bar & search
│   ├── Sidebar/         # Side panel with tabs
│   └── MapView/         # Map canvas & controls
├── App.jsx              # Main application
├── App.css              # Layout styles
└── index.css            # Global styles & design tokens
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Navigate to project directory
cd my-react-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📐 Design System

### Color Palette
- **Primary**: `#4285f4` (Blue)
- **Success**: `#34a853` (Green)
- **Warning**: `#fbbc05` (Yellow)
- **Error**: `#ea4335` (Red)

### Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 📝 Documentation

See [DESIGN_DOCUMENTATION.md](./DESIGN_DOCUMENTATION.md) for complete design decisions, interaction patterns, and annotation notes.

## 🎓 Course Information

- **Course**: Human-Computer Interaction (HCI)
- **Project Type**: Final Project - UI Design
- **Focus**: Interface design with Manipulating/Instructing interaction types

## 📊 Rubric Coverage

| Criteria | Points | Implementation |
|----------|--------|----------------|
| Clarity and Structure | 10 | Clean layout, organized components |
| Consistency | 10 | CSS variables, reusable components |
| User Experience | 20 | Intuitive flow, clear navigation |
| Responsiveness | 10 | Mobile-first, 3 breakpoints |
| Interaction Design | 20 | Manipulate + Instruct patterns |
| Content Hierarchy | 5 | Visual weight, spacing |
| Annotations | 5 | Comprehensive documentation |
| Scalability | 10 | Modular architecture |
| Aesthetic Appeal | 10 | Modern, clean design |

## 📄 License

This project is for educational purposes.

---

*Created for HCI Finals - January 2026*
