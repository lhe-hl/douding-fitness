<template>
  <view class="bottom-tabbar-placeholder">
    <view class="bottom-tabbar">
      <!-- 1. 首页 (选中状态) -->
      <view class="tab-item" :class="{ 'tab-item-active': activeTab === 'home' }" @tap="switchTab('home')">
        <view class="icon-wrap">
          <svg viewBox="0 0 24 24" width="24" height="24" class="tab-svg">
            <path
              fill="#74C043"
              d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"
            />
          </svg>
        </view>
        <text class="tab-label active-label">首页</text>
      </view>

      <!-- 2. 健身 -->
      <view class="tab-item" :class="{ 'tab-item-active': activeTab === 'workout' }" @tap="switchTab('workout')">
        <view class="icon-wrap">
          <svg viewBox="0 0 24 24" width="24" height="24" class="tab-svg">
            <path
              fill="#8E8E93"
              d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"
            />
          </svg>
        </view>
        <text class="tab-label">健身</text>
      </view>

      <!-- 3. 饮食 -->
      <view class="tab-item" :class="{ 'tab-item-active': activeTab === 'diet' }" @tap="switchTab('diet')">
        <view class="icon-wrap">
          <svg viewBox="0 0 24 24" width="24" height="24" class="tab-svg">
            <path
              fill="#8E8E93"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
            />
          </svg>
        </view>
        <text class="tab-label">饮食</text>
      </view>

      <!-- 4. AI -->
      <view class="tab-item" :class="{ 'tab-item-active': activeTab === 'ai' }" @tap="switchTab('ai')">
        <view class="icon-wrap">
          <svg viewBox="0 0 24 24" width="24" height="24" class="tab-svg">
            <path
              fill="#8E8E93"
              d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h1a6 6 0 0 1 6 6v1h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h1v-1a6 6 0 0 1 6-6h1V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2m-3 9a1.5 1.5 0 0 0-1.5 1.5A1.5 1.5 0 0 0 9 14a1.5 1.5 0 0 0 1.5-1.5A1.5 1.5 0 0 0 9 11m6 0a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5 1.5 1.5 0 0 0-1.5-1.5M9.5 17a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z"
            />
          </svg>
        </view>
        <text class="tab-label">AI</text>
      </view>

      <!-- 5. 我的 -->
      <view class="tab-item" :class="{ 'tab-item-active': activeTab === 'profile' }" @tap="switchTab('profile')">
        <view class="icon-wrap">
          <svg viewBox="0 0 24 24" width="24" height="24" class="tab-svg">
            <path
              fill="#8E8E93"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </view>
        <text class="tab-label">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('home')

const switchTab = (tab: string) => {
  activeTab.value = tab
  if (tab !== 'home') {
    uni.showToast({
      title: `${tab === 'workout' ? '健身记录' : tab === 'diet' ? '饮食记录' : tab === 'ai' ? 'AI 助手' : '个人中心'}模块即将开放`,
      icon: 'none',
    })
  }
}
</script>

<style scoped>
.bottom-tabbar-placeholder {
  height: 140rpx;
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.icon-wrap {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-svg {
  display: block;
}

.tab-label {
  font-size: 20rpx;
  color: #8E8E93;
  font-weight: 600;
  margin-top: 4rpx;
}

.active-label {
  color: #74C043;
}
</style>
