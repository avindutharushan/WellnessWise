import { Timestamp } from 'firebase/firestore';

export type Gender = 'male' | 'female' | 'other' | '';
export type Lifestyle =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active'
  | '';
export type ActivityType = 'water' | 'exercise' | 'sleep' | 'meal';


export interface UserProfile {
  userId: string;
  email: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  lifestylePreferences: Lifestyle;
  bmi: number;
  calorieNeeds: number;
  updatedAt: Date | Timestamp;
}

export interface Activity {
  id?: string;
  userId: string;
  type: ActivityType;
  value: number;
  notes?: string;
  date: Date | Timestamp;
  createdAt: Date | Timestamp;
}

// React Navigation Param Lists
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  LogActivity: { type: ActivityType | '' };
  Progress: undefined;
  HealthTips: undefined;
  Settings: undefined;
};

export type AppStackParamList = {
  UserSetup: undefined;
  MainTabs: undefined;
  EditProfile: undefined;
};