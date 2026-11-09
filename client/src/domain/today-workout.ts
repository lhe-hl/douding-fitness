export const BODY_PART_OPTIONS = ['胸部', '背部', '肩部', '腿部', '手臂', '腰腹核心', '有氧燃脂'] as const

const WEEK_LABELS = ['一', '二', '三', '四', '五', '六', '日'] as const

export function isValidYmd(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

export function formatLocalYmd(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const monthText = month < 10 ? `0${month}` : `${month}`
  const dayText = day < 10 ? `0${day}` : `${day}`
  return `${year}-${monthText}-${dayText}`
}

export function weekDateStrings(today: Date): string[] {
  const local = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const weekday = local.getDay()
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday
  const monday = new Date(local.getFullYear(), local.getMonth(), local.getDate() + mondayOffset)
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index)
    return formatLocalYmd(day)
  })
}

export function countDistinctWorkoutDates(weekDates: readonly string[], recordedDates: readonly string[]): number {
  const week = new Set(weekDates)
  const hit = new Set<string>()
  for (const date of recordedDates) {
    if (week.has(date)) hit.add(date)
  }
  return hit.size
}

export function yearMonthsInDates(dates: readonly string[]): Array<{ year: number; month: number }> {
  const seen = new Set<string>()
  const months: Array<{ year: number; month: number }> = []
  for (const date of dates) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
    if (!match) continue
    const key = `${match[1]}-${match[2]}`
    if (seen.has(key)) continue
    seen.add(key)
    months.push({ year: Number(match[1]), month: Number(match[2]) })
  }
  return months
}

export function splitBodyPartsTitle(
  title: string,
  options: readonly string[] = BODY_PART_OPTIONS,
): { parts: string[]; refillable: boolean } {
  const parts = title.split(' & ').map((part) => part.trim()).filter((part) => part.length > 0)
  const refillable = parts.length > 0 && parts.every((part) => options.includes(part))
  return { parts, refillable }
}

export function resolveFormInitial(detail: {
  bodyPartsTitle: string
  durationMinutes: number
  notes: string | null
} | null): {
  bodyParts: string[]
  duration: number
  notes: string
  unresolvedTitle: string | null
  editing: boolean
} {
  if (!detail) {
    return {
      bodyParts: ['肩部', '手臂'],
      duration: 60,
      notes: '',
      unresolvedTitle: null,
      editing: false,
    }
  }
  const split = splitBodyPartsTitle(detail.bodyPartsTitle)
  return {
    bodyParts: split.refillable ? split.parts : [],
    duration: detail.durationMinutes,
    notes: detail.notes ?? '',
    unresolvedTitle: split.refillable ? null : detail.bodyPartsTitle,
    editing: true,
  }
}

function monthDayText(ymd: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd)
  if (!match) return ymd
  return `${Number(match[2])}月${Number(match[3])}日`
}

export function formatSelectedDateLabel(ymd: string, todayYmd: string): string {
  const text = monthDayText(ymd)
  return ymd === todayYmd ? `${text} · 今天` : text
}

export function formatFormTitle(ymd: string, editing: boolean): string {
  return `${editing ? '修改' : '记录'}${monthDayText(ymd)}训练`
}

export function buildWeekWorkoutView(args: {
  today: string
  weekDates: string[]
  records: Array<{ date: string; bodyPartBadge: string }>
  todayDetail: {
    bodyPartsTitle: string
    durationMinutes: number
    notes: string | null
  } | null
}): {
  weekCount: number
  days: Array<{
    dayLabel: string
    date: string
    completed: boolean
    bodyPartBadge: string
    isToday: boolean
  }>
  today: {
    bodyPartsTitle: string
    durationMinutes: number
    notes: string | null
    tags: string[]
  } | null
} {
  const badgeByDate = new Map<string, string>()
  for (const record of args.records) {
    if (!badgeByDate.has(record.date)) badgeByDate.set(record.date, record.bodyPartBadge)
  }
  const recordedDates = [...badgeByDate.keys()]
  if (args.todayDetail) recordedDates.push(args.today)

  const days = args.weekDates.map((date, index) => ({
    dayLabel: WEEK_LABELS[index] ?? '',
    date,
    completed: badgeByDate.has(date) || (args.todayDetail != null && date === args.today),
    bodyPartBadge: badgeByDate.get(date) ?? '',
    isToday: date === args.today,
  }))

  if (!args.todayDetail) {
    return {
      weekCount: countDistinctWorkoutDates(args.weekDates, recordedDates),
      days,
      today: null,
    }
  }

  const split = splitBodyPartsTitle(args.todayDetail.bodyPartsTitle)
  return {
    weekCount: countDistinctWorkoutDates(args.weekDates, recordedDates),
    days,
    today: {
      bodyPartsTitle: args.todayDetail.bodyPartsTitle,
      durationMinutes: args.todayDetail.durationMinutes,
      notes: args.todayDetail.notes ? args.todayDetail.notes : null,
      tags: split.refillable ? split.parts : [],
    },
  }
}
