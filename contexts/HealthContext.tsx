import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, doc, setDoc, getDoc, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { UserProfile, Activity, Gender, Lifestyle } from '../types';

type ProfileData = Omit<UserProfile, 'userId' | 'email' | 'bmi' | 'calorieNeeds' | 'updatedAt'>;
type ActivityData = Omit<Activity, 'userId' | 'date' | 'createdAt'>;

interface HealthContextType {
  userProfile: UserProfile | null;
  activities: Activity[];
  loading: boolean;
  saveUserProfile: (profileData: ProfileData) => Promise<void>;
  loadUserProfile: () => Promise<void>;
  logActivity: (activityData: ActivityData) => Promise<void>;
  loadActivities: () => Promise<void>;
  calculateBMI: (weight: number, height: number) => string;
  calculateCalorieNeeds: (weight: number, height: number, age: number, gender: Gender, lifestyle: Lifestyle) => number;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const useHealth = (): HealthContextType => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

interface HealthProviderProps {
  children: ReactNode;
}

export const HealthProvider: React.FC<HealthProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateBMI = (weight: number, height: number): string => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateCalorieNeeds = (weight: number, height: number, age: number, gender: Gender, lifestyle: Lifestyle): number => {
    let bmr: number;
    if (gender === 'male') {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
    }

    const activityMultipliers: Record<Lifestyle, number> = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
      '': 1.2,
    };

    return Math.round(bmr * (activityMultipliers[lifestyle] || 1.2));
  };

  const saveUserProfile = async (profileData: ProfileData): Promise<void> => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const bmi = calculateBMI(profileData.weight, profileData.height);
      const calorieNeeds = calculateCalorieNeeds(
        profileData.weight,
        profileData.height,
        profileData.age,
        profileData.gender,
        profileData.lifestylePreferences
      );

      const profile: UserProfile = {
        ...profileData,
        bmi: parseFloat(bmi),
        calorieNeeds,
        userId: currentUser.uid,
        email: currentUser.email!,
        updatedAt: new Date(),
      };
      await setDoc(doc(db, 'userProfiles', currentUser.uid), profile);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (): Promise<void> => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const docRef = doc(db, 'userProfiles', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const logActivity = async (activityData: ActivityData): Promise<void> => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const activity: Omit<Activity, 'id'> = {
        ...activityData,
        userId: currentUser.uid,
        date: new Date(),
        createdAt: new Date(),
      };
      await addDoc(collection(db, 'activities'), activity);
      await loadActivities();
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async (): Promise<void> => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const q = query(
        collection(db, 'activities'),
        where('userId', '==', currentUser.uid),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const activitiesData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Activity)
      );
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
      loadActivities();
    } else {
      setUserProfile(null);
      setActivities([]);
    }
  }, [currentUser]);

  const value: HealthContextType = {
    userProfile,
    activities,
    loading,
    saveUserProfile,
    loadUserProfile,
    logActivity,
    loadActivities,
    calculateBMI,
    calculateCalorieNeeds,
  };
  

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
};