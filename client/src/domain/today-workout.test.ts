import { describe, expect, it } from 'vitest'
import {
  buildWeekWorkoutView,
  countDistinctWorkoutDates,
  formatFormTitle,
  formatSelectedDateLabel,
  isValidYmd,
  resolveFormInitial,
  splitBodyPartsTitle,
  weekDateStrings,
  yearMonthsInDates,
} from './today-workout'

describe('isValidYmd', () => {
  it('接受真实存在的 YYYY-MM-DD', () => {
    expect(isValidYmd('2026-11-09')).toBe(true)
  })

  it('拒绝缺位、越界月份和日历上不存在的日期', () => {
    expect(isValidYmd('20261109')).toBe(false)
    expect(isValidYmd('2026-1-09')).toBe(false)
    expect(isValidYmd('2026-13-01')).toBe(false)
    expect(isValidYmd('2026-02-31')).toBe(false)
  })
})

describe('weekDateStrings', () => {
  it('用本地日历算出周一到周日，不解析 YYYY-MM-DD 字符串', () => {
    expect(weekDateStrings(new Date(2026, 10, 11))).toEqual([
      '2026-11-09',
      '2026-11-10',
      '2026-11-11',
      '2026-11-12',
      '2026-11-13',
      '2026-11-14',
      '2026-11-15',
    ])
  })

  it('周日仍属于刚结束的这一周，下周一另起一周', () => {
    expect(weekDateStrings(new Date(2026, 10, 15))[0]).toBe('2026-11-09')
    expect(weekDateStrings(new Date(2026, 10, 15))[6]).toBe('2026-11-15')
    expect(weekDateStrings(new Date(2026, 10, 16))[0]).toBe('2026-11-16')
  })

  it('跨月的一周仍是 7 个日期字符串', () => {
    expect(weekDateStrings(new Date(2026, 10, 1))).toEqual([
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
    ])
  })
})

describe('countDistinctWorkoutDates', () => {
  const week = [
    '2026-11-09',
    '2026-11-10',
    '2026-11-11',
    '2026-11-12',
    '2026-11-13',
    '2026-11-14',
    '2026-11-15',
  ]

  it('没有记录是 0', () => {
    expect(countDistinctWorkoutDates(week, [])).toBe(0)
  })

  it('同一天第二次保存仍是 1，重复日期只算 1', () => {
    expect(countDistinctWorkoutDates(week, ['2026-11-09', '2026-11-09'])).toBe(1)
  })

  it('删掉这一天后是 0', () => {
    const recorded = ['2026-11-09']
    const afterDelete = recorded.filter((date) => date !== '2026-11-09')
    expect(countDistinctWorkoutDates(week, afterDelete)).toBe(0)
  })

  it('一周里两天有记录是 2，周外的日期不加次数', () => {
    expect(countDistinctWorkoutDates(week, ['2026-11-09', '2026-11-12', '2026-11-02'])).toBe(2)
  })
})

describe('yearMonthsInDates', () => {
  it('跨月时按出现顺序给出两个年月，同一个月只出现一次', () => {
    expect(yearMonthsInDates(['2026-10-31', '2026-11-01', '2026-10-26'])).toEqual([
      { year: 2026, month: 10 },
      { year: 2026, month: 11 },
    ])
  })
})

describe('splitBodyPartsTitle', () => {
  it('按 & 拆开并去掉两端空白，顺序保持选择顺序', () => {
    expect(splitBodyPartsTitle('  手臂  &  肩部 ')).toEqual({
      parts: ['手臂', '肩部'],
      refillable: true,
    })
  })

  it('每一段都在胶囊列表里才可回填', () => {
    expect(splitBodyPartsTitle('肩部 & 手臂').refillable).toBe(true)
    expect(splitBodyPartsTitle('肩部').refillable).toBe(true)
  })

  it('拆不开时不得替换成默认肩部和手臂', () => {
    const split = splitBodyPartsTitle('肩部+手臂')
    expect(split.refillable).toBe(false)
    expect(split.parts).not.toEqual(['肩部', '手臂'])
    expect(splitBodyPartsTitle('肩部 & 小腿').refillable).toBe(false)
  })
})

describe('resolveFormInitial', () => {
  it('没有记录时才使用肩部、手臂和 60 分钟', () => {
    expect(resolveFormInitial(null)).toEqual({
      bodyParts: ['肩部', '手臂'],
      duration: 60,
      notes: '',
      unresolvedTitle: null,
      editing: false,
    })
  })

  it('已有记录按详情回填，时长不在五档里也原样保留', () => {
    expect(resolveFormInitial({
      bodyPartsTitle: '腿部 & 腰腹核心',
      durationMinutes: 75,
      notes: null,
    })).toEqual({
      bodyParts: ['腿部', '腰腹核心'],
      duration: 75,
      notes: '',
      unresolvedTitle: null,
      editing: true,
    })
  })

  it('标题拆不开时清空部位选择，并保留原标题、时长和感受', () => {
    expect(resolveFormInitial({
      bodyPartsTitle: '肩部+手臂',
      durationMinutes: 40,
      notes: '今天肩有点酸，但完成了',
    })).toEqual({
      bodyParts: [],
      duration: 40,
      notes: '今天肩有点酸，但完成了',
      unresolvedTitle: '肩部+手臂',
      editing: true,
    })
  })
})

describe('日期文案', () => {
  it('去掉前导 0，今天带上今天，不用 Date 解析日期字符串', () => {
    expect(formatSelectedDateLabel('2026-11-09', '2026-11-09')).toBe('11月9日 · 今天')
    expect(formatSelectedDateLabel('2026-11-09', '2026-11-10')).toBe('11月9日')
    expect(formatFormTitle('2026-11-09', false)).toBe('记录11月9日训练')
    expect(formatFormTitle('2026-11-09', true)).toBe('修改11月9日训练')
  })
})

describe('buildWeekWorkoutView', () => {
  const weekDates = [
    '2026-11-09',
    '2026-11-10',
    '2026-11-11',
    '2026-11-12',
    '2026-11-13',
    '2026-11-14',
    '2026-11-15',
  ]

  it('同一天只计一次，今天的标签只在能拆开时出现', () => {
    const view = buildWeekWorkoutView({
      today: '2026-11-09',
      weekDates,
      records: [
        { date: '2026-11-09', bodyPartBadge: '肩' },
        { date: '2026-11-09', bodyPartBadge: '肩' },
        { date: '2026-11-12', bodyPartBadge: '腿' },
      ],
      todayDetail: {
        bodyPartsTitle: '肩部 & 手臂',
        durationMinutes: 60,
        notes: '今天肩有点酸，但完成了',
      },
    })

    expect(view.weekCount).toBe(2)
    expect(view.days[0]).toMatchObject({ dayLabel: '一', completed: true, bodyPartBadge: '肩', isToday: true })
    expect(view.days[3]).toMatchObject({ dayLabel: '四', completed: true, bodyPartBadge: '腿', isToday: false })
    expect(view.days[1].completed).toBe(false)
    expect(view.today).toEqual({
      bodyPartsTitle: '肩部 & 手臂',
      durationMinutes: 60,
      notes: '今天肩有点酸，但完成了',
      tags: ['肩部', '手臂'],
    })
  })

  it('今天没有记录时不回显，拆不开的标题不回落到示例标签', () => {
    const empty = buildWeekWorkoutView({
      today: '2026-11-09',
      weekDates,
      records: [],
      todayDetail: null,
    })
    expect(empty.weekCount).toBe(0)
    expect(empty.today).toBeNull()

    const opaque = buildWeekWorkoutView({
      today: '2026-11-09',
      weekDates,
      records: [{ date: '2026-11-09', bodyPartBadge: '练' }],
      todayDetail: {
        bodyPartsTitle: '胸肩塑形',
        durationMinutes: 45,
        notes: '',
      },
    })
    expect(opaque.today?.tags).toEqual([])
    expect(opaque.today?.notes).toBeNull()
    expect(opaque.today?.bodyPartsTitle).toBe('胸肩塑形')
  })
})
