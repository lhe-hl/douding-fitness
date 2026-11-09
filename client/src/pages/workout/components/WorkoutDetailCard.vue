<template>
  <view class="detail-card">
    <view v-if="phase === 'loading'" class="state-block">
      <text class="state-title">正在读取这一天</text>
    </view>

    <view v-else-if="phase === 'error'" class="state-row">
      <view class="state-copy">
        <text class="state-title">这次没读到训练</text>
        <text class="state-sub">休息日不会显示成这样</text>
      </view>
      <view class="quick-record-btn" @tap="emit('retry')">
        <text class="btn-text">重试</text>
      </view>
    </view>

    <view v-else-if="phase === 'ready' && detail" class="record-block">
      <view class="metrics-row">
        <view class="metric-col">
          <text class="col-label">运动时间</text>
          <view class="value-wrap">
            <text class="time-number">{{ detail.durationMinutes }}</text>
            <text class="time-unit">min</text>
          </view>
        </view>

        <view class="metric-col content-col">
          <text class="col-label">训练内容</text>
          <text class="body-title">{{ detail.bodyPartsTitle }}</text>
        </view>

        <view class="metric-col status-col">
          <text class="col-label">训练状态</text>
          <view class="status-badge">
            <text class="status-text">已完成</text>
          </view>
        </view>
      </view>

      <view v-if="detail.notes" class="notes-block">
        <text class="notes-label">今日感受</text>
        <text class="notes-text">{{ detail.notes }}</text>
      </view>

      <view class="delete-btn" @tap="emit('delete')">
        <text class="delete-text">{{ deleting ? '删除中' : '删除这条记录' }}</text>
      </view>
    </view>

    <view v-else class="empty-row" @tap="emit('record')">
      <view class="empty-left">
        <text class="empty-icon">☕</text>
        <view class="empty-text-wrap">
          <text class="empty-title">今日休息充碳日</text>
          <text class="empty-sub">充分休息有利于肌肉合成增长</text>
        </view>
      </view>
      <view class="quick-record-btn">
        <text class="btn-text btn-text-rest">补记打卡</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { DayWorkoutDetail, WorkoutDetailPhase } from '../types'

interface Props {
  phase: WorkoutDetailPhase
  detail?: DayWorkoutDetail | null
  deleting?: boolean
}

withDefaults(defineProps<Props>(), {
  detail: null,
  deleting: false,
})

const emit = defineEmits<{
  (e: 'record'): void
  (e: 'retry'): void
  (e: 'delete'): void
}>()
</script>

<style scoped>
.detail-card {
  background: #FFFFFF;
  border-radius: 36rpx;
  padding: 32rpx 36rpx;
  margin-top: 24rpx;
  box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.035);
}

.state-block,
.state-row,
.empty-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.state-copy,
.empty-text-wrap {
  display: flex;
  flex-direction: column;
}

.state-title,
.empty-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #333333;
}

.state-sub,
.empty-sub {
  font-size: 22rpx;
  color: #A0A5AB;
  margin-top: 4rpx;
}

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

.notes-block {
  margin-top: 28rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #EEF2F6;
}

.notes-label {
  font-size: 24rpx;
  color: #8E8E93;
  display: block;
}

.notes-text {
  display: block;
  margin-top: 8rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  line-height: 1.45;
}

.delete-btn {
  margin-top: 24rpx;
}

.delete-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #E05A4A;
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

.quick-record-btn {
  background: #F4F6F9;
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
}

.btn-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #74C043;
}

.btn-text-rest {
  color: #67C23A;
}
</style>
