# Silent Zone Auto Mode - Setup Guide

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
The backend will run on http://localhost:8080

### 2. Web Dashboard (for testing)
```bash
cd web
npm install
npm start
```
The web dashboard will run on http://localhost:3000

### 3. Mobile App (React Native)
```bash
cd mobile
npm install --legacy-peer-deps
npm run android  # Requires Android Studio and emulator
```

## Prerequisites

### For Backend:
- Node.js (v14+)
- MongoDB (running locally or connection string)

### For Mobile App:
- Android Studio with SDK
- Android emulator or physical device
- Java Development Kit (JDK)

## Configuration

### Backend Environment (.env)
```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/silentzone
JWT_SECRET=your_secure_jwt_secret
```

### Mobile App API Configuration
Update `mobile/src/services/api.js`:
- For Android emulator: `http://10.0.2.2:8080/api`
- For iOS simulator: `http://localhost:8080/api`
- For physical device: `http://YOUR_IP:8080/api`

## Testing the System

1. **Start MongoDB** (if using local installation)
2. **Start Backend**: `cd backend && npm start`
3. **Start Web Dashboard**: `cd web && npm start`
4. **Test in Browser**:
   - Go to http://localhost:3000
   - Register a new account
   - Create some test zones
   - Verify API functionality

## Features Implemented

✅ **Backend (Node.js/Express/MongoDB)**
- User authentication with JWT
- Zone CRUD operations
- GeoJSON location storage
- Protected API routes

✅ **Mobile App (React Native)**
- Authentication screens
- Zone management
- Dashboard with statistics
- Cross-platform navigation

✅ **Web Dashboard (React)**
- Full zone management
- User authentication
- Real-time API testing
- Responsive design

## Next Steps for Production

1. **Install Android Studio** for mobile development
2. **Add Maps Integration** (Google Maps/MapBox)
3. **Implement Background Geolocation**
4. **Add Ringer Mode Control** (native modules)
5. **Deploy Backend** (Heroku/AWS/DigitalOcean)
6. **Add Push Notifications**

## Troubleshooting

### Port Conflicts
If port 8080 is in use, change in:
- `backend/.env` → PORT=XXXX
- `mobile/src/services/api.js` → API_BASE_URL
- `web/src/App.js` → API_BASE_URL

### MongoDB Connection
Ensure MongoDB is running:
```bash
mongod  # Start MongoDB service
```

### React Native Issues
- Run `npx react-native doctor` for environment check
- Clear cache: `npx react-native start --reset-cache`
- For Android: Ensure ANDROID_HOME is set

## Project Structure
```
silent-mode/
├── backend/          # Node.js API server
├── mobile/           # React Native app
├── web/              # React web dashboard
└── README.md         # Project documentation
```