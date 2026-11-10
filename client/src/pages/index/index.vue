<template>
  <view class="page-container">
    <!-- 顶栏：占满安全区并让出右上角胶囊，避免盖住问候和打卡 -->
    <view class="home-top-strip">
      <view class="strip-safe"></view>
      <view class="strip-band">
        <view class="brand-mark">
          <text class="brand-mark-text">豆</text>
        </view>
        <view class="brand-copy">
          <text class="brand-name">豆丁健身</text>
          <view class="brand-meta">
            <view class="brand-rule"></view>
            <text class="brand-hint">动一动，吃明白</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 滚动区域 -->
    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <view class="inner-padding">
        <!-- 1. 顶部用户状态栏 -->
        <HomeHeader
          :greeting="'早上好'"
          :date-str="'9月23日 星期三'"
          :streak-days="5"
          @click-user="onUserClick"
          @click-streak="onStreakClick"
        />

        <!-- 2. 本周健身与打卡卡片 -->
        <WorkoutCard
          :status="workoutStatus"
          :week-count="weekCount"
          :days="weekDays"
          :today="todayEcho"
          @click-detail="onWorkoutDetail"
          @retry="refreshWorkout"
        />

        <!-- 3. 饮食和热量卡片 -->
        <DietCard
          :current-calories="1450"
          :target-calories="1800"
          :deficit-text="'热量缺口状态'"
          @click-detail="onDietDetail"
          @quick-add="onQuickAddMeal"
        />

        <!-- 4. AI 教练卡片 -->
        <AiCoachCard
          :message="'今日热量缺口合理！晚餐建议适量增加蛋白质'"
          @click-detail="onAiCoachDetail"
          @ask-coach="onAskCoach"
        />

        <!-- 底部空间 -->
        <view class="bottom-spacer"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import HomeHeader from './components/HomeHeader.vue'
import WorkoutCard from './components/WorkoutCard.vue'
import DietCard from './components/DietCard.vue'
import AiCoachCard from './components/AiCoachCard.vue'
import { useHomeWorkout } from './useHomeWorkout'

const {
  status: workoutStatus,
  weekCount,
  days: weekDays,
  today: todayEcho,
  refresh: refreshWorkout,
} = useHomeWorkout()

onShow(() => {
  void refreshWorkout()
})

const onUserClick = () => {
  uni.switchTab({
    url: '/pages/profile/index',
  })
}

const onStreakClick = () => {
  // 打卡徽章点击
}

const onWorkoutDetail = () => {
  uni.switchTab({
    url: '/pages/workout/index',
  })
}

const onDietDetail = () => {
  uni.switchTab({
    url: '/pages/diet/index',
  })
}

const onQuickAddMeal = (meal: string) => {
  console.log('快速添加餐次:', meal)
}

const onAiCoachDetail = () => {
  uni.switchTab({
    url: '/pages/ai-coach/index',
  })
}

const onAskCoach = () => {
  uni.switchTab({
    url: '/pages/ai-coach/index',
  })
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #F7F8FA;
  display: flex;
  flex-direction: column;
}

/* 白卡片顶栏：安全区 + 胶囊高度，右侧留给微信胶囊 */
.home-top-strip {
  flex-shrink: 0;
  width: 100%;
  background-color: #FFFFFF;
  border-radius: 0 0 36rpx 36rpx;
  box-shadow: 0 8rpx 28rpx rgba(116, 192, 67, 0.12);
  overflow: hidden;
}

.strip-safe {
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
  min-height: 88rpx;
  background-color: #FFFFFF;
}

.strip-band {
  min-height: 128rpx;
  padding: 8rpx 200rpx 24rpx 28rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
}

.brand-mark {
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  background-color: #74C043;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6rpx 16rpx rgba(116, 192, 67, 0.35);
}

.brand-mark-text {
  color: #FFFFFF;
  font-size: 36rpx;
  font-weight: 800;
  line-height: 1;
}

.brand-copy {
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-name {
  font-size: 36rpx;
  font-weight: 800;
  color: #111111;
  letter-spacing: -0.5rpx;
  line-height: 1.2;
}

.brand-meta {
  margin-top: 8rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.brand-rule {
  width: 28rpx;
  height: 6rpx;
  border-radius: 6rpx;
  background-color: #74C043;
  margin-right: 10rpx;
  flex-shrink: 0;
}

.brand-hint {
  font-size: 22rpx;
  font-weight: 500;
  color: #8E8E93;
  line-height: 1.2;
}

.scroll-content {
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

.inner-padding {
  padding: 24rpx 28rpx 40rpx 28rpx;
}

.bottom-spacer {
  height: 30rpx;
}
</style>
