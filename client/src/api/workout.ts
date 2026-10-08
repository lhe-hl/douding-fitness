import { request } from './request'

export interface MonthWorkoutItem {
  id: string
  date: string
  duration: number
  bodyParts: string
  bodyPartBadge: string
}

export interface DayWorkoutDetailResponse {
  id: string
  date: string
  durationMinutes: number
  bodyPartsTitle: string
  status: 'COMPLETED' | 'REST'
  notes?: string
  exercises?: Array<{
    id: string
    actionName: string
    sets: number
    weight: number
    reps: number
  }>
}

export interface SaveWorkoutPayload {
  date: string
  duration: number
  bodyParts: string
  notes?: string
  exercises?: Array<{
    actionName: string
    sets: number
    weight: number
    reps: number
  }>
}

/**
 * 1. 获取指定月份的训练打卡摘要列表 (日历渲染)
 */
export function getWorkoutMonth(year: number, month: number) {
  return request<MonthWorkoutItem[]>({
    url: `/workout/month?year=${year}&month=${month}`,
    method: 'GET',
  })
}

/**
 * 2. 获取某一天的详细训练记录 (详情卡片)
 */
export function getWorkoutDay(date: string) {
  return request<DayWorkoutDetailResponse | null>({
    url: `/workout/day?date=${date}`,
    method: 'GET',
  })
}

/**
 * 3. 提交/保存训练打卡
 */
export function saveWorkout(data: SaveWorkoutPayload) {
  return request<DayWorkoutDetailResponse>({
    url: '/workout',
    method: 'POST',
    data,
  })
}

/**
 * 4. 删除指定训练记录
 */
export function deleteWorkout(id: string) {
  return request<boolean>({
    url: `/workout/${id}`,
    method: 'DELETE',
  })
}
