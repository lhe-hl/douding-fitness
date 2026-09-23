<template>
  <view class="diet-card">
    <!-- 标题行 -->
    <view class="card-header" @tap="emit('click-detail')">
      <text class="title">饮食和热量</text>
      <text class="arrow">›</text>
    </view>

    <!-- 主体内容：左侧卡路里环 + 右侧营养素与快速录入 -->
    <view class="content-row">
      <!-- 左侧：热量表盘环 -->
      <view class="calorie-col">
        <view class="calorie-ring-gauge">
          <view class="gauge-center">
            <text class="label-top">热量</text>
            <text class="calorie-number">{{ currentCalories }}</text>
            <text class="label-target">/ {{ targetCalories }} kcal</text>
          </view>
        </view>

        <!-- 缺口状态胶囊 -->
        <view class="deficit-badge">
          <text class="flame-mini">🔥</text>
          <text class="deficit-text">{{ deficitText }}</text>
        </view>
      </view>

      <!-- 右侧：营养素进度与快速添加 -->
      <view class="macro-col">
        <!-- 蛋白质 -->
        <view class="macro-item">
          <view class="macro-row">
            <text class="macro-name">蛋白质</text>
            <text class="macro-val">{{ macros.protein.displayValue }}</text>
          </view>
          <view class="progress-bar">
            <view
              class="progress-fill"
              :style="{ width: macros.protein.current + '%', background: '#70C536' }"
            ></view>
          </view>
        </view>

        <!-- 碳糖质 -->
        <view class="macro-item">
          <view class="macro-row">
            <text class="macro-name">碳糖质</text>
            <text class="macro-val">{{ macros.carbs.displayValue }}</text>
          </view>
          <view class="progress-bar">
            <view
              class="progress-fill"
              :style="{ width: macros.carbs.current + '%', background: '#FFA238' }"
            ></view>
          </view>
        </view>

        <!-- 脂肪 -->
        <view class="macro-item">
          <view class="macro-row">
            <text class="macro-name">脂肪</text>
            <text class="macro-val">{{ macros.fat.displayValue }}</text>
          </view>
          <view class="progress-bar">
            <view
              class="progress-fill"
              :style="{ width: macros.fat.current + '%', background: '#FF5E3A' }"
            ></view>
          </view>
        </view>

        <!-- 快速添加 -->
        <view class="quick-add-section">
          <text class="quick-add-title">快速添加</text>
          <view class="meal-buttons-row">
            <view
              class="meal-btn"
              :class="{ 'meal-btn-active': selectedMeal === 'breakfast' }"
              @tap="selectMeal('breakfast')"
            >
              <text class="meal-text">早餐</text>
            </view>
            <view
              class="meal-btn"
              :class="{ 'meal-btn-active': selectedMeal === 'lunch' }"
              @tap="selectMeal('lunch')"
            >
              <text class="meal-text">午餐</text>
            </view>
            <view
              class="meal-btn"
              :class="{ 'meal-btn-active': selectedMeal === 'dinner' }"
              @tap="selectMeal('dinner')"
            >
              <text class="meal-text">晚餐</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MacroItem } from '../types'

interface Props {
  currentCalories?: number
  targetCalories?: number
  deficitText?: string
  macros?: {
    protein: MacroItem
    carbs: MacroItem
    fat: MacroItem
  }
}

const props = withDefaults(defineProps<Props>(), {
  currentCalories: 1450,
  targetCalories: 1800,
  deficitText: '热量缺口状态',
  macros: () => ({
    protein: { name: '蛋白质', current: 75, target: 100, color: '#70C536', displayValue: '1800 kcal' },
    carbs: { name: '碳糖质', current: 48, target: 100, color: '#FFA238', displayValue: '30/0%' },
    fat: { name: '脂肪', current: 28, target: 100, color: '#FF5E3A', displayValue: '10/5%' },
  }),
})

const emit = defineEmits<{
  (e: 'click-detail'): void
  (e: 'quick-add', meal: string): void
}>()

const selectedMeal = ref<'breakfast' | 'lunch' | 'dinner'>('breakfast')

const selectMeal = (meal: 'breakfast' | 'lunch' | 'dinner') => {
  selectedMeal.value = meal
  emit('quick-add', meal)
  uni.showToast({
    title: `已选择${meal === 'breakfast' ? '早餐' : meal === 'lunch' ? '午餐' : '晚餐'}`,
    icon: 'none',
  })
}
</script>

<style scoped>
.diet-card {
  background: #FFFFFF;
  border-radius: 36rpx;
  padding: 36rpx 32rpx;
  margin-top: 24rpx;
  box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.035);
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

.content-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 28rpx;
}

/* 左侧热量环 */
.calorie-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 250rpx;
}

.calorie-ring-gauge {
  width: 210rpx;
  height: 210rpx;
  border-radius: 50%;
  background: conic-gradient(
    #70C536 0deg 190deg,
    #FFA238 190deg 280deg,
    #F0F3F7 280deg 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
}

.gauge-center {
  width: 174rpx;
  height: 174rpx;
  border-radius: 50%;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.label-top {
  font-size: 22rpx;
  color: #666666;
  font-weight: 600;
}

.calorie-number {
  font-size: 48rpx;
  font-weight: 900;
  color: #111111;
  line-height: 1.1;
  letter-spacing: -1rpx;
}

.label-target {
  font-size: 20rpx;
  color: #999999;
  font-weight: 500;
  margin-top: 2rpx;
}

.deficit-badge {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #FFF4EB;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  margin-top: 20rpx;
}

.flame-mini {
  font-size: 22rpx;
  margin-right: 6rpx;
}

.deficit-text {
  font-size: 22rpx;
  color: #FF7B00;
  font-weight: 700;
}

/* 右侧营养素 */
.macro-col {
  flex: 1;
  margin-left: 28rpx;
  display: flex;
  flex-direction: column;
}

.macro-item {
  margin-bottom: 14rpx;
}

.macro-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6rpx;
}

.macro-name {
  font-size: 26rpx;
  font-weight: 700;
  color: #222222;
}

.macro-val {
  font-size: 22rpx;
  color: #666666;
  font-weight: 600;
}

.progress-bar {
  height: 12rpx;
  background: #EEF2F6;
  border-radius: 10rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10rpx;
  transition: width 0.4s ease;
}

/* 快速添加 */
.quick-add-section {
  margin-top: 14rpx;
}

.quick-add-title {
  font-size: 26rpx;
  font-weight: 800;
  color: #1A1A1A;
  display: block;
  margin-bottom: 14rpx;
}

.meal-buttons-row {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
}

.meal-btn {
  flex: 1;
  background: #F4F6F9;
  padding: 12rpx 0;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.meal-btn-active {
  background: #74C043;
}

.meal-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #2A3036;
}

.meal-btn-active .meal-text {
  color: #FFFFFF;
}
</style>
