export function isValidYmd(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

export function isValidYearMonth(year: number, month: number): boolean {
  return Number.isInteger(year) && Number.isInteger(month) && month >= 1 && month <= 12
}

/**
 * 训练部位简字。顺序固定：胸、肩、背、腿、腰或核心、臂或二头或三头、有氧或跑，否则取首字。
 */
export function extractBadge(bodyParts: string): string {
  if (!bodyParts) return '练'
  if (bodyParts.includes('胸')) return '胸'
  if (bodyParts.includes('肩')) return '肩'
  if (bodyParts.includes('背')) return '背'
  if (bodyParts.includes('腿')) return '腿'
  if (bodyParts.includes('腰') || bodyParts.includes('核心')) return '腰'
  if (bodyParts.includes('臂') || bodyParts.includes('二头') || bodyParts.includes('三头')) return '臂'
  if (bodyParts.includes('有氧') || bodyParts.includes('跑')) return '跑'
  return bodyParts.charAt(0) || '练'
}

/**
 * 请求没带 notes 时保留原值；空字符串和 null 都清空。
 */
export function resolveNotesUpdate(incoming: string | null | undefined, existing: string | null): string | null {
  if (incoming === undefined) return existing
  if (incoming === null || incoming === '') return null
  return incoming
}
