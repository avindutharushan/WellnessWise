import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ChartConfig } from 'react-native-chart-kit/dist/HelperTypes';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import { useHealth } from '../contexts/HealthContext';
import { ActivityType } from '../types';

const screenWidth = Dimensions.get('window').width;

const ProgressScreen: React.FC = () => {
  const { activities } = useHealth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('water');

  const activityTypes: { value: ActivityType; label: string; color: string; unit: string }[] = [
    { value: 'water', label: 'Water', color: '#3498db', unit: 'ml' },
    { value: 'exercise', label: 'Exercise', color: '#e74c3c', unit: 'min' },
    { value: 'sleep', label: 'Sleep', color: '#9b59b6', unit: 'hrs' },
    { value: 'meal', label: 'Calories', color: '#f39c12', unit: 'cal' },
  ];

  const getDateFromTimestamp = (ts: any): Date => (ts instanceof Timestamp) ? ts.toDate() : new Date(ts.seconds * 1000);

  const getChartData = () => {
    const numDays = selectedPeriod === 'week' ? 7 : 30;
    const labels = [];
    const data = [];
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayActivities = activities.filter(activity => 
        getDateFromTimestamp(activity.date).toDateString() === date.toDateString() &&
        activity.type === selectedActivity
      );
      
      const dayTotal = dayActivities.reduce((sum, activity) => sum + activity.value, 0);
      data.push(dayTotal);

      if (selectedPeriod === 'week') labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      else labels.push(date.getDate().toString());
    }
    return { labels, datasets: [{ data }] };
  };

  const selectedType = activityTypes.find(type => type.value === selectedActivity)!;

  const chartConfig: ChartConfig = {
    backgroundColor: '#ffffff', backgroundGradientFrom: '#ffffff', backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: () => selectedType.color,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '4', strokeWidth: '2' },
  };

  const chartData = getChartData();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Progress Tracking</Text><Text style={styles.subtitle}>Monitor your health journey</Text></View>
      <View style={styles.periodContainer}>
        <TouchableOpacity style={[styles.periodButton, selectedPeriod === 'week' && styles.selectedPeriodButton]} onPress={() => setSelectedPeriod('week')}><Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.selectedPeriodButtonText]}>7 Days</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.periodButton, selectedPeriod === 'month' && styles.selectedPeriodButton]} onPress={() => setSelectedPeriod('month')}><Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.selectedPeriodButtonText]}>30 Days</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activityContainer}>
        {activityTypes.map((activity) => (
          <TouchableOpacity key={activity.value} style={[styles.activityButton, selectedActivity === activity.value && { backgroundColor: activity.color, borderColor: activity.color }]} onPress={() => setSelectedActivity(activity.value)}><Text style={[styles.activityButtonText, selectedActivity === activity.value && styles.selectedActivityButtonText]}>{activity.label}</Text></TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{selectedType.label} - Last {selectedPeriod === 'week' ? 7 : 30} Days</Text>
        {chartData.datasets[0].data.some(v => v > 0) ? (<LineChart data={chartData} width={screenWidth - 40} height={220} chartConfig={chartConfig} bezier style={styles.chart} />) : (<View style={styles.noDataContainer}><Ionicons name="bar-chart-outline" size={60} color="#ccc" /><Text style={styles.noDataText}>No data available for this period</Text></View>)}
      </View>
    </ScrollView>
  );
};

// Add styles here...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#4facfe', paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 16, color: 'white', opacity: 0.9 },
  periodContainer: { flexDirection: 'row', margin: 20, backgroundColor: 'white', borderRadius: 25, padding: 5 },
  periodButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  selectedPeriodButton: { backgroundColor: '#4facfe' },
  periodButtonText: { fontSize: 16, color: '#666', fontWeight: '600' },
  selectedPeriodButtonText: { color: 'white' },
  activityContainer: { paddingHorizontal: 20, marginBottom: 20 },
  activityButton: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', marginRight: 10 },
  activityButtonText: { fontSize: 14, color: '#666', fontWeight: '600' },
  selectedActivityButtonText: { color: 'white' },
  chartContainer: { backgroundColor: 'white', margin: 20, borderRadius: 15, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  chart: { marginVertical: 8, borderRadius: 16 },
  noDataContainer: { alignItems: 'center', paddingVertical: 40 },
  noDataText: { fontSize: 16, color: '#666', marginTop: 15, fontWeight: '600' },
});

export default ProgressScreen;