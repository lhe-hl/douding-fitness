<template>
  <view class="home-header">
    <!-- 左侧：头像与问候语 -->
    <view class="user-info" @tap="handleUserClick">
      <view class="avatar-wrap">
        <image
          class="avatar-img"
          src="https://api.dicebear.com/7.x/bottts/svg?seed=douding"
          mode="aspectFill"
        />
        <view class="online-dot"></view>
      </view>
      <view class="text-group">
        <text class="greeting-text">{{ greeting }}</text>
        <text class="date-text">{{ dateStr }}</text>
      </view>
    </view>

    <!-- 右侧：连续打卡徽章 -->
    <view class="streak-badge" @tap="handleStreakClick">
      <text class="fire-icon">🔥</text>
      <text class="streak-text">连续打卡{{ streakDays }}天</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  avatarUrl?: string
  greeting?: string
  dateStr?: string
  streakDays?: number
}

withDefaults(defineProps<Props>(), {
  avatarUrl: '',
  greeting: '早上好',
  dateStr: '9月23日 星期三',
  streakDays: 5,
})

const emit = defineEmits<{
  (e: 'click-user'): void
  (e: 'click-streak'): void
}>()

const handleUserClick = () => {
  emit('click-user')
}

const handleStreakClick = () => {
  uni.showToast({
    title: `已连续自律打卡 5 天，继续保持！`,
    icon: 'none',
  })
  emit('click-streak')
}
</script>

<style scoped>
.home-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 4rpx;
}

.user-info {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.avatar-wrap {
  position: relative;
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #E8EEF5;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.06);
  border: 4rpx solid #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.online-dot {
  position: absolute;
  bottom: 2rpx;
  right: 2rpx;
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background: #74C043;
  border: 3rpx solid #FFFFFF;
}

.text-group {
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
}

.greeting-text {
  font-size: 42rpx;
  font-weight: 800;
  color: #111111;
  letter-spacing: -0.5rpx;
  line-height: 1.2;
}

.date-text {
  font-size: 26rpx;
  color: #8E8E93;
  font-weight: 500;
  margin-top: 6rpx;
}

.streak-badge {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: linear-gradient(135deg, #FF7B00 0%, #FF5500 100%);
  padding: 14rpx 28rpx;
  border-radius: 40rpx;
  box-shadow: 0 6rpx 18rpx rgba(255, 90, 0, 0.25);
  transition: transform 0.15s ease;
}

.streak-badge:active {
  transform: scale(0.96);
}

.fire-icon {
  font-size: 26rpx;
  margin-right: 8rpx;
}

.streak-text {
  font-size: 26rpx;
  color: #FFFFFF;
  font-weight: 700;
  letter-spacing: 0.5rpx;
}
</style>
