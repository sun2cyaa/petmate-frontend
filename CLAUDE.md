# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a React application bootstrapped with Create React App. Use yarn for package management:

- **Start development server**: `yarn start` (runs on http://localhost:3000)
- **Run tests**: `yarn test` (interactive watch mode)
- **Build for production**: `yarn build`
- **Eject (irreversible)**: `yarn eject`

## Architecture Overview

### Frontend Structure
This is a React frontend for a pet care service platform ("PetMate") that connects pet owners with pet sitters/care providers.

**Key Application Features:**
- User authentication (local signin/signup + Naver OAuth2)
- Pet owner and pet sitter user roles
- Pet management and profiles
- Address/location management with Kakao Maps integration
- Booking and reservation system
- Payment processing with multiple Korean payment gateways (KakaoPay, NaverPay, Payco)
- Service provider discovery via map interface

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Header, Footer)
│   ├── ui/             # UI-specific components (Cards, Calendar, Badges)
│   └── test/           # Test components
├── pages/              # Route-based page components
│   ├── Auth/           # Authentication pages (signin, signup, OAuth2)
│   ├── common/         # Shared pages (Intro, Home, Map)
│   ├── payment/        # Payment flow pages
│   └── user/           # User-specific pages
│       ├── owner/      # Pet owner pages (MyPage, Pet/Address management)
│       └── petmate/    # Pet sitter pages (BookingManage)
├── services/           # API and business logic
│   ├── api.js          # Axios instance with interceptors
│   ├── authService.js  # Authentication services
│   ├── addressService.js # Address management
│   └── booking/        # Booking-related services
├── styles/             # CSS files organized by component/page
└── assets/             # Static assets (images, icons, videos)
```

### Backend Integration
- **API Base URL**: http://localhost:8090 (Spring Boot backend)
- **Proxy Configuration**: Uses setupProxy.js to proxy `/api` requests to backend
- **Authentication**: JWT-based with automatic token refresh via Axios interceptors

### State Management
- React hooks-based state management (useState, useEffect)
- Authentication state managed in App.js and passed down
- Local storage for JWT token persistence

### Styling
- **Tailwind CSS**: Primary styling framework (configured in index.css)
- **Component-specific CSS**: Additional custom styles in styles/ directory
- **Framer Motion**: Used for page transition animations

### External Integrations
- **Kakao Maps**: Map functionality for service provider discovery
- **Payment Gateways**: KakaoPay, NaverPay, Payco integration
- **Naver OAuth2**: Social login integration

### Key Services
- `api.js`: Centralized API client with JWT token management and automatic refresh
- `authService.js`: Authentication methods including OAuth2 flow
- `addressService.js`: Address CRUD operations
- `bookingService.js`: Reservation and booking management

## Environment Configuration

Required environment variables in `.env`:
- `REACT_APP_API_BASE`: Backend API base URL
- `REACT_APP_KAKAO_MAP_KEY`: Kakao Maps API key

## Development Notes

- Uses React 19.x with React Router for routing
- Authentication flow includes both local and OAuth2 (Naver) signin
- The app redirects from `/` to `/intro` as the landing page
- Header component is conditionally rendered (hidden on intro pages)
- API calls include automatic JWT token refresh on 401 responses