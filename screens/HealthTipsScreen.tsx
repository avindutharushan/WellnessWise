import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TipCategory = 'nutrition' | 'exercise' | 'sleep' | 'mental' | 'hydration';

interface HealthTip {
  id: number;
  category: TipCategory;
  title: string;
  content: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface CategoryFilter {
  value: TipCategory | 'all';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const HealthTipsScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<TipCategory | 'all'>('all');

  const categories: CategoryFilter[] = [
    { value: 'all', label: 'All Tips', icon: 'list' },
    { value: 'nutrition', label: 'Nutrition', icon: 'restaurant' },
    { value: 'exercise', label: 'Exercise', icon: 'fitness' },
    { value: 'sleep', label: 'Sleep', icon: 'bed' },
    { value: 'mental', label: 'Mental Health', icon: 'heart' },
    { value: 'hydration', label: 'Hydration', icon: 'water' },
  ];

  const healthTips: HealthTip[] = [
    { id: 1, category: 'nutrition', title: 'Eat the Rainbow', content: 'Include a variety of colorful fruits and vegetables in your diet. Different colors provide different nutrients and antioxidants.', icon: 'color-palette', color: '#e74c3c' },
    { id: 2, category: 'hydration', title: 'Start Your Day with Water', content: 'Drink a glass of water first thing in the morning to kickstart your metabolism and rehydrate your body.', icon: 'water', color: '#3498db' },
    { id: 3, category: 'exercise', title: 'Take the Stairs', content: 'Choose stairs over elevators. This simple change can significantly increase your daily physical activity.', icon: 'trending-up', color: '#e74c3c' },
    { id: 4, category: 'sleep', title: 'Create a Sleep Routine', content: 'Go to bed and wake up at the same time every day, even on weekends, to regulate your internal clock.', icon: 'time', color: '#9b59b6' },
    { id: 5, category: 'mental', title: 'Practice Deep Breathing', content: 'Take 5 minutes daily for deep breathing exercises. It helps reduce stress and anxiety.', icon: 'leaf', color: '#2ecc71' },
    { id: 6, category: 'nutrition', title: 'Portion Control', content: 'Use smaller plates to naturally reduce portion sizes. This can help you eat less without feeling deprived.', icon: 'resize', color: '#f39c12' },
    { id: 7, category: 'exercise', title: 'Move Every Hour', content: 'Set a reminder to move for 2-3 minutes every hour to counteract the effects of prolonged sitting.', icon: 'alarm', color: '#e74c3c' },
    { id: 8, category: 'hydration', title: 'Flavor Your Water', content: 'Add natural flavors to your water with cucumber, lemon, or berries to make hydration more enjoyable.', icon: 'leaf', color: '#3498db' },
    { id: 9, category: 'sleep', title: 'Digital Sunset', content: 'Avoid screens 1 hour before bedtime. Blue light can interfere with sleep quality.', icon: 'phone-portrait', color: '#9b59b6' },
    { id: 10, category: 'mental', title: 'Gratitude Practice', content: 'Write down 3 things you\'re grateful for each day to improve mood and reduce stress.', icon: 'heart', color: '#2ecc71' },
  ];

  const filteredTips = selectedCategory === 'all'
    ? healthTips
    : healthTips.filter(tip => tip.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health & Wellness Tips</Text>
        <Text style={styles.subtitle}>Expert advice for a healthier you</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer} contentContainerStyle={styles.categoryContent}>
        {categories.map((category) => (
          <TouchableOpacity key={category.value} style={[styles.categoryButton, selectedCategory === category.value && styles.selectedCategoryButton]} onPress={() => setSelectedCategory(category.value)}>
            <Ionicons name={category.icon} size={20} color={selectedCategory === category.value ? 'white' : '#666'} />
            <Text style={[styles.categoryButtonText, selectedCategory === category.value && styles.selectedCategoryButtonText]}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.tipsContainer}>
        {filteredTips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={[styles.tipIcon, { backgroundColor: tip.color }]}>
                <Ionicons name={tip.icon} size={24} color="white" />
              </View>
              <View style={styles.tipHeaderText}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipCategory}>{categories.find(cat => cat.value === tip.category)?.label}</Text>
              </View>
            </View>
            <Text style={styles.tipContent}>{tip.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dailyTipContainer}>
        <View style={styles.dailyTipHeader}><Ionicons name="bulb" size={24} color="#f39c12" /><Text style={styles.dailyTipTitle}>Tip of the Day</Text></View>
        <Text style={styles.dailyTipText}>{healthTips[new Date().getDate() % healthTips.length].content}</Text>
      </View>
    </View>
  );
};

// Add styles here...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#4facfe', paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 16, color: 'white', opacity: 0.9 },
  categoryContainer: { backgroundColor: 'white', paddingVertical: 15 },
  categoryContent: { paddingHorizontal: 20 },
  categoryButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', marginRight: 10 },
  selectedCategoryButton: { backgroundColor: '#4facfe', borderColor: '#4facfe' },
  categoryButtonText: { fontSize: 14, color: '#666', fontWeight: '600', marginLeft: 5 },
  selectedCategoryButtonText: { color: 'white' },
  tipsContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  tipCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  tipIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  tipHeaderText: { flex: 1 },
  tipTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  tipCategory: { fontSize: 12, color: '#666', textTransform: 'uppercase', fontWeight: '600' },
  tipContent: { fontSize: 16, color: '#555', lineHeight: 24 },
  dailyTipContainer: { backgroundColor: '#fff3cd', margin: 20, padding: 20, borderRadius: 15, borderLeftWidth: 4, borderLeftColor: '#f39c12' },
  dailyTipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dailyTipTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  dailyTipText: { fontSize: 16, color: '#555', lineHeight: 24 },
});

export default HealthTipsScreen;