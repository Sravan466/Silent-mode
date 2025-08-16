# Silent Zone Auto Mode

A mobile-first MERN stack application that automatically switches your phone to silent or vibrate mode when entering predefined geographical areas.

## Features

- **Geofencing**: Automatic location-based ringer mode switching
- **Zone Management**: Create, edit, and delete silent zones
- **Real-time Monitoring**: Background location tracking
- **User Authentication**: Secure JWT-based authentication
- **Cross-platform**: React Native for iOS and Android

## Tech Stack

- **Frontend**: React Native
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Geolocation**: React Native Background Geolocation
- **Maps**: React Native Maps

## Project Structure

```
silent-mode/
├── backend/                 # Node.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   └── server.js           # Main server file
└── mobile/                 # React Native app
    └── src/
        ├── components/     # Reusable components
        ├── screens/        # App screens
        ├── context/        # React context providers
        ├── services/       # API and geofencing services
        └── utils/          # Utility functions
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start MongoDB (make sure MongoDB is installed and running)

4. Update `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/silentzone
   JWT_SECRET=your_secure_jwt_secret
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Mobile App Setup

1. Navigate to mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS (macOS only):
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

4. For Android:
   ```bash
   npm run android
   ```

## Required Permissions

### Android
- ACCESS_FINE_LOCATION
- ACCESS_BACKGROUND_LOCATION
- MODIFY_AUDIO_SETTINGS
- ACCESS_NOTIFICATION_POLICY

### iOS
- Location Services (Always)
- Background App Refresh

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Zones
- `GET /api/zones` - Get user's zones
- `POST /api/zones` - Create new zone
- `PUT /api/zones/:id` - Update zone
- `DELETE /api/zones/:id` - Delete zone

## Core Functionality

1. **Zone Creation**: Users can create silent zones by selecting locations on a map
2. **Background Monitoring**: App monitors location even when closed
3. **Automatic Switching**: Phone switches to silent/vibrate when entering zones
4. **Restoration**: Normal mode restored when exiting zones
5. **Notifications**: Subtle notifications confirm mode changes

## Development Notes

- The app requires native modules for ringer mode control
- Background location tracking needs proper permissions
- Geofencing works with circular zones (radius-based)
- Battery optimization should be disabled for reliable operation

## Future Enhancements

- Time-based zone activation
- Web dashboard for zone management
- Multiple zone profiles
- Smart scheduling
- Usage analytics

## License

MIT License