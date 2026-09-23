<template>
  <view class="ai-coach-card" @tap="handleCardClick">
    <!-- 标题行 -->
    <view class="card-header">
      <text class="title">AI 教练</text>
      <text class="arrow">›</text>
    </view>

    <!-- 中部内容：AI小机器人 + 气泡 -->
    <view class="ai-content-row">
      <!-- 3D 萌趣 AI 机器人头像挂件 -->
      <view class="robot-avatar-box">
        <view class="robot-head">
          <view class="robot-antennae"></view>
          <view class="robot-face">
            <view class="robot-eye eye-left"></view>
            <view class="robot-eye eye-right"></view>
            <view class="robot-smile"></view>
          </view>
          <view class="robot-ear ear-left"></view>
          <view class="robot-ear ear-right"></view>
        </view>
        <view class="robot-badge">AI</view>
      </view>

      <!-- 建议气泡框 -->
      <view class="speech-bubble">
        <view class="bubble-arrow"></view>
        <text class="bubble-text">{{ message }}</text>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="action-row">
      <view class="ask-btn" @tap.stop="handleAskClick">
        <text class="ask-text">咨询 AI 教练</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: '今日热量缺口合理！晚餐建议适量增加蛋白质',
})

const emit = defineEmits<{
  (e: 'click-detail'): void
  (e: 'ask-coach'): void
}>()

const handleCardClick = () => {
  emit('click-detail')
}

const handleAskClick = () => {
  uni.showToast({
    title: '正在唤起 AI 专属教练...',
    icon: 'none',
  })
  emit('ask-coach')
}
</script>

<style scoped>
.ai-coach-card {
  background: linear-gradient(135deg, #E6FBF5 0%, #D4F6ED 100%);
  border-radius: 36rpx;
  padding: 36rpx 32rpx;
  margin-top: 24rpx;
  box-shadow: 0 8rpx 28rpx rgba(116, 192, 67, 0.08);
  border: 2rpx solid rgba(116, 192, 67, 0.18);
  position: relative;
  overflow: hidden;
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

.arrow {
  font-size: 36rpx;
  color: #8E8E93;
}

/* AI 机器人与对话气泡 */
.ai-content-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 24rpx;
}

/* 纯 CSS 绘制精致发光小机器人 */
.robot-avatar-box {
  position: relative;
  width: 104rpx;
  height: 104rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.robot-head {
  width: 88rpx;
  height: 72rpx;
  background: #FFFFFF;
  border-radius: 26rpx;
  box-shadow: 0 8rpx 20rpx rgba(82, 196, 160, 0.35);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #6ED5B8;
}

.robot-antennae {
  position: absolute;
  top: -14rpx;
  width: 8rpx;
  height: 12rpx;
  background: #6ED5B8;
  border-radius: 4rpx;
}

.robot-antennae::after {
  content: '';
  position: absolute;
  top: -8rpx;
  left: -4rpx;
  width: 16rpx;
  height: 16rpx;
  background: #70C536;
  border-radius: 50%;
  box-shadow: 0 0 10rpx #70C536;
}

.robot-face {
  width: 58rpx;
  height: 38rpx;
  background: #203A34;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 6rpx;
  box-sizing: border-box;
}

.robot-eye {
  width: 10rpx;
  height: 14rpx;
  background: #64E7C4;
  border-radius: 50%;
  box-shadow: 0 0 8rpx #64E7C4;
}

.robot-ear {
  position: absolute;
  top: 20rpx;
  width: 10rpx;
  height: 24rpx;
  background: #70C536;
  border-radius: 6rpx;
}

.ear-left {
  left: -8rpx;
}

.ear-right {
  right: -8rpx;
}

.robot-badge {
  position: absolute;
  bottom: 0rpx;
  background: #70C536;
  color: #FFFFFF;
  font-size: 16rpx;
  font-weight: 800;
  padding: 2rpx 10rpx;
  border-radius: 10rpx;
  border: 2rpx solid #FFFFFF;
}

/* 对话气泡 */
.speech-bubble {
  position: relative;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
  margin-left: 24rpx;
  flex: 1;
  box-shadow: 0 4rpx 18rpx rgba(0, 0, 0, 0.04);
}

.bubble-arrow {
  position: absolute;
  top: 36rpx;
  left: -12rpx;
  width: 0;
  height: 0;
  border-top: 10rpx solid transparent;
  border-bottom: 10rpx solid transparent;
  border-right: 14rpx solid #FFFFFF;
}

.bubble-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #111111;
  line-height: 1.45;
}

/* 底部操作行 */
.action-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 24rpx;
}

.ask-btn {
  background: #111111;
  padding: 16rpx 36rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
  transition: transform 0.15s ease;
}

.ask-btn:active {
  transform: scale(0.96);
}

.ask-text {
  color: #FFFFFF;
  font-size: 26rpx;
  font-weight: 700;
  letter-spacing: 0.5rpx;
}
</style>
