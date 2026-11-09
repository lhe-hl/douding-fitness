import { describe, expect, it } from 'vitest'
import { extractBadge, isValidYearMonth, isValidYmd, resolveNotesUpdate } from './workout-rules'

describe('isValidYmd', () => {
  it('接受 YYYY-MM-DD，拒绝不存在的日期', () => {
    expect(isValidYmd('2026-11-09')).toBe(true)
    expect(isValidYmd('2026-02-31')).toBe(false)
    expect(isValidYmd('2026-11-9')).toBe(false)
  })
})

describe('isValidYearMonth', () => {
  it('月份只接受 1 到 12 的整数', () => {
    expect(isValidYearMonth(2026, 11)).toBe(true)
    expect(isValidYearMonth(2026, 0)).toBe(false)
    expect(isValidYearMonth(2026, 13)).toBe(false)
    expect(isValidYearMonth(Number.NaN, 1)).toBe(false)
  })
})

describe('extractBadge', () => {
  it('按胸、肩、背、腿、腰或核心、臂或二头或三头、有氧或跑的顺序取简字', () => {
    expect(extractBadge('肩部 & 胸部')).toBe('胸')
    expect(extractBadge('肩部 & 手臂')).toBe('肩')
    expect(extractBadge('背部')).toBe('背')
    expect(extractBadge('腿部')).toBe('腿')
    expect(extractBadge('腰腹核心')).toBe('腰')
    expect(extractBadge('核心训练')).toBe('腰')
    expect(extractBadge('二头')).toBe('臂')
    expect(extractBadge('三头')).toBe('臂')
    expect(extractBadge('手臂')).toBe('臂')
    expect(extractBadge('有氧燃脂')).toBe('跑')
    expect(extractBadge('跑步')).toBe('跑')
  })

  it('对不上时取首字，空字符串是练', () => {
    expect(extractBadge('瑜伽')).toBe('瑜')
    expect(extractBadge('')).toBe('练')
  })
})

describe('resolveNotesUpdate', () => {
  it('请求没带 notes 时保留原来的感受', () => {
    expect(resolveNotesUpdate(undefined, '旧感受')).toBe('旧感受')
  })

  it('空字符串或 null 表示清空', () => {
    expect(resolveNotesUpdate('', '旧感受')).toBeNull()
    expect(resolveNotesUpdate(null, '旧感受')).toBeNull()
  })

  it('有内容时写入新感受', () => {
    expect(resolveNotesUpdate('今天肩有点酸，但完成了', '旧感受')).toBe('今天肩有点酸，但完成了')
    expect(resolveNotesUpdate('新感受', null)).toBe('新感受')
  })
})
