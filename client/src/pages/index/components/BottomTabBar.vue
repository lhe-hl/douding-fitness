<template>
  <view class="bottom-tabbar-placeholder">
    <view class="bottom-tabbar">
      <!-- 1. 首页 -->
      <view class="tab-item" :class="{ 'tab-item-active': activeTab === 'home' }" @tap="switchTab('home')">
        <view class="icon-wrap">
          <image
            class="tab-icon"
            :src="activeTab === 'home' ? '/static/tabbar/home-active.svg' : '/static/tabbar/home.svg'"
            mode="aspectFit"
          />
        </view>
        <text class="tab-label" :class="{ 'active-label': activeTab === 'home' }">首页</text>
      </view>

      <!-- 2. 健身 -->
      <view class="tab-item" :class="{ 'tab-item-active': activeTab === 'workout' }" @tap="switchTab('workout')">
        <view class="icon-wrap">
          <image
            class="tab-icon"
            :src="activeTab === 'workout' ? '/static/tabbar/workout-active.svg' : '/static/tabbar/workout.svg'"
            mode="aspectFit"
          />
        </view>
        <text class="tab-label" :class="{ 'active-label': activeTab === 'workout' }">健身</text>
      </view>

      <!-- 3. 饮食 -->
      <view class="tab-item" :class="{ 'tab-item-active': activeTab === 'diet' }" @tap="switchTab('diet')">
        <view class="icon-wrap">
          <image
            class="tab-icon"
            :src="activeTab === 'diet' ? '/static/tabbar/diet-active.svg' : '/static/tabbar/diet.svg'"
            mode="aspectFit"
          />
        </view>
        <text class="tab-label" :class="{ 'active-label': activeTab === 'diet' }">饮食</text>
      </view>

      <!-- 4. AI -->
      <view class="tab-item" :class="{ 'tab-item-active': activeTab === 'ai' }" @tap="switchTab('ai')">
        <view class="icon-wrap">
          <image
            class="tab-icon"
            :src="activeTab === 'ai' ? '/static/tabbar/ai-active.svg' : '/static/tabbar/ai.svg'"
            mode="aspectFit"
          />
        </view>
        <text class="tab-label" :class="{ 'active-label': activeTab === 'ai' }">AI</text>
      </view>

      <!-- 5. 我的 -->
      <view class="tab-item" :class="{ 'tab-item-active': activeTab === 'profile' }" @tap="switchTab('profile')">
        <view class="icon-wrap">
          <image
            class="tab-icon"
            :src="activeTab === 'profile' ? '/static/tabbar/profile-active.svg' : '/static/tabbar/profile.svg'"
            mode="aspectFit"
          />
        </view>
        <text class="tab-label" :class="{ 'active-label': activeTab === 'profile' }">我的</text>
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
  background: rgba(255, 255, 255, 0.98);
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

.tab-icon {
  width: 44rpx;
  height: 44rpx;
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
