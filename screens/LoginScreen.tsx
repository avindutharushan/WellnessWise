import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { AuthStackParamList } from '../types';

type LoginScreenProps = StackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
            <Text style={styles.title}>Welcome Back</Text><Text style={styles.subtitle}>Sign in to continue</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}><Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} /><TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /></View>
            <View style={styles.inputContainer}><Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} /><TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} /><TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666" /></TouchableOpacity></View>
            <TouchableOpacity style={[styles.loginButton, loading && styles.disabledButton]} onPress={handleLogin} disabled={loading}><Text style={styles.loginButtonText}>{loading ? 'Signing In...' : 'Sign In'}</Text></TouchableOpacity>
            <View style={styles.signupContainer}><Text style={styles.signupText}>Don't have an account? </Text><TouchableOpacity onPress={() => navigation.navigate('SignUp')}><Text style={styles.signupLink}>Sign Up</Text></TouchableOpacity></View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

// Add styles here...
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30 },
  header: { alignItems: 'center', marginBottom: 50 },
  backButton: { position: 'absolute', left: -20, top: 0, padding: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'white', opacity: 0.9, textAlign: 'center' },
  formContainer: { backgroundColor: 'white', borderRadius: 20, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e0e0e0', marginBottom: 20, paddingBottom: 10 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  eyeIcon: { padding: 5 },
  loginButton: { backgroundColor: '#4facfe', paddingVertical: 15, borderRadius: 25, marginTop: 20, marginBottom: 20 },
  disabledButton: { opacity: 0.6 },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText: { color: '#666', fontSize: 16 },
  signupLink: { color: '#4facfe', fontSize: 16, fontWeight: 'bold' },
});

export default LoginScreen;