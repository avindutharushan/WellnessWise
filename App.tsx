import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HealthProvider, useHealth } from './contexts/HealthContext';

import { AuthStackParamList, MainTabParamList, AppStackParamList } from './types';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import UserSetupScreen from './screens/UserSetupScreen';
import DashboardScreen from './screens/DashboardScreen';
import LogActivityScreen from './screens/LogActivityScreen';
import ProgressScreen from './screens/ProgressScreen';
import HealthTipsScreen from './screens/HealthTipsScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen';

const AuthStackNav = createStackNavigator<AuthStackParamList>();
const MainTabNav = createBottomTabNavigator<MainTabParamList>();
const AppStackNav = createStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStackNav.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="SignUp" component={SignUpScreen} />
    </AuthStackNav.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <MainTabNav.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4facfe',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'LogActivity') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'Progress') iconName = focused ? 'analytics' : 'analytics-outline';
          else if (route.name === 'HealthTips') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <MainTabNav.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <MainTabNav.Screen name="LogActivity" component={LogActivityScreen} options={{ tabBarLabel: 'Log' }} initialParams={{ type: '' }}/>
      <MainTabNav.Screen name="Progress" component={ProgressScreen} options={{ tabBarLabel: 'Progress' }} />
      <MainTabNav.Screen name="HealthTips" component={HealthTipsScreen} options={{ tabBarLabel: 'Tips' }} />
      <MainTabNav.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
    </MainTabNav.Navigator>
  );
}

function AppNavigator() {
  const { userProfile } = useHealth();

  return (
   <AppStackNav.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      {!userProfile ? (
        <AppStackNav.Screen name="UserSetup" component={UserSetupScreen} />
      ) : (
        <>
          <AppStackNav.Screen name="MainTabs" component={MainTabNavigator} />
          <AppStackNav.Screen name="EditProfile" component={EditProfileScreen} />
        </>
      )}
    </AppStackNav.Navigator>
  );
}

function AppContent() {
  const { currentUser } = useAuth();
  return currentUser ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <HealthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppContent />
        </NavigationContainer>
      </HealthProvider>
    </AuthProvider>
  );
}