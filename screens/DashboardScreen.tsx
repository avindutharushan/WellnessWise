// src/screens/DashboardScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Timestamp } from 'firebase/firestore';
import { useHealth } from '../contexts/HealthContext';
import { useAuth } from '../contexts/AuthContext';
import { MainTabParamList, ActivityType } from '../types';

type DashboardScreenProps = BottomTabScreenProps<MainTabParamList, 'Dashboard'>;

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { userProfile, activities, loadUserProfile, loadActivities } = useHealth();
  const { currentUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadUserProfile(), loadActivities()]);
    setRefreshing(false);
  }, [loadUserProfile, loadActivities]);

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
      loadActivities();
    }
  }, [currentUser]);

  const getDateFromTimestamp = (ts: any): Date => {
    if (ts instanceof Timestamp) {
      return ts.toDate();
    }
    // Fallback for older data or different structures
    return new Date(ts.seconds * 1000);
  }

  const today = new Date().toDateString();
  const todayActivities = activities.filter(activity => 
    getDateFromTimestamp(activity.date).toDateString() === today
  );

  const todayWater = todayActivities.filter(a => a.type === 'water').reduce((sum, a) => sum + a.value, 0);
  const todayExercise = todayActivities.filter(a => a.type === 'exercise').reduce((sum, a) => sum + a.value, 0);
  const todaySleep = todayActivities.filter(a => a.type === 'sleep').reduce((sum, a) => sum + a.value, 0);
  const todayCalories = todayActivities.filter(a => a.type === 'meal').reduce((sum, a) => sum + a.value, 0);

  const getBMIStatus = (bmi: number): { status: string; color: string } => {
    if (bmi < 18.5) return { status: 'Underweight', color: '#3498db' };
    if (bmi < 25) return { status: 'Normal', color: '#2ecc71' };
    if (bmi < 30) return { status: 'Overweight', color: '#f39c12' };
    return { status: 'Obese', color: '#e74c3c' };
  };
  
  const quickActions: { icon: keyof typeof Ionicons.glyphMap; title: string; color: string; type: ActivityType }[] = [
    { icon: 'water', title: 'Log Water', color: '#3498db', type: 'water' },
    { icon: 'fitness', title: 'Log Exercise', color: '#e74c3c', type: 'exercise' },
    { icon: 'bed', title: 'Log Sleep', color: '#9b59b6', type: 'sleep' },
    { icon: 'restaurant', title: 'Log Meal', color: '#f39c12', type: 'meal' },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hello, {currentUser?.email?.split('@')[0] || 'User'}!</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {userProfile && (
          <View style={styles.healthSummary}>
            <Text style={styles.sectionTitle}>Health Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{userProfile.bmi}</Text>
                <Text style={styles.summaryLabel}>BMI</Text>
                <Text style={[styles.summaryStatus, { color: getBMIStatus(userProfile.bmi).color }]}>
                  {getBMIStatus(userProfile.bmi).status}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{userProfile.calorieNeeds}</Text>
                <Text style={styles.summaryLabel}>Daily Calories</Text>
                <Text style={styles.summaryStatus}>Recommended</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressGrid}>
            <View style={styles.progressCard}><Ionicons name="water" size={24} color="#3498db" /><Text style={styles.progressValue}>{todayWater}ml</Text><Text style={styles.progressLabel}>Water</Text></View>
            <View style={styles.progressCard}><Ionicons name="fitness" size={24} color="#e74c3c" /><Text style={styles.progressValue}>{todayExercise}min</Text><Text style={styles.progressLabel}>Exercise</Text></View>
            <View style={styles.progressCard}><Ionicons name="bed" size={24} color="#9b59b6" /><Text style={styles.progressValue}>{todaySleep}h</Text><Text style={styles.progressLabel}>Sleep</Text></View>
            <View style={styles.progressCard}><Ionicons name="restaurant" size={24} color="#f39c12" /><Text style={styles.progressValue}>{todayCalories}</Text><Text style={styles.progressLabel}>Calories</Text></View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.type} style={[styles.actionCard, { borderLeftColor: action.color }]} onPress={() => navigation.navigate('LogActivity', { type: action.type })}>
                <Ionicons name={action.icon} size={24} color={action.color} />
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {activities.slice(0, 5).map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name={activity.type === 'water' ? 'water' : activity.type === 'exercise' ? 'fitness' : activity.type === 'sleep' ? 'bed' : 'restaurant'} size={20} color="#666" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityType}>{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</Text>
                <Text style={styles.activityValue}>{activity.value}{activity.type === 'water' ? 'ml' : activity.type === 'exercise' ? ' minutes' : activity.type === 'sleep' ? ' hours' : ' calories'}</Text>
              </View>
              <Text style={styles.activityTime}>{getDateFromTimestamp(activity.date).toLocaleDateString()}</Text>
            </View>
          ))}
          {activities.length === 0 && <Text style={styles.noActivity}>No activities logged yet.</Text>}
        </View>
      </View>
    </ScrollView>
  );
};

// Add styles here...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20 },
  headerContent: { alignItems: 'center' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  date: { fontSize: 16, color: 'white', opacity: 0.9 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  healthSummary: { marginBottom: 30 },
  summaryGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, alignItems: 'center', flex: 0.48, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  summaryValue: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  summaryLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  summaryStatus: { fontSize: 12, fontWeight: '600', marginTop: 5 },
  todaySection: { marginBottom: 30 },
  progressGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  progressCard: { backgroundColor: 'white', borderRadius: 15, padding: 15, alignItems: 'center', width: '48%', marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  progressValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 5 },
  progressLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  quickActions: { marginBottom: 30 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { backgroundColor: 'white', borderRadius: 15, padding: 15, alignItems: 'center', width: '48%', marginBottom: 10, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  actionTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 5, textAlign: 'center' },
  recentActivity: { marginBottom: 20 },
  activityItem: { backgroundColor: 'white', borderRadius: 10, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  activityIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  activityDetails: { flex: 1 },
  activityType: { fontSize: 16, fontWeight: '600', color: '#333' },
  activityValue: { fontSize: 14, color: '#666', marginTop: 2 },
  activityTime: { fontSize: 12, color: '#999' },
  noActivity: { textAlign: 'center', color: '#666', fontStyle: 'italic', marginTop: 20 },
});

export default DashboardScreen;