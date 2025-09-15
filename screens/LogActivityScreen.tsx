// src/screens/LogActivityScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useHealth } from '../contexts/HealthContext';
import { MainTabParamList, ActivityType } from '../types';

type LogActivityScreenProps = BottomTabScreenProps<MainTabParamList, 'LogActivity'>;

interface ActivityConfig {
  value: ActivityType;
  label: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const LogActivityScreen: React.FC<LogActivityScreenProps> = ({ navigation, route }) => {
  const { type: initialType } = route.params || {};
  const [type, setType] = useState<ActivityType | ''>(initialType || '');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  
  const { logActivity, loading } = useHealth();

  const activityTypes: ActivityConfig[] = [
    { value: 'water', label: 'Water Intake', unit: 'ml', icon: 'water', color: '#3498db' },
    { value: 'exercise', label: 'Exercise', unit: 'minutes', icon: 'fitness', color: '#e74c3c' },
    { value: 'sleep', label: 'Sleep', unit: 'hours', icon: 'bed', color: '#9b59b6' },
    { value: 'meal', label: 'Meal', unit: 'calories', icon: 'restaurant', color: '#f39c12' },
  ];

  const selectedActivity = activityTypes.find(activity => activity.value === type);

  const handleLogActivity = async () => {
    if (!type || !value) {
      Alert.alert('Error', 'Please select activity type and enter a value');
      return;
    }
    if (isNaN(Number(value)) || parseFloat(value) <= 0) {
      Alert.alert('Error', 'Please enter a valid positive number');
      return;
    }
    try {
      await logActivity({ type, value: parseFloat(value), notes: notes.trim() });
      Alert.alert('Success', 'Activity logged successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to log activity. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.header}><TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity><Text style={styles.title}>Log Activity</Text></View>
        <ScrollView style={styles.content}>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}><Text style={styles.label}>Activity Type</Text><View style={styles.pickerContainer}><Picker selectedValue={type} onValueChange={(itemValue) => setType(itemValue as ActivityType | '')} style={styles.picker}><Picker.Item label="Select Activity Type" value="" />{activityTypes.map((activity) => (<Picker.Item key={activity.value} label={activity.label} value={activity.value} />))}</Picker></View></View>
            {selectedActivity && (<View style={styles.selectedActivityContainer}><View style={[styles.activityIcon, { backgroundColor: selectedActivity.color }]}><Ionicons name={selectedActivity.icon} size={30} color="white" /></View><Text style={styles.selectedActivityText}>{selectedActivity.label}</Text></View>)}
            <View style={styles.inputContainer}><Text style={styles.label}>Value {selectedActivity && `(${selectedActivity.unit})`}</Text><TextInput style={styles.input} placeholder={`e.g., ${selectedActivity?.unit === 'ml' ? '250' : '30'}`} value={value} onChangeText={setValue} keyboardType="numeric" /></View>
            <View style={styles.inputContainer}><Text style={styles.label}>Notes (Optional)</Text><TextInput style={[styles.input, styles.notesInput]} placeholder="Add notes..." value={notes} onChangeText={setNotes} multiline numberOfLines={3} /></View>
            <TouchableOpacity style={[styles.logButton, loading && styles.disabledButton, selectedActivity && { backgroundColor: selectedActivity.color }]} onPress={handleLogActivity} disabled={loading}><Text style={styles.logButtonText}>{loading ? 'Logging...' : 'Log Activity'}</Text></TouchableOpacity>
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
  content: { flex: 1, paddingHorizontal: 20 },
  formContainer: { backgroundColor: 'white', borderRadius: 20, padding: 30, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  pickerContainer: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, backgroundColor: '#f9f9f9' },
  picker: { height: 50 },
  selectedActivityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 15, borderRadius: 10, marginBottom: 20 },
  activityIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  selectedActivityText: { fontSize: 18, fontWeight: '600', color: '#333' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  notesInput: { height: 80, textAlignVertical: 'top' },
  logButton: { backgroundColor: '#4facfe', paddingVertical: 15, borderRadius: 25, marginTop: 10 },
  disabledButton: { opacity: 0.6 },
  logButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

export default LogActivityScreen;