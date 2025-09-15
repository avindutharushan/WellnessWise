import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { MainTabParamList, AppStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useHealth } from '../contexts/HealthContext';

type SettingsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Settings'>,
  StackScreenProps<AppStackParamList>
>;

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const { userProfile } = useHealth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive', 
        onPress: async () => { 
          try { 
            await logout(); 
          } catch (error) { 
            console.error("Logout failed:", error); 
            Alert.alert('Error', 'Failed to logout. Please check the console for details.'); 
          } 
        } 
      },
    ]);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>
      <ScrollView style={styles.content}>
        {userProfile && (
          <View style={styles.profileSummary}>
            <View style={styles.profileIcon}><Ionicons name="person" size={40} color="white" /></View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{currentUser?.email?.split('@')[0] || 'User'}</Text>
              <Text style={styles.profileDetails}>BMI: {userProfile.bmi} • {userProfile.age} years old</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name="pencil" size={20} color="#4facfe" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}><Ionicons name="person" size={20} color="#4facfe" /></View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Edit Profile</Text>
                  <Text style={styles.settingSubtitle}>Update personal info</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
            <View style={[styles.settingItem, styles.lastItem]}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}><Ionicons name="mail" size={20} color="#4facfe" /></View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Email</Text>
                  <Text style={styles.settingSubtitle}>{currentUser?.email}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <View style={[styles.settingItem, styles.lastItem]}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}><Ionicons name="notifications" size={20} color="#4facfe" /></View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingSubtitle}>Receive reminders</Text>
                </View>
              </View>
              <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#e74c3c" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Health Tracker v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#4facfe', paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 16, color: 'white', opacity: 0.9 },
  content: { flex: 1, paddingHorizontal: 20 },
  profileSummary: { backgroundColor: 'white', borderRadius: 15, padding: 20, flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  profileIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#4facfe', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  profileDetails: { fontSize: 14, color: '#666' },
  editButton: { padding: 10 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, marginLeft: 5 },
  sectionContent: { backgroundColor: 'white', borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  lastItem: { borderBottomWidth: 0 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e9f5ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingText: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  settingSubtitle: { fontSize: 14, color: '#666' },
  logoutButton: { backgroundColor: 'white', borderRadius: 15, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#e74c3c', marginLeft: 10 },
  versionContainer: { alignItems: 'center', paddingBottom: 30 },
  versionText: { fontSize: 12, color: '#999' },
});

export default SettingsScreen;