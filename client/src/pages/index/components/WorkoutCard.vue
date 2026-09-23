<template>
  <view class="workout-card" @tap="handleCardClick">
    <!-- 标题行 -->
    <view class="card-header">
      <text class="title">本周已练 <text class="highlight">{{ weekCount }}</text> 次</text>
      <view class="header-link">
        <text class="link-text">运动能量</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 中间图表区：7天柱状图 + 运动能量环 -->
    <view class="chart-content">
      <!-- 7天打卡柱状图 -->
      <view class="days-column-group">
        <view
          v-for="(item, index) in days"
          :key="index"
          class="day-col"
        >
          <!-- 柱子槽 -->
          <view class="bar-track">
            <!-- 激活高亮柱段 -->
            <view
              v-if="item.completed"
              class="bar-fill"
              :style="{ height: item.percent + '%' }"
            ></view>
          </view>
          <!-- 日期文字 -->
          <text
            class="day-label"
            :class="{ 'day-label-active': item.completed }"
          >{{ item.dayLabel }}</text>
        </view>
      </view>

      <!-- 右侧运动能量发光环 -->
      <view class="energy-ring-wrapper">
        <view class="energy-glow-ring">
          <view class="ring-center">
            <text class="ring-title">运动</text>
            <text class="ring-sub">能量</text>
          </view>
        </view>
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
  energyPercent?: number
  tags?: string[]
}

withDefaults(defineProps<Props>(), {
  weekCount: 4,
  days: () => [
    { dayLabel: '周', completed: true, percent: 55 },
    { dayLabel: '周', completed: true, percent: 75 },
    { dayLabel: '期', completed: true, percent: 90 },
    { dayLabel: '周', completed: true, percent: 65 },
    { dayLabel: '五', completed: true, percent: 85 },
    { dayLabel: '六', completed: false, percent: 0 },
    { dayLabel: '日', completed: false, percent: 0 },
  ],
  energyPercent: 82,
  tags: () => ['胸肩塑形', '有氧燃脂', '有氧燃脂'],
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
.chart-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 36rpx;
  padding: 0 10rpx;
}

.days-column-group {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 18rpx;
}

.day-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar-track {
  position: relative;
  width: 22rpx;
  height: 130rpx;
  background: #EEF2F6;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #8EE446 0%, #70C536 100%);
  border-radius: 20rpx;
  transition: height 0.5s ease-out;
}

.day-label {
  font-size: 22rpx;
  color: #A0A5AB;
  font-weight: 600;
  margin-top: 14rpx;
}

.day-label-active {
  color: #555A60;
}

/* 右侧发光能量环 */
.energy-ring-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 12rpx;
}

.energy-glow-ring {
  width: 154rpx;
  height: 154rpx;
  border-radius: 50%;
  background: conic-gradient(
    #8FE342 0deg,
    #B2F266 220deg,
    #70C635 300deg,
    #E8F6DC 300deg 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24rpx rgba(143, 227, 66, 0.45);
}

.ring-center {
  width: 114rpx;
  height: 114rpx;
  border-radius: 50%;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ring-title {
  font-size: 24rpx;
  font-weight: 800;
  color: #1A1A1A;
  line-height: 1.2;
}

.ring-sub {
  font-size: 24rpx;
  font-weight: 800;
  color: #1A1A1A;
  line-height: 1.2;
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
