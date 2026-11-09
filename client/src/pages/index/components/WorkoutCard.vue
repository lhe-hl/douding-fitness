<template>
  <view class="workout-card" @tap="emit('click-detail')">
    <view class="card-header">
      <text v-if="status === 'loading'" class="title">正在读取本周训练</text>
      <text v-else-if="status === 'error'" class="title">无法读取训练记录</text>
      <text v-else class="title">本周已练 <text class="highlight">{{ weekCount }}</text> 次</text>
      <view class="header-link">
        <text class="link-text">详细计划</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view v-if="status === 'error'">
      <text class="error-sub">重新打开首页，或点下面重试</text>
      <view class="retry-btn" @tap.stop="emit('retry')">
        <text class="retry-btn-text">重试</text>
      </view>
    </view>

    <template v-else>
      <view class="days-circle-group">
        <view
          v-for="(item, index) in displayDays"
          :key="item.date || item.dayLabel + index"
          class="day-col"
        >
          <text v-if="item.completed && item.bodyPartBadge" class="body-part-label">{{ item.bodyPartBadge }}</text>
          <view v-else class="body-part-placeholder"></view>

          <view class="circle-badge" :class="{ 'circle-badge-active': item.completed }">
            <text v-if="item.completed" class="check-icon">✓</text>
            <view v-else class="circle-dot"></view>
          </view>

          <text class="day-label" :class="labelClass(item)">{{ item.dayLabel }}</text>
        </view>
      </view>

      <view v-if="showToday" class="today-block">
        <text class="today-flag">今天</text>
        <text class="today-title">{{ today?.bodyPartsTitle }}</text>
        <text class="today-duration">{{ today?.durationMinutes }} 分钟</text>
        <text v-if="today?.notes" class="today-notes">{{ today?.notes }}</text>
      </view>

      <view v-if="showTags" class="tags-group">
        <view v-for="(tag, idx) in today?.tags" :key="idx" class="tag-item">
          <text class="tag-text">{{ tag }}</text>
        </view>
      </view>

      <view v-if="status === 'stale'" class="stale-row">
        <text class="stale-text">刷新失败，仍是上次读到的记录</text>
        <text class="stale-retry" @tap.stop="emit('retry')">重试</text>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HomeTodayEcho, HomeWeekDay, HomeWorkoutStatus } from '../types'

const props = withDefaults(defineProps<{
  status: HomeWorkoutStatus
  weekCount?: number
  days?: HomeWeekDay[]
  today?: HomeTodayEcho | null
}>(), {
  weekCount: 0,
  days: () => [],
  today: null,
})

const emit = defineEmits<{
  (e: 'click-detail'): void
  (e: 'retry'): void
}>()

const WEEK_LABELS = ['一', '二', '三', '四', '五', '六', '日']

const displayDays = computed(() => {
  if (props.status !== 'loading') return props.days
  const todayIndex = (new Date().getDay() + 6) % 7
  return WEEK_LABELS.map((dayLabel, index) => ({
    dayLabel,
    date: '',
    completed: false,
    bodyPartBadge: '',
    isToday: index === todayIndex,
  }))
})

const showToday = computed(() => props.status !== 'loading' && props.status !== 'error' && !!props.today)
const showTags = computed(() => showToday.value && !!props.today && props.today.tags.length > 0)

const labelClass = (item: { completed: boolean; isToday: boolean }) => {
  if (item.isToday) return 'day-label-today'
  if (item.completed) return 'day-label-active'
  return ''
}
</script>

<style scoped>
.workout-card {
  background: #FFFFFF;
  border-radius: 36rpx;
  padding: 36rpx 32rpx;
  margin-top: 24rpx;
  box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.035);
}

.card-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 38rpx;
  font-weight: 800;
  color: #111111;
  letter-spacing: -0.5rpx;
}

.highlight {
  color: #111111;
  font-size: 44rpx;
  margin: 0 4rpx;
}

.header-link {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.link-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #222222;
}

.arrow {
  font-size: 36rpx;
  color: #8E8E93;
  margin-left: 6rpx;
  line-height: 1;
}

.error-sub {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #8E8E93;
}

.retry-btn {
  margin-top: 28rpx;
  height: 72rpx;
  padding: 0 40rpx;
  border-radius: 36rpx;
  background: #74C043;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.retry-btn-text {
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 800;
}

.days-circle-group {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
  margin-top: 28rpx;
  padding: 0 4rpx;
}

.day-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.body-part-label {
  font-size: 20rpx;
  font-weight: 700;
  color: #67C23A;
  margin-bottom: 10rpx;
  line-height: 1;
}

.body-part-placeholder {
  height: 20rpx;
  margin-bottom: 10rpx;
}

.circle-badge {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: #EEF2F6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-badge-active {
  background: linear-gradient(135deg, #8EE446 0%, #67C23A 100%);
  box-shadow: 0 4rpx 14rpx rgba(116, 192, 67, 0.45);
}

.check-icon {
  color: #FFFFFF;
  font-size: 24rpx;
  font-weight: 900;
  line-height: 1;
}

.circle-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #CBD3DC;
}

.day-label {
  font-size: 22rpx;
  color: #A0A5AB;
  font-weight: 600;
  margin-top: 12rpx;
}

.day-label-active {
  color: #1A1A1A;
  font-weight: 700;
}

.day-label-today {
  color: #111111;
  font-weight: 700;
}

.today-block {
  margin-top: 28rpx;
}

.today-flag {
  display: block;
  font-size: 22rpx;
  font-weight: 700;
  color: #67C23A;
}

.today-title {
  display: block;
  margin-top: 8rpx;
  font-size: 32rpx;
  font-weight: 800;
  color: #111111;
  line-height: 1.3;
}

.today-duration {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: #333333;
}

.today-notes {
  display: -webkit-box;
  margin-top: 8rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #4A515A;
  line-height: 1.4;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.tags-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 32rpx;
}

.tag-item {
  background: #F4F6F9;
  padding: 10rpx 28rpx;
  border-radius: 30rpx;
}

.tag-text {
  font-size: 24rpx;
  color: #4A515A;
  font-weight: 600;
}

.stale-row {
  margin-top: 20rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.stale-text {
  font-size: 22rpx;
  color: #A0A5AB;
}

.stale-retry {
  font-size: 24rpx;
  font-weight: 700;
  color: #74C043;
}
</style>
