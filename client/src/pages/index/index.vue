<template>
  <view class="page-container">
    <!-- 顶部状态栏避让占位 -->
    <view class="status-bar-placeholder"></view>

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
          :week-count="4"
          :tags="['胸肩塑形', '有氧燃脂']"
          @click-detail="onWorkoutDetail"
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
import HomeHeader from './components/HomeHeader.vue'
import WorkoutCard from './components/WorkoutCard.vue'
import DietCard from './components/DietCard.vue'
import AiCoachCard from './components/AiCoachCard.vue'

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

/* 顶部状态栏自适应 */
.status-bar-placeholder {
  height: env(safe-area-inset-top);
  min-height: 48rpx;
  background-color: #F7F8FA;
}

.scroll-content {
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

.inner-padding {
  padding: 16rpx 28rpx 40rpx 28rpx;
}

.bottom-spacer {
  height: 30rpx;
}
</style>
