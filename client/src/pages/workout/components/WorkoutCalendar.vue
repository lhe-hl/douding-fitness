<template>
  <view class="calendar-card">
    <!-- 顶部年月栏与左右箭头 -->
    <view class="calendar-header">
      <text class="month-title">{{ monthText }} {{ year }}</text>
      <view class="nav-arrows">
        <view class="arrow-btn" @tap="handlePrevMonth">
          <text class="arrow-icon">‹</text>
        </view>
        <view class="arrow-btn" @tap="handleNextMonth">
          <text class="arrow-icon">›</text>
        </view>
      </view>
    </view>

    <!-- 星期表头 (日 一 二 三 四 五 六) -->
    <view class="week-header">
      <text
        v-for="(w, idx) in weekDays"
        :key="idx"
        class="week-cell"
      >{{ w }}</text>
    </view>

    <!-- 日历主体网格 (7列) -->
    <view class="days-grid">
      <view
        v-for="(day, index) in calendarDays"
        :key="index"
        class="day-cell"
        :class="{
          'not-current-month': !day.isCurrentMonth,
          'day-selected': day.isSelected,
        }"
        @tap="handleSelectDay(day)"
      >
        <!-- 日期数字（选中时呈现绿色光晕圆圈） -->
        <view
          class="date-number-wrap"
          :class="{
            'number-active': day.isSelected,
          }"
        >
          <text class="date-number">{{ day.date }}</text>
        </view>

        <!-- 训练部位绿色胶囊徽章（已打卡日显示） -->
        <view v-if="day.hasWorkout && day.bodyPartBadge" class="badge-wrap">
          <text class="body-badge">{{ day.bodyPartBadge }}</text>
        </view>
        <view v-else class="badge-placeholder"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CalendarDayItem } from '../types'

interface Props {
  year: number
  month: number // 1 - 12
  selectedDateStr: string // "YYYY-MM-DD"
  workoutMap: Record<string, { bodyPartBadge: string }>
}

const props = withDefaults(defineProps<Props>(), {
  year: 2023,
  month: 11,
  selectedDateStr: '2023-11-02',
  workoutMap: () => ({}),
})

const emit = defineEmits<{
  (e: 'select-date', dateStr: string): void
  (e: 'prev-month'): void
  (e: 'next-month'): void
}>()

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
]

const monthText = computed(() => {
  return monthNames[props.month - 1] || `${props.month}月`
})

// 计算 42 格日历数据
const calendarDays = computed<CalendarDayItem[]>(() => {
  const list: CalendarDayItem[] = []
  const { year, month, selectedDateStr, workoutMap } = props

  // 当月第 1 天是星期几 (0: 周日, 1: 周一, ... 6: 周六)
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()

  // 当月总天数
  const daysInCurrentMonth = new Date(year, month, 0).getDate()

  // 上个月总天数
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()

  const todayStr = getTodayDateStr()

  // 1. 补齐上个月末的剩余天数
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const fullDateStr = formatDateStr(prevYear, prevMonth, d)
    list.push({
      year: prevYear,
      month: prevMonth,
      date: d,
      fullDateStr,
      isCurrentMonth: false,
      isToday: fullDateStr === todayStr,
      isSelected: fullDateStr === selectedDateStr,
      hasWorkout: false,
    })
  }

  // 2. 填充当月的每一天
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const fullDateStr = formatDateStr(year, month, d)
    const workoutInfo = workoutMap[fullDateStr]
    list.push({
      year,
      month,
      date: d,
      fullDateStr,
      isCurrentMonth: true,
      isToday: fullDateStr === todayStr,
      isSelected: fullDateStr === selectedDateStr,
      hasWorkout: !!workoutInfo,
      bodyPartBadge: workoutInfo?.bodyPartBadge,
    })
  }

  // 3. 补齐下个月初的天数（填满 35 或 42 格）
  const totalCells = list.length > 35 ? 42 : 35
  const remainingCells = totalCells - list.length
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  for (let d = 1; d <= remainingCells; d++) {
    const fullDateStr = formatDateStr(nextYear, nextMonth, d)
    list.push({
      year: nextYear,
      month: nextMonth,
      date: d,
      fullDateStr,
      isCurrentMonth: false,
      isToday: fullDateStr === todayStr,
      isSelected: fullDateStr === selectedDateStr,
      hasWorkout: false,
    })
  }

  return list
})

const formatDateStr = (y: number, m: number, d: number) => {
  const mm = m < 10 ? `0${m}` : `${m}`
  const dd = d < 10 ? `0${d}` : `${d}`
  return `${y}-${mm}-${dd}`
}

const getTodayDateStr = () => {
  const now = new Date()
  return formatDateStr(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

const handleSelectDay = (day: CalendarDayItem) => {
  emit('select-date', day.fullDateStr)
}

const handlePrevMonth = () => {
  emit('prev-month')
}

const handleNextMonth = () => {
  emit('next-month')
}
</script>

<style scoped>
.calendar-card {
  background: #FFFFFF;
  border-radius: 40rpx;
  padding: 36rpx 28rpx 32rpx 28rpx;
  box-shadow: 0 10rpx 32rpx rgba(0, 0, 0, 0.035);
}

/* 顶部年月与左右翻页 */
.calendar-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 12rpx 24rpx 12rpx;
}

.month-title {
  font-size: 38rpx;
  font-weight: 800;
  color: #111111;
  letter-spacing: -0.5rpx;
}

.nav-arrows {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24rpx;
}

.arrow-btn {
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.15s ease;
}

.arrow-btn:active {
  background: #F0F2F5;
}

.arrow-icon {
  font-size: 40rpx;
  color: #8E8E93;
  line-height: 1;
  font-weight: 600;
}

/* 星期表头 */
.week-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12rpx 0 20rpx 0;
}

.week-cell {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  font-weight: 600;
  color: #8E8E93;
}

/* 日历网格 */
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 16rpx;
}

.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 86rpx;
}

.not-current-month .date-number {
  color: #CBD3DC !important;
}

/* 日期数字圆圈 */
.date-number-wrap {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.date-number {
  font-size: 28rpx;
  font-weight: 700;
  color: #1A1A1A;
}

/* 选中高亮状态：柔和绿底 + 绿色边框高光圈 */
.number-active {
  background: #E8F6DC;
  border: 2rpx solid #74C043;
  box-shadow: 0 4rpx 14rpx rgba(116, 192, 67, 0.25);
}

.number-active .date-number {
  color: #2F6F0E;
  font-weight: 800;
}

/* 训练部位绿色小胶囊徽章 */
.badge-wrap {
  margin-top: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.body-badge {
  background: #67C23A;
  color: #FFFFFF;
  font-size: 19rpx;
  font-weight: 800;
  padding: 2rpx 10rpx;
  border-radius: 8rpx;
  line-height: 1.25;
  box-shadow: 0 2rpx 6rpx rgba(103, 194, 58, 0.35);
}

.badge-placeholder {
  height: 28rpx;
  margin-top: 6rpx;
}
</style>
