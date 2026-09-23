export interface UserHeaderData {
  avatarUrl: string;
  greeting: string;
  dateStr: string;
  streakDays: number;
  isLoggedIn: boolean;
}

export interface DayStatus {
  dayLabel: string;
  completed: boolean;
  percent: number; // 0 - 100
}

export interface WorkoutData {
  weekCount: number;
  days: DayStatus[];
  energyPercent: number;
  tags: string[];
}

export interface MacroItem {
  name: string;
  current: number;
  target: number;
  color: string;
  displayValue: string;
}

export interface DietData {
  currentCalories: number;
  targetCalories: number;
  deficitText: string;
  macros: {
    protein: MacroItem;
    carbs: MacroItem;
    fat: MacroItem;
  };
  selectedMeal: 'breakfast' | 'lunch' | 'dinner';
}

export interface AiCoachData {
  message: string;
}
