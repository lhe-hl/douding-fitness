<template>
  <view class="page-container">
    <view class="status-bar-placeholder"></view>
    <scroll-view scroll-y class="scroll-content">
      <view class="content-box">
        <text class="page-title">饮食记录</text>
        <text class="page-subtitle">记录早中晚餐与热量摄入</text>
        <view class="card-placeholder">
          <text class="icon">🥗</text>
          <text class="tip">餐食打卡与卡路里计算模块即将上线</text>
        </view>
      </view>
    </scroll-view>
    <!-- 底部导航栏 -->
    <BottomTabBar current="diet" />
  </view>
</template>

<script setup lang="ts">
import BottomTabBar from '../../components/BottomTabBar.vue'
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #F7F8FA;
  display: flex;
  flex-direction: column;
}

.status-bar-placeholder {
  height: env(safe-area-inset-top);
  min-height: 48rpx;
}

.scroll-content {
  flex: 1;
  padding: 30rpx 32rpx;
  box-sizing: border-box;
}

.page-title {
  font-size: 44rpx;
  font-weight: 800;
  color: #111111;
  display: block;
}

.page-subtitle {
  font-size: 26rpx;
  color: #8E8E93;
  margin-top: 8rpx;
  display: block;
}

.card-placeholder {
  background: #FFFFFF;
  border-radius: 36rpx;
  padding: 80rpx 40rpx;
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.035);
}

.icon {
  font-size: 72rpx;
  margin-bottom: 20rpx;
}

.tip {
  font-size: 28rpx;
  color: #555555;
  font-weight: 600;
}
</style>
