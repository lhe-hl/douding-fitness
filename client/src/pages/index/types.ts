export interface UserHeaderData {
  avatarUrl: string;
  greeting: string;
  dateStr: string;
  streakDays: number;
  isLoggedIn: boolean;
}

export type HomeWorkoutStatus = 'loading' | 'ready' | 'error' | 'stale'

export interface HomeWeekDay {
  dayLabel: string
  date: string
  completed: boolean
  bodyPartBadge: string
  isToday: boolean
}

export interface HomeTodayEcho {
  bodyPartsTitle: string
  durationMinutes: number
  notes: string | null
  tags: string[]
}

export interface WorkoutData {
  status: HomeWorkoutStatus
  weekCount: number
  days: HomeWeekDay[]
  today: HomeTodayEcho | null
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
