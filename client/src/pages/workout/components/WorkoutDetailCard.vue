<template>
  <view class="detail-card">
    <!-- 当天有打卡记录时的 3 列展示 -->
    <view v-if="detail && detail.status === 'COMPLETED'" class="metrics-row">
      <!-- 1. 运动时间 -->
      <view class="metric-col">
        <text class="col-label">运动时间</text>
        <view class="value-wrap">
          <text class="time-number">{{ detail.durationMinutes }}</text>
          <text class="time-unit">min</text>
        </view>
      </view>

      <!-- 2. 训练内容 -->
      <view class="metric-col content-col">
        <text class="col-label">训练内容</text>
        <text class="body-title">{{ detail.bodyPartsTitle }}</text>
      </view>

      <!-- 3. 训练状态 -->
      <view class="metric-col status-col">
        <text class="col-label">训练状态</text>
        <view class="status-badge">
          <text class="status-text">已完成</text>
        </view>
      </view>
    </view>

    <!-- 当天无打卡记录时的休息态展示 -->
    <view v-else class="empty-row" @tap="handleEmptyClick">
      <view class="empty-left">
        <text class="empty-icon">☕</text>
        <view class="empty-text-wrap">
          <text class="empty-title">今日休息充碳日</text>
          <text class="empty-sub">充分休息有利于肌肉合成增长</text>
        </view>
      </view>
      <view class="quick-record-btn">
        <text class="btn-text">补记打卡</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { DayWorkoutDetail } from '../types'

interface Props {
  detail?: DayWorkoutDetail | null
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'click-record'): void
}>()

const handleEmptyClick = () => {
  emit('click-record')
}
</script>

<style scoped>
.detail-card {
  background: #FFFFFF;
  border-radius: 36rpx;
  padding: 32rpx 36rpx;
  margin-top: 24rpx;
  box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.035);
}

/* 3 列指标横向排版 */
.metrics-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.metric-col {
  display: flex;
  flex-direction: column;
}

.col-label {
  font-size: 24rpx;
  color: #8E8E93;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.value-wrap {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.time-number {
  font-size: 40rpx;
  font-weight: 800;
  color: #111111;
  letter-spacing: -0.5rpx;
  line-height: 1;
}

.time-unit {
  font-size: 24rpx;
  font-weight: 700;
  color: #111111;
  margin-left: 6rpx;
}

.content-col {
  flex: 1;
  padding: 0 24rpx;
}

.body-title {
  font-size: 32rpx;
  font-weight: 800;
  color: #111111;
  line-height: 1.2;
}

.status-col {
  align-items: flex-end;
}

.status-badge {
  background: #67C23A;
  padding: 6rpx 20rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 10rpx rgba(103, 194, 58, 0.35);
}

.status-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
}

/* 休息日空状态展示 */
.empty-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.empty-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20rpx;
}

.empty-icon {
  font-size: 44rpx;
}

.empty-text-wrap {
  display: flex;
  flex-direction: column;
}

.empty-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #333333;
}

.empty-sub {
  font-size: 22rpx;
  color: #A0A5AB;
  margin-top: 4rpx;
}

.quick-record-btn {
  background: #F4F6F9;
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
}

.btn-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #67C23A;
}
</style>
