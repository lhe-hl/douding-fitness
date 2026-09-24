<template>
  <view class="bottom-tabbar-placeholder">
    <view class="bottom-tabbar">
      <!-- 1. 首页 -->
      <view
        class="tab-item"
        :class="{ 'tab-item-active': current === 'home' }"
        @tap="handleTabClick('home')"
      >
        <view class="icon-wrap">
          <image
            class="tab-icon"
            :src="current === 'home' ? '/static/tabbar/home-active.svg' : '/static/tabbar/home.svg'"
            mode="aspectFit"
          />
        </view>
        <text class="tab-label" :class="{ 'active-label': current === 'home' }">首页</text>
      </view>

      <!-- 2. 健身 -->
      <view
        class="tab-item"
        :class="{ 'tab-item-active': current === 'workout' }"
        @tap="handleTabClick('workout')"
      >
        <view class="icon-wrap">
          <image
            class="tab-icon"
            :src="current === 'workout' ? '/static/tabbar/workout-active.svg' : '/static/tabbar/workout.svg'"
            mode="aspectFit"
          />
        </view>
        <text class="tab-label" :class="{ 'active-label': current === 'workout' }">健身</text>
      </view>

      <!-- 3. 饮食 -->
      <view
        class="tab-item"
        :class="{ 'tab-item-active': current === 'diet' }"
        @tap="handleTabClick('diet')"
      >
        <view class="icon-wrap">
          <image
            class="tab-icon"
            :src="current === 'diet' ? '/static/tabbar/diet-active.svg' : '/static/tabbar/diet.svg'"
            mode="aspectFit"
          />
        </view>
        <text class="tab-label" :class="{ 'active-label': current === 'diet' }">饮食</text>
      </view>

      <!-- 4. AI -->
      <view
        class="tab-item"
        :class="{ 'tab-item-active': current === 'ai' }"
        @tap="handleTabClick('ai')"
      >
        <view class="icon-wrap">
          <image
            class="tab-icon"
            :src="current === 'ai' ? '/static/tabbar/ai-active.svg' : '/static/tabbar/ai.svg'"
            mode="aspectFit"
          />
        </view>
        <text class="tab-label" :class="{ 'active-label': current === 'ai' }">AI</text>
      </view>

      <!-- 5. 我的 -->
      <view
        class="tab-item"
        :class="{ 'tab-item-active': current === 'profile' }"
        @tap="handleTabClick('profile')"
      >
        <view class="icon-wrap">
          <image
            class="tab-icon"
            :src="current === 'profile' ? '/static/tabbar/profile-active.svg' : '/static/tabbar/profile.svg'"
            mode="aspectFit"
          />
        </view>
        <text class="tab-label" :class="{ 'active-label': current === 'profile' }">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
export type TabKey = 'home' | 'workout' | 'diet' | 'ai' | 'profile'

interface Props {
  current?: TabKey
}

const props = withDefaults(defineProps<Props>(), {
  current: 'home',
})

const tabList: { key: TabKey; path: string }[] = [
  { key: 'home', path: '/pages/index/index' },
  { key: 'workout', path: '/pages/workout/index' },
  { key: 'diet', path: '/pages/diet/index' },
  { key: 'ai', path: '/pages/ai-coach/index' },
  { key: 'profile', path: '/pages/profile/index' },
]

const handleTabClick = (key: TabKey) => {
  // 点击当前已激活的 Tab 时不重复跳转
  if (key === props.current) return

  const target = tabList.find((item) => item.key === key)
  if (!target) return

  // 优先使用 switchTab 进行 Tab 页面切换，同时设置 fail 兜底
  uni.switchTab({
    url: target.path,
    fail: () => {
      uni.reLaunch({
        url: target.path,
      })
    },
  })
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
  transition: transform 0.1s ease;
}

.tab-item:active {
  transform: scale(0.92);
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
