# ✈️ Travel Explorer

A modern, full-stack travel exploration and AI-powered trip planning application. Discover world destinations, view real-time weather, search nearby locations, and generate personalized travel itineraries using Google Gemini AI.

---

## 🌟 Key Features

* **Destination Explorer**: Browse, search (with debounced input), and filter destinations by continent and category.
* **Destination Details**: Comprehensive overview of destinations with high-resolution imagery, popularity scores, and curated famous places.
* **Location Awareness**: Automatic browser geolocation and manual city search powered by OpenStreetMap Nominatim.
* **Real-time Weather**: Live weather metrics (temperature, humidity, wind, feels-like, visibility) powered by OpenWeather API via Spring Boot backend proxy.
* **Dynamic Imagery**: High-quality destination and place photos dynamically fetched from Pexels API with session-level caching and fallback placeholders.
* **AI Travel Assistant**: Interactive contextual chatbot for asking destination questions, getting travel advice, and quick recommendations.
* **AI Itinerary Planner**: Custom day-by-day travel itineraries (1–14 days) structured into Morning 🌅, Afternoon ☀️, and Evening 🌙 activities powered by Google Gemini API.

---

## 🛠️ Tech Stack

### Frontend
* **React 18** — Component-based user interface
* **Vite** — High-performance build tool
* **React Router v6** — Client-side routing (`/`, `/destinations`, `/destination/:id`, `/plan`)
* **Axios** — HTTP client for backend REST API calls
* **Vanilla CSS** — Custom design system with glassmorphism, responsive grids, and micro-animations

### Backend
* **Java 25 / Spring Boot 3.2** — RESTful backend framework
* **Spring Data JPA & Hibernate** — ORM and database repository abstraction
* **MySQL 8.0** — Relational database storage
* **Jackson ObjectMapper** — Clean JSON parsing and markdown-fence stripping for AI responses

### External APIs (Proxied via Backend)
* **OpenWeather API** — Current weather data
* **Pexels API** — High-resolution travel photos
* **Google Gemini API** — Conversational AI and structured itinerary generation
* **OpenStreetMap Nominatim** — Geocoding & location search (frontend CORS-compliant)

---

## 🏗️ Architecture

```
[ Browser / React App ]
         │
         ▼
[ Spring Boot REST API (Port 8080) ] ────► [ MySQL Database ]
         │
         ├───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
[ OpenWeather API ]    [ Pexels API ]    [ Google Gemini API ]
```

> 🔒 **Security Guarantee**: All secret API keys (`OPENWEATHER_API_KEY`, `PEXELS_API_KEY`, `GEMINI_API_KEY`) remain strictly on the Spring Boot backend server. No API keys are exposed to the browser, JavaScript bundles, or network requests.

---

## 📁 Project Structure

```
travel-application/
├── backend/
│   ├── src/main/java/com/travelapp/
│   │   ├── config/             # CORS and web configuration
│   │   ├── controller/         # REST Controllers (Health, Destination, Place, Weather, Image, Chat, Itinerary)
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entity/             # JPA Entities (Destination, Place)
│   │   ├── exception/          # Global Exception Handler & Custom Exceptions
│   │   ├── repository/         # Spring Data Repositories
│   │   └── service/            # Business Logic & External API Proxies
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── .env.example            # Environment variables template
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/         # Navbar, WeatherCard, LocationSelector, Chatbot, Itinerary, etc.
    │   ├── hooks/              # Custom React hooks (useLocation)
    │   ├── pages/              # Home, Destinations, DestinationDetail, Plan
    │   ├── services/           # API integration services (axios)
    │   ├── App.jsx             # Route configuration
    │   └── index.css           # Global design system
    ├── index.html
    └── vite.config.js
```

---

## 🗄️ Database Schema

```
┌───────────────────────────┐         ┌───────────────────────────┐
│        DESTINATION        │         │           PLACE           │
├───────────────────────────┤         ├───────────────────────────┤
│ id (PK)                   │ 1     * │ id (PK)                   │
│ name                      │─────────│ destination_id (FK)       │
│ country                   │         │ name                      │
│ continent                 │         │ category                  │
│ category                  │         │ description               │
│ short_description         │         │ location                  │
│ description               │         │ recommended_duration      │
│ popularity                │         └───────────────────────────┘
│ latitude                  │
│ longitude                 │
│ best_time_to_visit        │
└───────────────────────────┘
```

---

## 🔑 Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure your credentials:

```env
DB_URL=jdbc:mysql://localhost:3306/travel_app
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
OPENWEATHER_API_KEY=your_openweather_api_key
PEXELS_API_KEY=your_pexels_api_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🚀 Running Locally

### Prerequisites
* Java 17+ (or JDK 25)
* Node.js 18+ & npm
* MySQL 8.0 Server

### 1. Database Setup
Create a MySQL database named `travel_app`:
```sql
CREATE DATABASE travel_app;
```

### 2. Backend Setup
```bash
cd backend

# Configure environment variables in .env
cp .env.example .env

# Run Spring Boot application
./mvnw clean spring-boot:run
# Windows PowerShell: .\mvnw.cmd clean spring-boot:run
```
The backend starts on `http://localhost:8080`. Seed data (15 destinations and 75 famous places) will automatically populate on first startup without duplication.

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend starts on `http://localhost:5173` (or `5174`).

---

## 📡 REST API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health status check (`{"status":"UP"}`) |
| `/api/destinations` | GET | List all 15 seed destinations |
| `/api/destinations/{id}` | GET | Get destination by ID |
| `/api/destinations/search?query=...` | GET | Search destinations by name, country, continent |
| `/api/destinations/filter?continent=...&category=...` | GET | Filter destinations by continent and category |
| `/api/destinations/{id}/places` | GET | Get famous places for a destination |
| `/api/weather?lat=...&lon=...` | GET | Get real-time weather for coordinates |
| `/api/images/search?query=...` | GET | Get dynamic image from Pexels API |
| `/api/chat` | POST | Ask AI assistant contextual questions |
| `/api/itinerary` | POST | Generate structured trip itinerary (1–14 days) |

---

