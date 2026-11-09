import { ref } from 'vue'
import { getWorkoutDay, getWorkoutMonth } from '../../api/workout'
import { buildWeekWorkoutView, formatLocalYmd, weekDateStrings, yearMonthsInDates } from '../../domain/today-workout'
import type { HomeTodayEcho, HomeWeekDay, HomeWorkoutStatus } from './types'

export function useHomeWorkout() {
  const status = ref<HomeWorkoutStatus>('loading')
  const weekCount = ref(0)
  const days = ref<HomeWeekDay[]>([])
  const today = ref<HomeTodayEcho | null>(null)
  let requestToken = 0

  async function refresh() {
    const token = ++requestToken
    const now = new Date()
    const todayStr = formatLocalYmd(now)
    const weekDates = weekDateStrings(now)
    const months = yearMonthsInDates(weekDates)
    try {
      const [lists, day] = await Promise.all([
        Promise.all(months.map((item) => getWorkoutMonth(item.year, item.month, true))),
        getWorkoutDay(todayStr, true),
      ])
      if (token !== requestToken) return
      const view = buildWeekWorkoutView({
        today: todayStr,
        weekDates,
        records: lists.flat().map((item) => ({
          date: item.date,
          bodyPartBadge: item.bodyPartBadge,
        })),
        todayDetail: day
          ? {
              bodyPartsTitle: day.bodyPartsTitle,
              durationMinutes: day.durationMinutes,
              notes: day.notes,
            }
          : null,
      })
      weekCount.value = view.weekCount
      days.value = view.days
      today.value = view.today
      status.value = 'ready'
    } catch {
      if (token !== requestToken) return
      status.value = status.value === 'ready' || status.value === 'stale' ? 'stale' : 'error'
    }
  }

  return { status, weekCount, days, today, refresh }
}
