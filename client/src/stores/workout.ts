import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface WeekDayStatus {
  dayLabel: string
  completed: boolean
  percent: number
  bodyPart?: string
}

export const useWorkoutStore = defineStore('workout', () => {
  // 本周打卡次数
  const weekCount = ref(4)

  // 周一到周日 7 天打卡状态与部位
  const weekDays = ref<WeekDayStatus[]>([
    { dayLabel: '一', completed: true, percent: 100, bodyPart: '胸' },
    { dayLabel: '二', completed: true, percent: 100, bodyPart: '背' },
    { dayLabel: '三', completed: true, percent: 100, bodyPart: '腿' },
    { dayLabel: '四', completed: true, percent: 100, bodyPart: '肩' },
    { dayLabel: '五', completed: false, percent: 0 },
    { dayLabel: '六', completed: false, percent: 0 },
    { dayLabel: '日', completed: false, percent: 0 },
  ])

  // 焦点标签
  const focusTags = ref(['胸肩塑形', '有氧燃脂'])

  // 动作：当天打卡完成
  function recordWorkout(dayIndex: number, bodyPart: string) {
    if (weekDays.value[dayIndex]) {
      weekDays.value[dayIndex].completed = true
      weekDays.value[dayIndex].percent = 100
      weekDays.value[dayIndex].bodyPart = bodyPart
      weekCount.value++
    }
  }

  return {
    weekCount,
    weekDays,
    focusTags,
    recordWorkout,
  }
})
