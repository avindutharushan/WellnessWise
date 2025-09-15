import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';
import { Gender, Lifestyle } from '../types';

const UserSetupScreen: React.FC = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [lifestylePreferences, setLifestylePreferences] = useState<Lifestyle>('');
  const { saveUserProfile, loading } = useHealth();

  const handleSaveProfile = async () => {
    if (!age || !gender || !height || !weight || !lifestylePreferences) { Alert.alert('Error', 'Please fill in all fields'); return; }
    if (isNaN(Number(age)) || isNaN(Number(height)) || isNaN(Number(weight))) { Alert.alert('Error', 'Please enter valid numbers'); return; }
    try {
      await saveUserProfile({
        age: parseInt(age, 10),
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
        lifestylePreferences,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}><Ionicons name="person-add" size={60} color="white" /><Text style={styles.title}>Complete Your Profile</Text><Text style={styles.subtitle}>Help us personalize your health journey</Text></View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}><Text style={styles.label}>Age</Text><TextInput style={styles.input} placeholder="e.g., 25" value={age} onChangeText={setAge} keyboardType="numeric" /></View>
            <View style={styles.inputContainer}><Text style={styles.label}>Gender</Text><View style={styles.pickerContainer}><Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)} style={styles.picker}><Picker.Item label="Select Gender" value="" /><Picker.Item label="Male" value="male" /><Picker.Item label="Female" value="female" /><Picker.Item label="Other" value="other" /></Picker></View></View>
            <View style={styles.inputContainer}><Text style={styles.label}>Height (cm)</Text><TextInput style={styles.input} placeholder="e.g., 175" value={height} onChangeText={setHeight} keyboardType="numeric" /></View>
            <View style={styles.inputContainer}><Text style={styles.label}>Weight (kg)</Text><TextInput style={styles.input} placeholder="e.g., 70" value={weight} onChangeText={setWeight} keyboardType="numeric" /></View>
            <View style={styles.inputContainer}><Text style={styles.label}>Activity Level</Text><View style={styles.pickerContainer}><Picker selectedValue={lifestylePreferences} onValueChange={(itemValue) => setLifestylePreferences(itemValue)} style={styles.picker}><Picker.Item label="Select Activity Level" value="" /><Picker.Item label="Sedentary" value="sedentary" /><Picker.Item label="Lightly Active" value="lightly_active" /><Picker.Item label="Moderately Active" value="moderately_active" /><Picker.Item label="Very Active" value="very_active" /><Picker.Item label="Extra Active" value="extra_active" /></Picker></View></View>
            <TouchableOpacity style={[styles.saveButton, loading && styles.disabledButton]} onPress={handleSaveProfile} disabled={loading}><Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Complete Setup'}</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

// Add styles here...
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 30, paddingVertical: 50 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginTop: 20, marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'white', opacity: 0.9, textAlign: 'center' },
  formContainer: { backgroundColor: 'white', borderRadius: 20, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  pickerContainer: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, backgroundColor: '#f9f9f9' },
  picker: { height: 50 },
  saveButton: { backgroundColor: '#4facfe', paddingVertical: 15, borderRadius: 25, marginTop: 20 },
  disabledButton: { opacity: 0.6 },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

export default UserSetupScreen;