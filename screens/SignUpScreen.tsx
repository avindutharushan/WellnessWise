import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { AuthStackParamList } from '../types';

type SignUpScreenProps = StackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) { Alert.alert('Error', 'Please fill in all fields'); return; }
    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return; }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return; }
    try {
      setLoading(true);
      await signup(email, password);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
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
            <Text style={styles.title}>Create Account</Text><Text style={styles.subtitle}>Start your health journey</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}><Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} /><TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /></View>
            <View style={styles.inputContainer}><Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} /><TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} /><TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666" /></TouchableOpacity></View>
            <View style={styles.inputContainer}><Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} /><TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} /></View>
            <TouchableOpacity style={[styles.signupButton, loading && styles.disabledButton]} onPress={handleSignUp} disabled={loading}><Text style={styles.signupButtonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text></TouchableOpacity>
            <View style={styles.loginContainer}><Text style={styles.loginText}>Already have an account? </Text><TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.loginLink}>Sign In</Text></TouchableOpacity></View>
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
  signupButton: { backgroundColor: '#4facfe', paddingVertical: 15, borderRadius: 25, marginTop: 20, marginBottom: 20 },
  disabledButton: { opacity: 0.6 },
  signupButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { color: '#666', fontSize: 16 },
  loginLink: { color: '#4facfe', fontSize: 16, fontWeight: 'bold' },
});

export default SignUpScreen;