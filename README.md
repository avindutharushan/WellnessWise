# Personal Health & Wellness Tracker

A comprehensive mobile application built with React Native Expo for tracking personal health and wellness activities. This app helps users monitor their health journey with personalized insights, activity logging, and progress tracking.

## Features

### Core Functionality
- **User Authentication**: Secure sign up and login using Firebase Authentication
- **Profile Management**: Complete user profile setup with health metrics calculation
- **Activity Logging**: Track water intake, exercise, sleep, and meals with CRUD operations
- **Progress Tracking**: Visual charts and analytics to monitor health progress over time
- **Health Tips**: Curated wellness advice and tips categorized by health aspects
- **BMI & Calorie Calculator**: Automatic calculation of BMI and daily calorie needs

### Technical Features
- **Cross-platform**: Built with React Native Expo for iOS and Android
- **State Management**: React Context API for global state management
- **Navigation**: Stack and Tab navigation with React Navigation
- **Backend**: Firebase Firestore for data persistence
- **Charts**: Interactive progress charts using react-native-chart-kit
- **Responsive UI**: Modern, intuitive, and mobile-friendly interface

## Technology Stack

- **Frontend**: React Native Expo
- **Navigation**: React Navigation (Stack & Tab)
- **State Management**: React Context API
- **Backend**: Firebase (Authentication & Firestore)
- **Charts**: react-native-chart-kit
- **Icons**: Expo Vector Icons
- **Styling**: React Native StyleSheet with Linear Gradients

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project setup

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd HealthWellnessTracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Get your Firebase configuration object
4. Update the `firebase.js` file with your configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 4. Firestore Security Rules

Set up the following security rules in your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own activities
    match /activities/{activityId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Running the Application

### Development Mode

1. **Start the Expo development server:**
```bash
npm start
```

2. **Run on specific platforms:**
```bash
# For Android
npm run android

# For iOS (requires macOS)
npm run ios

# For web
npm run web
```

### Using Expo Go App

1. Install Expo Go on your mobile device from App Store or Google Play
2. Scan the QR code displayed in the terminal or browser
3. The app will load on your device

## Building for Production

### Android APK Build

1. **Install EAS CLI:**
```bash
npm install -g @expo/eas-cli
```

2. **Configure EAS:**
```bash
eas build:configure
```

3. **Build APK:**
```bash
eas build --platform android --profile preview
```

### iOS Build (requires Apple Developer Account)

```bash
eas build --platform ios
```

## Project Structure

```
HealthWellnessTracker/
├── App.js                 # Main app component with navigation
├── firebase.js            # Firebase configuration
├── contexts/
│   ├── AuthContext.js     # Authentication state management
│   └── HealthContext.js   # Health data state management
├── screens/
│   ├── WelcomeScreen.js   # Welcome/onboarding screen
│   ├── LoginScreen.js     # User login
│   ├── SignUpScreen.js    # User registration
│   ├── UserSetupScreen.js # Profile setup
│   ├── DashboardScreen.js # Main dashboard
│   ├── LogActivityScreen.js # Activity logging
│   ├── ProgressScreen.js  # Progress charts
│   ├── HealthTipsScreen.js # Health tips
│   ├── SettingsScreen.js  # App settings
│   └── EditProfileScreen.js # Profile editing
├── package.json
└── README.md
```

## Data Models

### User Profile
- userId, email, age, gender, height, weight
- lifestylePreferences, bmi, calorieNeeds

### Activity Log
- activityId, userId, date, type, value, notes
- Types: water (ml), exercise (minutes), sleep (hours), meal (calories)

## Key Features Implementation

### Authentication Flow
- Welcome screen with sign up/login options
- Firebase Authentication integration
- Persistent login state management

### Health Calculations
- BMI calculation: weight(kg) / height(m)²
- Calorie needs using Harris-Benedict Equation
- Activity level multipliers for accurate calorie estimation

### Activity Tracking
- CRUD operations for health activities
- Real-time data synchronization with Firestore
- Progress visualization with charts

### State Management
- React Context for global state
- Separate contexts for authentication and health data
- Efficient data loading and caching

## Troubleshooting

### Common Issues

1. **Firebase connection issues:**
   - Verify Firebase configuration in `firebase.js`
   - Check internet connectivity
   - Ensure Firestore rules are properly set

2. **Navigation errors:**
   - Clear Expo cache: `expo start -c`
   - Restart the development server

3. **Build errors:**
   - Update dependencies: `npm update`
   - Clear node_modules: `rm -rf node_modules && npm install`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This app is designed for educational and personal use. For production deployment, ensure proper security measures, data validation, and compliance with health data regulations.

