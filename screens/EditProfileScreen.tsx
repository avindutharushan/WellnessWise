import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { useHealth } from '../contexts/HealthContext';
import { AppStackParamList, Gender, Lifestyle } from '../types';

type EditProfileScreenProps = StackScreenProps<AppStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { userProfile, saveUserProfile, loading, calculateBMI, calculateCalorieNeeds } = useHealth();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [lifestylePreferences, setLifestylePreferences] = useState<Lifestyle>('');

  useEffect(() => {
    if (userProfile) {
      setAge(userProfile.age.toString());
      setGender(userProfile.gender);
      setHeight(userProfile.height.toString());
      setWeight(userProfile.weight.toString());
      setLifestylePreferences(userProfile.lifestylePreferences);
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    if (!age || !gender || !height || !weight || !lifestylePreferences) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (isNaN(Number(age)) || isNaN(Number(height)) || isNaN(Number(weight))) {
      Alert.alert('Error', 'Please enter valid numbers for age, height, and weight');
      return;
    }
    try {
      await saveUserProfile({
        age: parseInt(age, 10),
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
        lifestylePreferences,
      });
      Alert.alert('Success', 'Profile updated successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const getBMIPreview = (): string | null => {
    if (height && weight && !isNaN(Number(height)) && !isNaN(Number(weight))) {
      return calculateBMI(parseFloat(weight), parseFloat(height));
    }
    return null;
  };

  const getCaloriePreview = (): number | null => {
    if (age && gender && height && weight && lifestylePreferences && !isNaN(Number(age)) && !isNaN(Number(height)) && !isNaN(Number(weight))) {
      return calculateCalorieNeeds(parseFloat(weight), parseFloat(height), parseInt(age, 10), gender, lifestylePreferences);
    }
    return null;
  };

  const bmiPreview = getBMIPreview();
  const caloriePreview = getCaloriePreview();

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}><Text style={styles.label}>Age</Text><TextInput style={styles.input} placeholder="Enter your age" value={age} onChangeText={setAge} keyboardType="numeric" /></View>
            <View style={styles.inputContainer}><Text style={styles.label}>Gender</Text><View style={styles.pickerContainer}><Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)} style={styles.picker}><Picker.Item label="Select Gender" value="" /><Picker.Item label="Male" value="male" /><Picker.Item label="Female" value="female" /><Picker.Item label="Other" value="other" /></Picker></View></View>
            <View style={styles.inputContainer}><Text style={styles.label}>Height (cm)</Text><TextInput style={styles.input} placeholder="Enter your height in cm" value={height} onChangeText={setHeight} keyboardType="numeric" /></View>
            <View style={styles.inputContainer}><Text style={styles.label}>Weight (kg)</Text><TextInput style={styles.input} placeholder="Enter your weight in kg" value={weight} onChangeText={setWeight} keyboardType="numeric" /></View>
            <View style={styles.inputContainer}><Text style={styles.label}>Activity Level</Text><View style={styles.pickerContainer}><Picker selectedValue={lifestylePreferences} onValueChange={(itemValue) => setLifestylePreferences(itemValue)} style={styles.picker}><Picker.Item label="Select Activity Level" value="" /><Picker.Item label="Sedentary (little/no exercise)" value="sedentary" /><Picker.Item label="Lightly Active (light exercise 1-3 days/week)" value="lightly_active" /><Picker.Item label="Moderately Active (moderate exercise 3-5 days/week)" value="moderately_active" /><Picker.Item label="Very Active (hard exercise 6-7 days/week)" value="very_active" /><Picker.Item label="Extra Active (very hard exercise, physical job)" value="extra_active" /></Picker></View></View>
            {(bmiPreview || caloriePreview) && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Health Metrics Preview</Text>
                <View style={styles.previewGrid}>
                  {bmiPreview && <View style={styles.previewCard}><Text style={styles.previewValue}>{bmiPreview}</Text><Text style={styles.previewLabel}>BMI</Text></View>}
                  {caloriePreview && <View style={styles.previewCard}><Text style={styles.previewValue}>{caloriePreview}</Text><Text style={styles.previewLabel}>Daily Calories</Text></View>}
                </View>
              </View>
            )}
            <TouchableOpacity style={[styles.saveButton, loading && styles.disabledButton]} onPress={handleSaveProfile} disabled={loading}><Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Changes'}</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

// Add styles here...
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { marginRight: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 40 },
  formContainer: { backgroundColor: 'white', borderRadius: 20, padding: 30, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  pickerContainer: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, backgroundColor: '#f9f9f9' },
  picker: { height: 50 },
  previewContainer: { backgroundColor: '#f8f9fa', borderRadius: 15, padding: 20, marginBottom: 20 },
  previewTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  previewGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  previewCard: { alignItems: 'center', backgroundColor: 'white', borderRadius: 10, padding: 15, minWidth: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  previewValue: { fontSize: 24, fontWeight: 'bold', color: '#4facfe' },
  previewLabel: { fontSize: 12, color: '#666', marginTop: 5 },
  saveButton: { backgroundColor: '#4facfe', paddingVertical: 15, borderRadius: 25, marginTop: 10 },
  disabledButton: { opacity: 0.6 },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

export default EditProfileScreen;