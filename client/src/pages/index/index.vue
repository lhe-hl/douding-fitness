<template>
  <view class="page-container">
    <!-- 固定顶栏：安全区与胶囊下方，右侧留给微信胶囊 -->
    <view class="home-top-strip">
      <view class="strip-safe"></view>
      <view class="strip-capsule"></view>
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
    <!-- 与固定顶栏同高，把滚动区顶到顶栏下面 -->
    <view class="home-top-spacer">
      <view class="strip-safe"></view>
      <view class="strip-capsule"></view>
      <view class="strip-band"></view>
    </view>

    <!-- 滚动区域从固定顶栏下沿开始，内容不会滑到顶栏下面 -->
    <view class="scroll-wrap">
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

<style>
page {
  height: 100%;
  overflow: hidden;
  background-color: #F7F8FA;
}
</style>

<style scoped>
.page-container {
  height: 100%;
  background-color: #F7F8FA;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 固定白卡片：先让出安全区和胶囊，品牌行在胶囊下面，右侧留白 */
.home-top-strip {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background-color: #FFFFFF;
  border-radius: 0 0 36rpx 36rpx;
  box-shadow: 0 8rpx 28rpx rgba(116, 192, 67, 0.12);
  overflow: hidden;
}

.home-top-spacer {
  flex-shrink: 0;
  width: 100%;
  visibility: hidden;
}

.strip-safe {
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
  min-height: 88rpx;
}

.strip-capsule {
  height: 112rpx;
}

.strip-band {
  height: 132rpx;
  padding: 0 200rpx 0 28rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
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

.scroll-wrap {
  flex: 1;
  height: 0;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}

.scroll-content {
  height: 100%;
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
