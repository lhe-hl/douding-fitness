import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface WeekDayStatus {
  dayLabel: string
  completed: boolean
  bodyPart?: string
}

const EMPTY_WEEK: WeekDayStatus[] = [
  { dayLabel: '一', completed: false },
  { dayLabel: '二', completed: false },
  { dayLabel: '三', completed: false },
  { dayLabel: '四', completed: false },
  { dayLabel: '五', completed: false },
  { dayLabel: '六', completed: false },
  { dayLabel: '日', completed: false },
]

export const useWorkoutStore = defineStore('workout', () => {
  const weekCount = ref(0)
  const weekDays = ref<WeekDayStatus[]>(EMPTY_WEEK.map((day) => ({ ...day })))
  const focusTags = ref<string[]>([])

  return {
    weekCount,
    weekDays,
    focusTags,
  }
})
