<template>
  <view class="workout-card" @tap="handleCardClick">
    <!-- 标题行 -->
    <view class="card-header">
      <text class="title">本周已练 <text class="highlight">{{ weekCount }}</text> 次</text>
      <view class="header-link">
        <text class="link-text">详细计划</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 7天圆形打卡状态 -->
    <view class="days-circle-group">
      <view
        v-for="(item, index) in days"
        :key="index"
        class="day-col"
      >
        <!-- 训练部位标签（仅已完成的天显示） -->
        <text
          v-if="item.completed && item.bodyPart"
          class="body-part-label"
        >{{ item.bodyPart }}</text>
        <view v-else class="body-part-placeholder"></view>

        <!-- 圆形打卡状态圈 -->
        <view
          class="circle-badge"
          :class="{ 'circle-badge-active': item.completed }"
        >
          <text v-if="item.completed" class="check-icon">✓</text>
          <view v-else class="circle-dot"></view>
        </view>

        <!-- 日期文字 -->
        <text
          class="day-label"
          :class="{ 'day-label-active': item.completed }"
        >{{ item.dayLabel }}</text>
      </view>
    </view>

    <!-- 底部肌群训练标签 -->
    <view class="tags-group">
      <view
        v-for="(tag, idx) in tags"
        :key="idx"
        class="tag-item"
      >
        <text class="tag-text">{{ tag }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { DayStatus } from '../types'

interface Props {
  weekCount?: number
  days?: DayStatus[]
  tags?: string[]
}

withDefaults(defineProps<Props>(), {
  weekCount: 4,
  days: () => [
    { dayLabel: '一', completed: true, percent: 100, bodyPart: '胸' },
    { dayLabel: '二', completed: true, percent: 100, bodyPart: '背' },
    { dayLabel: '三', completed: true, percent: 100, bodyPart: '腿' },
    { dayLabel: '四', completed: true, percent: 100, bodyPart: '肩' },
    { dayLabel: '五', completed: false, percent: 0 },
    { dayLabel: '六', completed: false, percent: 0 },
    { dayLabel: '日', completed: false, percent: 0 },
  ],
  tags: () => ['胸肩塑形', '有氧燃脂'],
})

const emit = defineEmits<{
  (e: 'click-detail'): void
}>()

const handleCardClick = () => {
  emit('click-detail')
}
</script>

<style scoped>
.workout-card {
  background: #FFFFFF;
  border-radius: 36rpx;
  padding: 36rpx 32rpx;
  margin-top: 24rpx;
  box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.035);
  transition: transform 0.15s ease;
}

.workout-card:active {
  transform: scale(0.995);
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

/* 图表区 */
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

/* 训练部位标签 */
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
  transition: all 0.25s ease;
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

/* 底部标签 */
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
</style>
