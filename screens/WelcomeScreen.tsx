// src/screens/WelcomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../types';

type WelcomeScreenProps = StackScreenProps<AuthStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}><Ionicons name="fitness" size={80} color="white" /></View>
        <Text style={styles.title}>Health & Wellness Tracker</Text>
        <Text style={styles.subtitle}>Your personal guide to a healthier lifestyle</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}><Text style={styles.loginButtonText}>Login</Text></TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('SignUp')}><Text style={styles.signupButtonText}>Sign Up</Text></TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

// Add styles here...
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  iconContainer: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 15 },
  subtitle: { fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 50, opacity: 0.9 },
  buttonContainer: { width: '100%' },
  loginButton: { backgroundColor: 'white', paddingVertical: 15, borderRadius: 25, marginBottom: 15 },
  loginButtonText: { color: '#4facfe', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  signupButton: { backgroundColor: 'transparent', paddingVertical: 15, borderRadius: 25, borderWidth: 2, borderColor: 'white' },
  signupButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

export default WelcomeScreen;