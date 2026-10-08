// 健身记录页类型定义

// 单个日历格子
export interface CalendarDayItem {
  year: number
  month: number // 1 - 12
  date: number  // 1 - 31
  fullDateStr: string // "YYYY-MM-DD"
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  hasWorkout: boolean
  bodyPartBadge?: string // 如 "胸", "肩", "背", "腿", "腰"
}

// 选中日期的训练记录详情
export interface DayWorkoutDetail {
  recordId?: string
  date: string
  durationMinutes: number // 训练时长(分钟)
  bodyPartsTitle: string  // 训练内容, 如 "肩部 & 手臂"
  status: 'COMPLETED' | 'REST' // "已完成" 或 "休息"
  notes?: string
}

// 新增打卡表单数据
export interface AddWorkoutForm {
  date: string
  bodyParts: string[]
  duration: number
  notes?: string
}
